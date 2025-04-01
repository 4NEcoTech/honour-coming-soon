import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Simulate encryption logic
    const encryptedUrl = Buffer.from(body.url).toString('base64');

    return NextResponse.json({ encryptedUrl });
  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: 'GET method not allowed' }, { status: 405 });
}
