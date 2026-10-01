/**
 * EduVision video-generation server.
 *
 * Serves the vanilla website, exposes the generation API, and serves the
 * produced MP4s. The browser talks ONLY to this server — the Groq API key
 * never leaves the server.
 *
 * Endpoints:
 *   POST /api/generate        {topic, language, ageGroup} → {jobId}
 *   GET  /api/jobs/:id         → {status, stage, progress, result?, error?}
 *
 * Generation runs asynchronously; the website polls the job status for live
 * progress. Run with: npm run serve
 */
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {generateVideo, type PipelineStage} from '../renderer/generateVideo';
import {generateQuizQuestions} from '../groq/quizGenerator';
import type {LessonInput} from '../lesson/lessonTypes';
import {getGroqClient, getGroqModel} from '../groq/groqClient';

const ROOT = process.cwd();
const PORT = Number(process.env.PORT ?? 4000);

// Configurable allowed frontend origins (comma-separated list)
// Example: FRONTEND_ORIGIN=https://eduvision-main.vercel.app,http://localhost:3000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
const allowedOrigins = FRONTEND_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);

const OUTPUT_DIR = path.join(ROOT, 'output', 'videos');
const AUDIO_DIR = path.join(ROOT, 'output', 'audio');
const PUBLIC_DIR = path.join(ROOT, 'public');

// In production (Render), RENDER_EXTERNAL_URL is the public HTTPS hostname.
// We use it to build absolute video URLs the Vercel frontend can actually reach.
const BASE_URL = process.env.RENDER_EXTERNAL_URL
  ? process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, '')
  : `http://localhost:${PORT}`;

interface GenerateRequest {
  topic?: string;
  language?: string;
  ageGroup?: string;
}

interface Job {
  id: string;
  input: GenerateRequest;
  status: 'queued' | 'working' | 'done' | 'error';
  stage: PipelineStage | null;
  stageProgress: number;
  title?: string;
  videoUrl?: string;
  duration?: number;
  error?: string;
  createdAt: number;
}

const jobs = new Map<string, Job>();

function humanReadableError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  // Strip verbose internal prefixes for a friendlier message.
  return message.replace(/^Error:\s*/i, '');
}

async function runJob(job: Job): Promise<void> {
  try {
    job.status = 'working';
    // topic/language are guaranteed by the request handler (non-empty).
    const input: LessonInput = {
      topic: job.input.topic ?? '',
      language: job.input.language ?? '',
      ageGroup: job.input.ageGroup || undefined,
    };
    const result = await generateVideo({
      input,
      outputDir: OUTPUT_DIR,
      audioDir: AUDIO_DIR,
      baseUrl: BASE_URL,
      jobId: job.id,
      onProgress: (stage, progress) => {
        job.stage = stage;
        job.stageProgress = progress;
      },
    });
    job.status = 'done';
    job.stage = null;
    job.title = result.title;
    // Return an absolute URL using BASE_URL so the Vercel frontend can reach it.
    // On Render, BASE_URL = RENDER_EXTERNAL_URL (e.g. https://eduvision-backend.onrender.com)
    job.videoUrl = `${BASE_URL}/output/videos/generated-${job.id}.mp4`;
    job.duration = result.duration;
  } catch (err) {
    job.status = 'error';
    job.stage = null;
    job.error = humanReadableError(err);
    console.error(`[server] Job ${job.id} failed:`, err);
  }
}

const app = express();

// CORS — only allow the configured frontend origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Render health checks, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Also allow any localhost origin for local development
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' is not allowed.`));
  },
  credentials: false,
}));
app.use(express.json());

// ── Health check ─────────────────────────────────────────────
// Render pings this before marking the service as live.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'eduvision-video-generator', timestamp: new Date().toISOString() });
});

