import { useMemo, useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import TopicInputForm from '../components/generate/TopicInputForm'
import GenerationProgress from '../components/generate/GenerationProgress'
import VideoResultPanel from '../components/generate/VideoResultPanel'
import QuizCard, { type QuizBatch } from '../components/generate/QuizCard'
import { motionVariants } from '../utils/animation'
import {
  startGeneration,
  pollJob,
  getFullVideoUrl,
  generateQuiz,
  type JobStatusResponse,
} from '../utils/eduvisionApi'

interface GenerateVideoPageProps {
  reducedMotion: boolean
}

export interface VideoResultData {
  title: string
  language: string
  grade: string
  duration: string
  description: string
  videoUrl?: string
}

const defaultForm = {
  topic: '',
  language: 'English',
  grade: 'Moderate',
}

const steps = [
  'Generating script',
  'Building scenes',
  'Rendering animation',
  'Preparing lesson',
]

function getAgeGroupText(levelLabel: string): string {
  switch (levelLabel) {
    case 'Simple':
      return 'Simple explanation, suitable for ages 3-8'
    case 'Detailed':
      return 'Detailed explanation, suitable for ages 18+'
    case 'Moderate':
    default:
      return 'Moderate explanation, suitable for ages 9-18'
  }
}

function mapStageToStepIndex(stage: string | null): number {
  if (!stage) return 1
  switch (stage) {
    case 'domain-analysis':
    case 'plan':
      return 1 // Generating script
    case 'tts':
    case 'manim-script':
    case 'lesson':
      return 2 // Building scenes
    case 'manim-render':
    case 'render':
      return 3 // Rendering animation
    case 'mux':
    case 'completed':
      return 4 // Preparing lesson
    default:
      return 1
  }
}

function formatDuration(seconds?: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function GenerateVideoPage({ reducedMotion }: GenerateVideoPageProps) {
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [videoResult, setVideoResult] = useState<VideoResultData | null>(null)

  // Quiz state managed as batch rounds
  const [quizBatches, setQuizBatches] = useState<QuizBatch[]>([])
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false)
  const [quizError, setQuizError] = useState<string | null>(null)
  const [isLoadingMoreQuiz, setIsLoadingMoreQuiz] = useState(false)
  const [excludeQuestions, setExcludeQuestions] = useState<string[]>([])

  const cancelPollRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => {
      cancelPollRef.current?.()
    }
  }, [])

  const validation = useMemo(() => {
    const next: Record<string, string> = {}
    if (!form.topic.trim()) next.topic = 'A focused subject or concept helps the AI generate a stronger video.'
    return next
  }, [form])

  const handleSubmit = async () => {
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setErrors({})
    setErrorMessage(null)
    setIsSubmitting(true)
    setCurrentStep(1)
    setVideoResult(null)
    setQuizBatches([])
    setQuizError(null)
    setExcludeQuestions([])

    // Stop any existing polling
    cancelPollRef.current?.()

    try {
      const { jobId } = await startGeneration({
        topic: form.topic.trim(),
        language: form.language,
        ageGroup: getAgeGroupText(form.grade),
      })

      const stopPolling = pollJob(jobId, {
        intervalMs: 2000,
        onUpdate: (job: JobStatusResponse) => {
          if (job.status === 'queued' || job.status === 'working') {
            const stepNum = mapStageToStepIndex(job.stage)
            setCurrentStep(stepNum)
          } else if (job.status === 'done') {
            setCurrentStep(steps.length)
            setIsSubmitting(false)
            setVideoResult({
              title: job.title || `AI Lesson: ${form.topic}`,
              language: form.language,
              grade: form.grade,
              duration: formatDuration(job.duration),
              description: `A cinematic educational animation for "${form.topic}", tailored for ${form.grade} explanation depth in ${form.language}.`,
              videoUrl: getFullVideoUrl(job.videoUrl),
            })
          }
        },
        onError: (err: Error) => {
          setIsSubmitting(false)
          setErrorMessage(err.message || 'An unexpected error occurred during video generation.')
        },
      })

      cancelPollRef.current = stopPolling
    } catch (err: unknown) {
      setIsSubmitting(false)
      const message = err instanceof Error ? err.message : String(err)
      setErrorMessage(message || 'Failed to start video generation.')
    }
  }

  const handleGenerateQuiz = async () => {
    if (!form.topic.trim()) return

    setIsGeneratingQuiz(true)
    setQuizError(null)

    try {
      const { questions } = await generateQuiz({
        topic: form.topic.trim(),
        language: form.language,
        ageGroup: getAgeGroupText(form.grade),
        count: 10,
        excludeQuestions: [],
      })

      // Ensure unique IDs per question in batch 1
      const batchQuestions = questions.map((q, idx) => ({
        ...q,
        id: `b1_q${idx}`,
      }))

      const initialBatch: QuizBatch = {
        id: 'batch-1',
        title: 'Round 1 (10 Questions)',
        questions: batchQuestions,
        userAnswers: {},
        isSubmitted: false,
        score: null,
      }

      setQuizBatches([initialBatch])
      setExcludeQuestions(questions.map((q) => q.question))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setQuizError(message || 'Failed to generate quiz.')
    } finally {
      setIsGeneratingQuiz(false)
    }
  }

  const handleSubmitBatch = (batchId: string, userAnswers: Record<string, number>) => {
    setQuizBatches((prevBatches) =>
      prevBatches.map((batch) => {
        if (batch.id !== batchId) return batch
        let correct = 0
        batch.questions.forEach((q) => {
          if (userAnswers[q.id] === q.correctIndex) {
            correct++
          }
        })
        return {
          ...batch,
          userAnswers,
          isSubmitted: true,
          score: { correct, total: batch.questions.length },
        }
      })
    )
  }

  const handleFetchMoreQuestions = async () => {
    setIsLoadingMoreQuiz(true)
    const nextBatchNum = quizBatches.length + 1

    try {
      const { questions } = await generateQuiz({
        topic: form.topic.trim(),
        language: form.language,
        ageGroup: getAgeGroupText(form.grade),
        count: 5,
        excludeQuestions: excludeQuestions,
      })

      // Ensure unique IDs for new batch questions
      const batchQuestions = questions.map((q, idx) => ({
        ...q,
        id: `b${nextBatchNum}_q${idx}`,
      }))

      const newBatch: QuizBatch = {
        id: `batch-${nextBatchNum}`,
        title: `Round ${nextBatchNum} (5 Additional Questions)`,
        questions: batchQuestions,
        userAnswers: {},
        isSubmitted: false,
        score: null,
      }

      setQuizBatches((prev) => [...prev, newBatch])
      setExcludeQuestions((prev) => [...prev, ...questions.map((q) => q.question)])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      alert(`Failed to fetch more questions: ${message}`)
    } finally {
      setIsLoadingMoreQuiz(false)
    }
  }

  const handleReset = () => {
    cancelPollRef.current?.()
    setForm(defaultForm)
    setErrors({})
    setErrorMessage(null)
    setVideoResult(null)
    setCurrentStep(0)
    setIsSubmitting(false)
    setQuizBatches([])
    setQuizError(null)
    setExcludeQuestions([])
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={motionVariants.pageTransition}
      className="space-y-12"
    >
      <section className="pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-8 sm:p-10 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-accent2">AI Video Generation</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight text-textHigh sm:text-3xl">
              Generate cinematic lessons with our AI rendering engine.
            </h1>
            <p className="mt-3 max-w-3xl text-sm sm:text-base leading-7 text-textMid">
              Choose a topic, explanation depth, and language, then watch as our AI lesson planner, TTS narrator, and Manim engine produce a real rendered lesson.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Video generation flow" className="relative pb-12">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          {/* Merged Card: Create a video lesson (Left ~68%) + Generation Progress (Right ~32%) */}
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-8 sm:p-10 shadow-soft backdrop-blur-xl">
            <div className="grid gap-10 lg:grid-cols-[0.68fr_0.32fr]">
              <div>
                <TopicInputForm
                  form={form}
                  errors={errors}
                  onChange={setForm}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
              <div className="border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <GenerationProgress steps={steps} currentStep={currentStep} reducedMotion={reducedMotion} />
              </div>
            </div>
          </div>

          {/* Result Summary Panel */}
          <div>
            <VideoResultPanel
              result={videoResult}
              isGenerating={isSubmitting}
              error={errorMessage}
              onReset={handleReset}
              onGenerateQuiz={handleGenerateQuiz}
              isGeneratingQuiz={isGeneratingQuiz}
            />
          </div>

          {/* Post-Video Quiz Section */}
          {(quizBatches.length > 0 || isGeneratingQuiz || quizError) && (
            <div>
              <QuizCard
                batches={quizBatches}
                isLoading={isGeneratingQuiz}
                error={quizError}
                onSubmitBatch={handleSubmitBatch}
                onFetchMoreQuestions={handleFetchMoreQuestions}
                isLoadingMore={isLoadingMoreQuiz}
              />
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}
