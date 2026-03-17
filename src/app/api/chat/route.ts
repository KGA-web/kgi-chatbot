import { NextRequest, NextResponse } from 'next/server';
import { kgiKnowledgeBase, generateContextPrompt } from '@/data/knowledgeBase';

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_LENGTH = 20;

function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH);
}

function isValidRole(role: string): boolean {
  return role === 'user' || role === 'assistant';
}

async function fetchKGIWebsite(): Promise<string> {
  const pages = [
    // KGI Main
    'https://www.kgi.edu.in/',
    'https://www.kgi.edu.in/AboutWhyKGI',
    'https://www.kgi.edu.in/mission-and-vission',
    'https://www.kgi.edu.in/milestone',
    'https://www.kgi.edu.in/FounderMessageKGI',
    'https://www.kgi.edu.in/leadership',
    'https://www.kgi.edu.in/industrial-association',
    'https://www.kgi.edu.in/advisory-board',
    'https://www.kgi.edu.in/ContactKGI',
    // KIHS (Health Sciences)
    'https://www.kgi.edu.in/KIHS/',
    'https://www.kgi.edu.in/KIHS/BSCren',
    'https://www.kgi.edu.in/KIHS/BSCres',
    'https://www.kgi.edu.in/KIHS/bscOtt',
    'https://www.kgi.edu.in/KIHS/bscMit',
    'https://www.kgi.edu.in/KIHS/BSCmlt',
    'https://www.kgi.edu.in/KIHS/WhyKIHS',
    'https://www.kgi.edu.in/KIHS/Management',
    'https://www.kgi.edu.in/KIHS/DeanMessage',
    'https://www.kgi.edu.in/KIHS/faculty-list',
    'https://www.kgi.edu.in/KIHS/blfcn',
    'https://www.kgi.edu.in/KIHS/kiahs',
    'https://www.kgi.edu.in/KIHS/Library',
    'https://www.kgi.edu.in/KIHS/campusClubs',
    'https://www.kgi.edu.in/KIHS/campusFacilities',
    'https://www.kgi.edu.in/KIHS/campusGallery',
    'https://www.kgi.edu.in/KIHS/placementsOverview',
    'https://www.kgi.edu.in/KIHS/placementsTraining',
    'https://www.kgi.edu.in/KIHS/placementsRecruitingPartners',
    'https://www.kgi.edu.in/KIHS/alumni',
    // KIMS (Management Studies)
    'https://kimsbengaluru.edu.in/',
    'https://kimsbengaluru.edu.in/mission-and-vission',
    'https://kimsbengaluru.edu.in/management',
    'https://kimsbengaluru.edu.in/directorMessage',
    'https://kimsbengaluru.edu.in/principalsMessage',
    'https://kimsbengaluru.edu.in/advisory-board',
    'https://kimsbengaluru.edu.in/bba',
    'https://kimsbengaluru.edu.in/BBA-ava',
    'https://kimsbengaluru.edu.in/BCom',
    'https://kimsbengaluru.edu.in/bcom-logistics',
    'https://kimsbengaluru.edu.in/BCA',
    'https://kimsbengaluru.edu.in/BVA',
    'https://kimsbengaluru.edu.in/BVA-aa',
    'https://kimsbengaluru.edu.in/BA-cpj',
    'https://kimsbengaluru.edu.in/MBA',
    'https://kimsbengaluru.edu.in/global-certifications',
    'https://kimsbengaluru.edu.in/Doctoral_prog',
    'https://kimsbengaluru.edu.in/valueadded',
    'https://kimsbengaluru.edu.in/fees',
    'https://kimsbengaluru.edu.in/WhyKIMS',
    'https://kimsbengaluru.edu.in/faculty-list',
    'https://kimsbengaluru.edu.in/campusFacilities',
    'https://kimsbengaluru.edu.in/Student_support',
    'https://kimsbengaluru.edu.in/Examinations',
    'https://kimsbengaluru.edu.in/Career-Guidance-and-Training',
    'https://kimsbengaluru.edu.in/library',
    'https://kimsbengaluru.edu.in/campusClubs',
    'https://kimsbengaluru.edu.in/campusGallery',
    'https://kimsbengaluru.edu.in/placementsOverview',
    'https://kimsbengaluru.edu.in/placementsTraining',
    // KIHM (Hotel Management)
    'https://kihm.kgi.edu.in/',
    'https://kihm.kgi.edu.in/about.php',
    'https://kihm.kgi.edu.in/faculty.php',
    'https://kihm.kgi.edu.in/facilities.php',
    'https://kihm.kgi.edu.in/contact.php',
  ];

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  };

  const results = await Promise.allSettled(
    pages.map(async (url) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url, { headers, signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) return '';
        
        const html = await response.text();
        const text = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .slice(0, 3000);
        
        return `[${url}]\n${text}\n`;
      } catch (e) {
        return '';
      }
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled' && !!r.value)
    .map(r => r.value)
    .join('\n\n');
}

async function searchGoogle(query: string): Promise<string> {
  try {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
      return '';
    }
    
    const searchQuery = `${query} Koshys Group of Institutions Bangalore`;
    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        query: searchQuery,
        numResults: 3
      })
    });
    
    if (!response.ok) {
      return '';
    }
    
    const data = await response.json();
    const results = data.results || [];
    
    return results.map((r: any) => `${r.title}: ${r.url} - ${r.text?.slice(0, 500) || ''}`).join('\n\n');
  } catch (error) {
    console.error('Search error:', error);
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    
    const body = await request.json();
    let { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    message = sanitizeInput(message);
    
    if (!message) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    if (!Array.isArray(history)) {
      history = [];
    }

    history = history
      .filter((m: any) => m && m.role && m.content && typeof m.content === 'string')
      .slice(-MAX_HISTORY_LENGTH)
      .map((m: any) => ({
        role: isValidRole(m.role) ? m.role : 'user',
        content: sanitizeInput(m.content)
      }));

    const [kgiContent, searchResults] = await Promise.all([
      fetchKGIWebsite(),
      searchGoogle(message)
    ]);

    const contextPrompt = generateContextPrompt(message);

    const messages = [
      { role: 'system', content: contextPrompt },
      ...history,
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('AI service error');
    }

    const data = await response.json();
    let reply = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    reply = sanitizeInput(reply);

    return NextResponse.json({ 
      reply,
      success: true 
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    
    return NextResponse.json(
      { 
        reply: 'I apologize, but I\'m experiencing technical difficulties. Please call 808 866 0000 for immediate assistance or try again later.',
        success: false,
        debug: errorMessage
      },
      { status: 500 }
    );
  }
}
