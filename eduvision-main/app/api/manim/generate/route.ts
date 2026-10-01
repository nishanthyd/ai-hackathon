import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic = 'Recursion', difficulty = 'Intermediate' } = body;

    const manimUrl = process.env.MANIM_API_URL;

    // If MANIM_API_URL is not set, return a clear error instead of
    // silently trying localhost:4000 which will always fail on Vercel.
    if (!manimUrl || manimUrl.trim() === '') {
      console.warn('[manim/generate] MANIM_API_URL environment variable is not configured.');
      return NextResponse.json({
        success: false,
        error: 'Video generation backend is not configured. Set MANIM_API_URL to your Render service URL.',
        source: 'config_error',
      }, { status: 503 });
    }

    try {
      const res = await fetch(`${manimUrl.replace(/\/+$/, '')}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, language: 'English', ageGroup: difficulty }),
        // Render cold-start can be slow; allow up to 10s to accept the job
        signal: AbortSignal.timeout(10000),
      });
      const data = await res.json();
      if (data.success && data.jobId) {
        return NextResponse.json({
          success: true,
          jobId: data.jobId,
          source: 'manim_backend',
        });
      }
      return NextResponse.json({
        success: false,
        error: data.error || 'Manim backend rejected the request.',
        source: 'manim_backend_error',
      }, { status: 502 });
    } catch (err: any) {
      console.error('Manim backend unreachable:', err.message);
      return NextResponse.json({
        success: false,
        error: `Could not reach video generation backend: ${err.message}`,
        source: 'manim_unreachable',
      }, { status: 502 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
