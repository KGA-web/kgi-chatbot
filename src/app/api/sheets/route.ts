import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

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
    const { name, phone, userType, course, inquiry } = body;

    if (!name || !phone || !userType) {
      return NextResponse.json(
        { error: 'Name, phone, and user type are required' },
        { status: 400 }
      );
    }

    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const now = new Date().toISOString();
    const row = [
      now,
      name,
      userType,
      phone,
      course || '',
      inquiry || '',
      'New'
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId!,
      range: 'Sheet1!A:A',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Enquiry saved successfully' 
    });

  } catch (error: any) {
    console.error('Sheets API Error:', error);
    return NextResponse.json(
      { error: 'Failed to save enquiry', details: error.message },
      { status: 500 }
    );
  }
}