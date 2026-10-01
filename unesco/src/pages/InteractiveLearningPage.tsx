import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { mockSubjects } from '../data/mockSubjects'
import { mockLearningContent } from '../data/mockLearningContent'
import type { LearningTopic } from '../data/mockLearningContent'
import SubjectGrid from '../components/learn/SubjectGrid'
import StandardSelector from '../components/learn/StandardSelector'
import TopicList from '../components/learn/TopicList'
import SectionHeading from '../components/SectionHeading'
import { motionVariants } from '../utils/animation'

interface InteractiveLearningPageProps {
  reducedMotion: boolean
}

export default function InteractiveLearningPage({ reducedMotion }: InteractiveLearningPageProps) {
  const [selectedSubject, setSelectedSubject] = useState('math')
  const [selectedGrade, setSelectedGrade] = useState(7)
  const [activeTopic, setActiveTopic] = useState<LearningTopic | null>(null)

  const topics = useMemo(
    () => mockLearningContent.filter((topic) => topic.subject === selectedSubject && topic.grade === selectedGrade),
    [selectedSubject, selectedGrade]
  )

  useEffect(() => {
    if (topics.length === 0) setActiveTopic(null)
  }, [topics])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={motionVariants.pageTransition}
      className="space-y-16"
    >
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-10 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-accent2">Interactive Learning</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-textHigh sm:text-5xl">
              Navigate subject pathways, choose standards, and preview lesson scaffolds.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-textMid">
              A complete content browser with subject cards, grade selectors, and realistic lesson previews built with mock data.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Learning browser" className="relative py-20">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <SubjectGrid subjects={mockSubjects} selected={selectedSubject} onSelect={setSelectedSubject} reducedMotion={reducedMotion} />
          <div className="grid gap-10 lg:grid-cols-[0.35fr_1fr]">
            <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-8 shadow-soft backdrop-blur-xl">
              <SectionHeading
                eyebrow="Filter"
                title="Refine your lesson path by grade and standard."
                description="Select a grade, then choose a lesson topic that matches the right depth and cultural perspective."
              />
              <StandardSelector
                grades={[3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                selectedGrade={selectedGrade}
                onSelectGrade={setSelectedGrade}
              />
            </div>
            <TopicList topics={topics} onSelectTopic={setActiveTopic} reducedMotion={reducedMotion} />
          </div>
        </div>
      </section>

      {activeTopic ? (
        <section aria-label="Lesson preview" className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#101A2F]/95 p-10 shadow-soft backdrop-blur-xl">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-accent2">Lesson preview</span>
                  <h2 className="mt-3 text-3xl font-semibold text-textHigh">{activeTopic.title}</h2>
                </div>
                <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-textMid">
                  Grade {activeTopic.grade}
                </span>
              </div>
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-textHigh">Overview</h3>
                    <p className="mt-4 text-base leading-8 text-textMid">{activeTopic.overview}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-textHigh">Key Points</h3>
                    <ul className="mt-4 space-y-3 text-textMid">
                      {activeTopic.keyPoints.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent2" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-6">
                  <h3 className="text-xl font-semibold text-textHigh">Quiz</h3>
                  <div className="mt-5 space-y-4">
                    {activeTopic.quiz.map((item) => (
                      <div key={item.question} className="rounded-3xl bg-white/5 p-4">
                        <p className="text-sm font-semibold text-textHigh">{item.question}</p>
                        <p className="mt-2 text-sm leading-7 text-textMid">Answer: {item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </motion.div>
  )
}
