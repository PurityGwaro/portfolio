import { NextResponse } from 'next/server';
import { access } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'resume.pdf');

    await access(filePath);

    return NextResponse.json({ exists: true });
  } catch (error) {
    return NextResponse.json({ exists: false });
  }
}
