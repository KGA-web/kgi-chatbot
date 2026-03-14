import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

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
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });

  return google.sheets({ version: 'v4', auth });
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

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json({ error: 'Service configuration error' }, { status: 500 });
    }

    const sheets = await getSheetsClient();
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
    console.error('Sheets API Error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}