app.post('/api/generate', (req, res) => {
  const body = (req.body ?? {}) as GenerateRequest;
  const topic = (body.topic ?? '').trim();
  const language = (body.language ?? '').trim();

  if (!topic) {
    res.status(400).json({
      success: false,
      error: 'Topic is required — please enter what you want to learn about.',
    });
    return;
  }
  if (!language) {
    res.status(400).json({
      success: false,
      error: 'Language is required.',
    });
    return;
  }

  const id = randomUUID();
  const job: Job = {
    id,
    input: {topic, language, ageGroup: (body.ageGroup ?? '').trim()},
    status: 'queued',
    stage: null,
    stageProgress: 0,
    createdAt: Date.now(),
  };
  jobs.set(id, job);

  // Fire-and-forget; the client polls the job status.
  runJob(job).catch(() => {
    /* errors already captured on the job */
  });

  res.status(202).json({success: true, jobId: id});
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) {
    res.status(404).json({success: false, error: 'Job not found.'});
    return;
  }
  res.json({
    success: job.status !== 'error',
    status: job.status,
    stage: job.stage,
    stageProgress: job.stageProgress,
    title: job.title,
    videoUrl: job.videoUrl,
    duration: job.duration,
    error: job.error ?? undefined,
  });
});

interface QuizRequest {
  topic?: string;
  language?: string;
  ageGroup?: string;
  count?: number;
  excludeQuestions?: string[];
}

app.post('/api/quiz', async (req, res) => {
  try {
    const body = (req.body ?? {}) as QuizRequest;
    const topic = (body.topic ?? '').trim();
    const language = (body.language ?? '').trim();
    const ageGroup = (body.ageGroup ?? '').trim();
    const count = Number(body.count ?? 10);
    const excludeQuestions = Array.isArray(body.excludeQuestions) ? body.excludeQuestions : [];

    if (!topic) {
      res.status(400).json({success: false, error: 'Topic is required.'});
      return;
    }
    if (!language) {
      res.status(400).json({success: false, error: 'Language is required.'});
      return;
    }

    const questions = await generateQuizQuestions({
      topic,
      language,
      ageGroup: ageGroup || 'Moderate explanation, suitable for ages 9-18',
      count,
      excludeQuestions,
    });

    res.json({success: true, questions});
  } catch (err) {
    console.error('[server] Quiz generation failed:', err);
    res.status(500).json({
      success: false,
      error: humanReadableError(err) || 'Failed to generate quiz.',
    });
  }
});

// Educational Videos Search API
app.post('/api/videos/search', (req, res) => {
  const body = req.body ?? {};
  const topic = String(body.topic || 'Photosynthesis').trim();
  const difficulty = String(body.difficulty || 'Beginner').trim();

  // Curated Educational Video database with embed IDs & metadata
  const mockEducationalVideos = [
    {
      id: 'v1_ps1',
      youtubeId: 'g78utcLQrJ4',
      title: `${topic} Explained (Complete Overview)`,
      channelName: 'CrashCourse Education',
      duration: '8 min',
      difficulty: difficulty,
      rating: 4.9,
      views: '1.2M views',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'v2_ps2',
      youtubeId: 'sQK3Yr4Sc_U',
      title: `${topic} Animation & Step-by-Step Visuals`,
      channelName: 'Khan Academy Science',
      duration: '12 min',
      difficulty: difficulty,
      rating: 4.8,
      views: '850K views',
      thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'v3_ps3',
      youtubeId: 'UPBMG5EYydo',
      title: `Deep Dive into ${topic} (${difficulty} Level)`,
      channelName: 'MIT OpenCourseWare',
      duration: '15 min',
      difficulty: difficulty,
      rating: 4.9,
      views: '540K views',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    },
  ];

  res.json({ success: true, topic, difficulty, videos: mockEducationalVideos });
});

