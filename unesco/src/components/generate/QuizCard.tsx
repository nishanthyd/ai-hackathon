import { useState } from 'react'
import type { QuizQuestion } from '../../utils/eduvisionApi'

export interface QuizBatch {
  id: string
  title: string
  questions: QuizQuestion[]
  userAnswers: Record<string, number>
  isSubmitted: boolean
  score: { correct: number; total: number } | null
}

export interface QuizCardProps {
  batches: QuizBatch[]
  isLoading: boolean
  error: string | null
  onSubmitBatch: (batchId: string, userAnswers: Record<string, number>) => void
  onFetchMoreQuestions: () => void
  isLoadingMore: boolean
}

export default function QuizCard({
  batches,
  isLoading,
  error,
  onSubmitBatch,
  onFetchMoreQuestions,
  isLoadingMore,
}: QuizCardProps) {
  const [activeAnswers, setActiveAnswers] = useState<Record<string, number>>({})

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setActiveAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleSubmitActiveBatch = (batchId: string) => {
    onSubmitBatch(batchId, activeAnswers)
    setActiveAnswers({})
  }

  const submittedBatches = batches.filter((b) => b.isSubmitted)
  const totalCorrect = submittedBatches.reduce((acc, b) => acc + (b.score?.correct ?? 0), 0)
  const totalQuestionsSubmitted = submittedBatches.reduce((acc, b) => acc + (b.score?.total ?? 0), 0)

  const activeBatch = batches.find((b) => !b.isSubmitted)

  if (isLoading) {
    return (
      <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center py-12 text-center text-textMid">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-accent2 to-accent3 text-3xl animate-pulse text-primary">
            🧠
          </div>
          <h3 className="mt-4 text-xl font-semibold text-textHigh">Generating AI Lesson Quiz...</h3>
          <p className="mt-2 text-sm text-textMid">Crafting multiple-choice questions aligned with your topic and explanation depth.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center py-8 text-center text-rose-300">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-2xl text-rose-400">
            ⚠️
          </div>
          <h3 className="mt-3 text-lg font-semibold">Quiz Generation Error</h3>
          <p className="mt-1 text-sm text-rose-300/80">{error}</p>
        </div>
      </div>
    )
  }

  if (!batches || batches.length === 0) {
    return null
  }

  return (
    <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-8 shadow-soft backdrop-blur-xl space-y-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-accent2">Lesson Comprehension Quiz</p>
          <h3 className="mt-2 text-2xl font-semibold text-textHigh">Test Your Knowledge</h3>
        </div>
        {totalQuestionsSubmitted > 0 ? (
          <div className="rounded-2xl border border-accent2/30 bg-accent2/10 px-5 py-3 text-center sm:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-accent2 font-semibold">Cumulative Score</p>
            <p className="mt-1 text-2xl font-bold text-textHigh">
              {totalCorrect} / {totalQuestionsSubmitted}{' '}
              <span className="text-sm font-normal text-textMid">
                ({Math.round((totalCorrect / totalQuestionsSubmitted) * 100)}%)
              </span>
            </p>
          </div>
        ) : (
          <div className="rounded-full bg-white/5 px-4 py-2 text-xs text-textMid">
            {batches.reduce((acc, b) => acc + b.questions.length, 0)} Total Questions
          </div>
        )}
      </div>

      <div className="space-y-12">
        {batches.map((batch) => {
          const isSubmitted = batch.isSubmitted

          return (
            <div key={batch.id} className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-accent2">
                  {batch.title}
                </h4>
                {isSubmitted && batch.score && (
                  <span className="text-xs font-medium text-textMid">
                    Batch Score: {batch.score.correct} / {batch.score.total}
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {batch.questions.map((q, qIndex) => {
                  const selectedOption = isSubmitted
                    ? batch.userAnswers[q.id]
                    : activeAnswers[q.id]
                  const isCorrect = isSubmitted && selectedOption === q.correctIndex

                  return (
                    <div
                      key={q.id}
                      className={`rounded-[1.75rem] border p-6 transition-all ${
                        isSubmitted
                          ? isCorrect
                            ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-100'
                            : 'border-rose-500/40 bg-rose-950/30 text-rose-100'
                          : 'border-white/10 bg-[#0C1530]/95 text-textHigh'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h5 className="text-lg font-medium leading-7">
                          <span className="text-accent2 font-semibold mr-2">
                            {qIndex + 1}.
                          </span>
                          {q.question}
                        </h5>
                        {isSubmitted && (
                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                              isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        )}
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = selectedOption === optIndex
                          const isRightAnswer = optIndex === q.correctIndex

                          let btnStyle = 'border-white/10 bg-white/5 text-textHigh hover:border-accent2/50'

                          if (isSubmitted) {
                            if (isRightAnswer) {
                              btnStyle = 'border-emerald-500/50 bg-emerald-500/20 text-emerald-200 font-semibold'
                            } else if (isSelected && !isRightAnswer) {
                              btnStyle = 'border-rose-500/50 bg-rose-500/20 text-rose-200 line-through'
                            } else {
                              btnStyle = 'border-white/5 bg-white/5 text-textMid opacity-60'
                            }
                          } else if (isSelected) {
                            btnStyle = 'border-accent2 bg-accent2/20 text-accent2 font-semibold ring-2 ring-accent2/20'
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleSelectOption(q.id, optIndex)}
                              className={`flex items-center justify-between rounded-[1.25rem] border p-4 text-left text-sm transition-all ${btnStyle}`}
                            >
                              <span className="flex items-center gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span>{opt}</span>
                              </span>
                              {isSelected && !isSubmitted && (
                                <span className="text-xs text-accent2 font-bold">Selected</span>
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {isSubmitted && (
                        <div className="mt-4 rounded-[1.25rem] border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200/90 leading-6">
                          <p className="font-semibold text-amber-300 text-xs uppercase tracking-wider mb-1">Explanation</p>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {!isSubmitted && (
                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleSubmitActiveBatch(batch.id)}
                    className="w-full sm:w-auto rounded-full bg-gradient-to-r from-accent2 to-accent3 px-8 py-3.5 text-sm font-semibold text-primary transition hover:scale-[1.01]"
                  >
                    Submit Quiz
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!activeBatch && (
        <div className="flex justify-center border-t border-white/10 pt-6">
          <button
            type="button"
            disabled={isLoadingMore}
            onClick={onFetchMoreQuestions}
            className="w-full sm:w-auto rounded-full border border-accent2/30 bg-accent2/10 px-8 py-3.5 text-sm font-semibold text-accent2 transition hover:border-accent2 hover:bg-accent2/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? 'Fetching 5 more questions...' : 'Generate few more questions (+5)'}
          </button>
        </div>
      )}
    </div>
  )
}
