import { NextRequest, NextResponse } from 'next/server';
import { generateContextPrompt } from '@/data/knowledgeBase';

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
    
    return NextResponse.json(
      { 
        reply: 'I apologize, but I\'m experiencing technical difficulties. Please call 808 866 0000 for immediate assistance or try again later.',
        success: false
      },
      { status: 500 }
    );
  }
}