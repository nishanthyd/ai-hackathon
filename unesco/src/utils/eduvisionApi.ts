/**
 * eduvisionApi.ts — API client for EduVision video generation backend.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '')

export interface GenerateOptions {
  topic: string
  language: string
  ageGroup?: string
}

export interface JobStatusResponse {
  success: boolean
  status: 'queued' | 'working' | 'done' | 'error'
  stage: string | null
  stageProgress: number
  title?: string
  videoUrl?: string
  duration?: number
  error?: string
}

export function getFullVideoUrl(videoUrl: string | undefined): string {
  if (!videoUrl) return ''
  if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
    return videoUrl
  }
  const cleanPath = videoUrl.startsWith('/') ? videoUrl : `/${videoUrl}`
  return `${API_BASE_URL}${cleanPath}`
}

export async function startGeneration(options: GenerateOptions): Promise<{ jobId: string }> {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: options.topic,
      language: options.language,
      ageGroup: options.ageGroup,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.success) {
    const errorMsg = data.error || `Server responded with status ${response.status}`
    throw new Error(errorMsg)
  }

  return { jobId: data.jobId }
}

export async function fetchJobStatus(jobId: string): Promise<JobStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`)
  const data = await response.json().catch(() => ({}))

  if (!response.ok && !data.status) {
    throw new Error(data.error || `Failed to fetch job status (${response.status})`)
  }

  return data as JobStatusResponse
}

export interface PollJobOptions {
  onUpdate: (job: JobStatusResponse) => void
  onError?: (error: Error) => void
  intervalMs?: number
}

export function pollJob(jobId: string, { onUpdate, onError, intervalMs = 2000 }: PollJobOptions): () => void {
  let isCancelled = false
  let timerId: number | null = null

  const checkStatus = async () => {
    if (isCancelled) return

    try {
      const job = await fetchJobStatus(jobId)
      if (isCancelled) return

      onUpdate(job)

      if (job.status === 'done') {
        if (timerId !== null) clearInterval(timerId)
      } else if (job.status === 'error') {
        if (timerId !== null) clearInterval(timerId)
        const err = new Error(job.error || 'Video generation failed on server.')
        if (onError) {
          onError(err)
        }
      }
    } catch (err) {
      if (isCancelled) return
      // Network or fetch error during polling
      if (timerId !== null) clearInterval(timerId)
      const errorObj = err instanceof Error ? err : new Error(String(err))
      if (onError) {
        onError(errorObj)
      }
    }
  }

  // Execute initial check immediately
  checkStatus()

  // Set up timer for recurring checks
  timerId = window.setInterval(checkStatus, intervalMs)

  return () => {
    isCancelled = true
    if (timerId !== null) {
      clearInterval(timerId)
    }
  }
}

export interface QuizQuestion {
  id: string
  question: string
  options: [string, string, string, string]
  correctIndex: number
  explanation: string
}

export interface GenerateQuizOptions {
  topic: string
  language: string
  ageGroup: string
  count?: number
  excludeQuestions?: string[]
}

export async function generateQuiz(options: GenerateQuizOptions): Promise<{ questions: QuizQuestion[] }> {
  const response = await fetch(`${API_BASE_URL}/api/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: options.topic,
      language: options.language,
      ageGroup: options.ageGroup,
      count: options.count ?? 10,
      excludeQuestions: options.excludeQuestions ?? [],
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.success) {
    const errorMsg = data.error || `Server responded with status ${response.status}`
    throw new Error(errorMsg)
  }

  return { questions: data.questions }
}
