import { NextRequest, NextResponse } from 'next/server';

const MAX_FIELD_LENGTH = 100;

function sanitizeField(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/[\r\n]/g, ' ')
    .trim()
    .slice(0, MAX_FIELD_LENGTH);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (!phoneRegex.test(cleaned)) return false;
  const digitCount = cleaned.replace(/\D/g, '').length;
  return digitCount >= 10 && digitCount <= 15;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { name, phone, userType, course } = body;

    name = sanitizeField(name);
    phone = sanitizeField(phone);
    userType = sanitizeField(userType || 'student');
    course = sanitizeField(course || '');

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    // Try Apps Script first (free, no service account needed)
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    
    if (appsScriptUrl) {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, course, userType }),
      });
      
      if (response.ok) {
        return NextResponse.json({ success: true });
      }
    }

    // Fallback: Google Sheets API with service account
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json({ error: 'No storage configured' }, { status: 500 });
    }

    const { google } = require('googleapis');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = await google.sheets({ version: 'v4', auth });
    const now = new Date().toISOString();
    const row = [now, name, userType, phone, course, '', 'New'];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:A',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Sheets Error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  
  if (!phone) {
    return NextResponse.json({ error: 'Phone required' }, { status: 400 });
  }

  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  
  if (appsScriptUrl) {
    try {
      const response = await fetch(`${appsScriptUrl}?phone=${encodeURIComponent(phone)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.found) {
          return NextResponse.json({ found: true, name: data.name, phone: data.phone, course: data.course });
        }
        return NextResponse.json({ found: false });
      }
    } catch (e) {
      console.error('Error checking user:', e);
    }
  }
  
  return NextResponse.json({ found: false });
}