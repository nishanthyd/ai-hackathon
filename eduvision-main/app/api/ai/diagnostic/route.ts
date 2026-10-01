import { NextResponse } from 'next/server';
import { DEMO_DIAGNOSTIC_QUESTIONS } from '@/data/demoData';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject = 'Python' } = body;

    return NextResponse.json({
      success: true,
      subject,
      questions: DEMO_DIAGNOSTIC_QUESTIONS,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
