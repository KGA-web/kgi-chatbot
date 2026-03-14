import { NextRequest, NextResponse } from 'next/server';
import { generateContextPrompt } from '@/data/knowledgeBase';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 });
    }
    
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const contextPrompt = generateContextPrompt(message);

    const messages = [
      { role: 'system', content: contextPrompt },
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
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
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    return NextResponse.json({ 
      reply,
      success: true 
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    return NextResponse.json(
      { 
        reply: 'I apologize, but I\'m experiencing technical difficulties. Please call 808 866 0000 for immediate assistance or try again later.',
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
}