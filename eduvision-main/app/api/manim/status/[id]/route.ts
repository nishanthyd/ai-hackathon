import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const manimUrl = process.env.MANIM_API_URL;

    // If MANIM_API_URL is not set, return a clear error instead of
    // silently trying localhost:4000 which will always fail on Vercel.
    if (!manimUrl || manimUrl.trim() === '') {
      console.warn('[manim/status] MANIM_API_URL environment variable is not configured.');
      return NextResponse.json({
        success: false,
        status: 'error',
        error: 'Video generation backend is not configured. Set MANIM_API_URL to your Render service URL.',
        source: 'config_error',
      }, { status: 503 });
    }

    try {
      const res = await fetch(`${manimUrl.replace(/\/+$/, '')}/api/jobs/${id}`, {
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const data = await res.json();
        // videoUrl from the backend is already absolute (https://your-render.onrender.com/output/...)
        // No rewriting needed — just pass through.
        return NextResponse.json(data);
      }
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        status: 'error',
        error: errData.error || `Backend returned ${res.status}`,
      }, { status: res.status });
    } catch (err: any) {
      console.error(`Manim status poll for job ${id} failed:`, err.message);
      return NextResponse.json({
        success: false,
        status: 'error',
        error: `Could not reach video generation backend: ${err.message}`,
      }, { status: 502 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
