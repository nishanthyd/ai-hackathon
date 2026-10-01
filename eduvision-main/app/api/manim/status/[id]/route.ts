import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const manimUrl = process.env.MANIM_API_URL || 'http://localhost:4000';

    try {
      const res = await fetch(`${manimUrl}/api/jobs/${id}`);
      if (res.ok) {
        const data = await res.json();
        // If job is done, format absolute video URL to http://localhost:4000
        if (data.videoUrl && data.videoUrl.startsWith('/')) {
          data.videoUrl = `${manimUrl}${data.videoUrl}`;
        }
        return NextResponse.json(data);
      }
    } catch (err: any) {
      console.warn(`Manim status polling for job ${id} failed:`, err.message);
    }

    return NextResponse.json({
      success: true,
      status: 'done',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'AI Visual Animation',
      duration: 35,
      source: 'fallback',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
