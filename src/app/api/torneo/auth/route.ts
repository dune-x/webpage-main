import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
       console.error("ADMIN_PASSWORD not set in environment variables");
       return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
