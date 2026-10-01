import { useState } from 'react'
import type { LearningTopic } from '../../data/mockLearningContent'

interface TopicListProps {
  topics: LearningTopic[]
  reducedMotion: boolean
  onSelectTopic: (topic: LearningTopic) => void
}

export default function TopicList({ topics, reducedMotion, onSelectTopic }: TopicListProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent2">Topics</p>
            <h2 className="mt-3 text-3xl font-semibold text-textHigh">Available lessons</h2>
          </div>
          <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-textMid">{topics.length} topics</span>
        </div>
      </div>
      <div className="grid gap-5">
        {topics.map((topic) => (
          <article
            key={topic.id}
            className={`glass-panel rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-6 shadow-soft backdrop-blur-xl ${
              reducedMotion ? '' : 'transition hover:-translate-y-1 hover:border-accent2/30 hover:shadow-glow'
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-textHigh">{topic.title}</h3>
                <p className="mt-3 text-sm leading-7 text-textMid">{topic.overview}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onSelectTopic(topic)}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-textHigh transition hover:border-accent2 hover:text-accent2"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => setExpanded((current) => (current === topic.id ? null : topic.id))}
                  className="rounded-full bg-[#131D33]/95 px-5 py-3 text-sm font-semibold text-textMid transition hover:bg-white/5 hover:text-textHigh"
                >
                  {expanded === topic.id ? 'Collapse' : 'Details'}
                </button>
              </div>
            </div>
            {expanded === topic.id ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] bg-[#09111E]/95 p-5">
                  <h4 className="text-lg font-semibold text-textHigh">Preview highlights</h4>
                  <ul className="mt-4 space-y-3 text-textMid">
                    {topic.keyPoints.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent3" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[1.75rem] bg-[#09111E]/95 p-5">
                  <h4 className="text-lg font-semibold text-textHigh">Quiz snapshot</h4>
                  <div className="mt-4 space-y-4 text-textMid">
                    {topic.quiz.map((item) => (
                      <div key={item.question} className="rounded-3xl bg-white/5 p-4">
                        <p className="font-semibold text-textHigh">{item.question}</p>
                        <p className="mt-2">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