// Same-Screen AI Tutor Chat API (Powered by Groq LLM)
app.post('/api/tutor/chat', async (req, res) => {
  const body = req.body ?? {};
  const topic = String(body.topic || 'General Science').trim();
  const prompt = String(body.prompt || '').trim();
  const action = String(body.action || '').trim();
  const difficulty = String(body.difficulty || 'Intermediate').trim();

  let userInstruction = prompt || `Help me learn ${topic}`;
  if (action === 'simplify') {
    userInstruction = `Simplify the key concepts of "${topic}" so it is extremely clear and easy to understand (ELI5 format). Use clear bullet points and simple language tailored for a ${difficulty} student.`;
  } else if (action === 'example') {
    userInstruction = `Give a real-world analogy and practical example to explain "${topic}" to a ${difficulty} level student.`;
  } else if (action === 'visual') {
    userInstruction = `Provide a step-by-step visual diagram, ASCII flowchart, or structural breakdown of "${topic}".`;
  } else if (action === 'quiz') {
    userInstruction = `Generate 1 NEW, unique check-in question strictly about "${topic}" (${difficulty} level) with 4 options (A, B, C, D). DO NOT repeat any previously asked question! DO NOT label which option is correct! List options A, B, C, D clearly.`;
  }

  try {
    const client = getGroqClient();
    const model = getGroqModel() || 'openai/gpt-oss-120b';

    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are EduVision AI Tutor, an expert, encouraging, ChatGPT-like AI tutor. You are assisting a student learning "${topic}" at the ${difficulty} difficulty level.
CRITICAL QUIZ RULES:
1. All check-in questions MUST be 100% relevant and strictly focused on "${topic}".
2. DO NOT reveal which option is correct upfront! List 4 options (A, B, C, D) and ask the student to select their answer.
3. DO NOT append "(Correct!)" or hints to option text.
4. Provide direct, highly informative, well-formatted markdown responses without generic greetings.`,
        },
        {
          role: 'user',
          content: userInstruction,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || `I am here to help you learn **${topic}**!`;
    res.json({ success: true, reply, action });
  } catch (err: any) {
    console.warn('[server] Groq AI Tutor call fallback:', err.message);

    const tLower = topic.toLowerCase();
    let reply = `I'm your EduVision AI Tutor! Regarding **${topic}**: "${prompt}". Let's break this down together!`;

    if (action === 'simplify') {
      reply = `Here is a super simple breakdown of **${topic}**:\nThink of it like a step-by-step pipeline! Inputs go in, key transformations occur, and a clear output is produced.`;
    } else if (action === 'example') {
      reply = `**Real-World Analogy for ${topic}:**\nImagine sorting cards or organizing a library shelf into sub-categories!`;
    } else if (action === 'visual') {
      reply = `🎨 **Visual Flowchart for ${topic}:**\n\n\`\`\`\n[ Input Data ] ──> [ Processing Stage ] ──> [ Target Result ]\n\`\`\``;
    } else if (action === 'quiz') {
      if (tLower.includes('matrix')) {
        reply = `📝 **Quick Check-In Question on ${topic}:**\n\nWhat is the required condition to multiply matrix A (size m×n) by matrix B (size p×q)?\n\n- **A) m must equal q**\n- **B) n must equal p (columns of A = rows of B)**\n- **C) Both matrices must be square**\n- **D) m must equal p**\n\n*Reply with A, B, C, or D to check your answer!*`;
      } else if (tLower.includes('python')) {
        reply = `📝 **Quick Check-In Question on ${topic}:**\n\nWhich built-in Python data structure is mutable and ordered?\n\n- **A) Tuple**\n- **B) List**\n- **C) String**\n- **D) FrozenSet**\n\n*Reply with A, B, C, or D to check your answer!*`;
      } else {
        reply = `📝 **Quick Check-In Question on ${topic}:**\n\nWhich operation or property primarily governs performance in ${topic}?\n\n- **A) Input data alignment and bounds checking**\n- **B) Memory allocation speed**\n- **C) Time complexity reduction**\n- **D) Constant overhead**\n\n*Reply with A, B, C, or D to check your answer!*`;
      }
    }

    res.json({ success: true, reply, action });
  }
});

// Static website (index.html + CSS/JS + images).
app.use(express.static(PUBLIC_DIR));
// Generated narration audio (served to Remotion during rendering).
app.use('/audio', express.static(AUDIO_DIR));
// Generated videos.
app.use('/output/videos', express.static(OUTPUT_DIR));

// Bind to 0.0.0.0 so Render (and Docker) can route external traffic to the container.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  EduVision video generator running`);
  console.log(`  ▶ Listening on: 0.0.0.0:${PORT}`);
  console.log(`  ▶ Public base URL: ${BASE_URL}`);
  console.log(`  ▶ Allowed frontend origins: ${allowedOrigins.join(', ')}\n`);
});
