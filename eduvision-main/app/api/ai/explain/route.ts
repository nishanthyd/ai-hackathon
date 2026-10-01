import { NextResponse } from 'next/server';
import { evaluateExplainBack } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic = 'Recursion', userExplanation = '' } = body;

    const evaluation = evaluateExplainBack(topic, userExplanation);

    return NextResponse.json({
      success: true,
      topic,
      ...evaluation,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
