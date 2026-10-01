import { NextResponse } from 'next/server';
import { getQuizQuestionsForTopic } from '@/lib/quizPools';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic = 'Recursion', roundIndex = 0, excludeIds = [] } = body;

    const questions = getQuizQuestionsForTopic(topic, roundIndex, excludeIds);

    return NextResponse.json({ success: true, questions });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
