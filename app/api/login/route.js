import { NextResponse } from 'next/server';

export async function POST(request) {
  const data = await request.json();
  if (!data.username || !data.password) {
    return NextResponse.json({ success: false, message: 'Username and password are required' }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: 'Login successful', username: data.username });
}
