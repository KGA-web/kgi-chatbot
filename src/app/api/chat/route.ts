import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq';
import { generateContextPrompt } from '@/data/knowledgeBase';

const groq = new (Groq as any)({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
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

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: messages as any[],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';

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