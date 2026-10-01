import { NextResponse } from 'next/server';
import { getTopicSummary } from '@/lib/topicSummary';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic = 'Recursion', difficulty = 'Intermediate' } = body;

    const summary = getTopicSummary(topic);

    return NextResponse.json({ success: true, summary, topic, difficulty });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
