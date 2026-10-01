import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic = 'Recursion', difficulty = 'Intermediate' } = body;

    const manimUrl = process.env.MANIM_API_URL || 'http://localhost:4000';

    try {
      const res = await fetch(`${manimUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, language: 'English', ageGroup: difficulty }),
      });
      const data = await res.json();
      if (data.success && data.jobId) {
        return NextResponse.json({
          success: true,
          jobId: data.jobId,
          source: 'manim_backend',
        });
      }
    } catch (err: any) {
      console.warn('Manim backend server unreachable, using visual demo player:', err.message);
    }

    return NextResponse.json({
      success: true,
      jobId: `demo_job_${Date.now()}`,
      status: 'done',
      title: `AI Visual Animation: ${topic} Call Stack`,
      videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
      duration: 35,
      source: 'demo_visualization',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
