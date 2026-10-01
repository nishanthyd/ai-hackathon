import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { motionVariants } from '../utils/animation'
import { problemCards } from '../data/content'

interface ProblemSectionProps {
  reducedMotion: boolean
}

export default function ProblemSection({ reducedMotion }: ProblemSectionProps) {
  const transition = reducedMotion ? { duration: 0.05 } : undefined

  return (
    <section id="problem" aria-label="Problem statement" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Problem statement"
          title="Media literacy gaps are widening cultural divides."
          description="EduVision addresses misinformation, language exclusion, and the urgency of connecting students with living heritage through trusted AI storytelling."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {problemCards.map((card) => (
            <motion.article
              key={card.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={motionVariants.fadeInUp}
              transition={transition}
              className="glass-panel rounded-[2rem] border border-white/10 p-8"
            >
              <div className="mb-4 inline-flex rounded-full bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-textMid">
                {card.title}
              </div>
              <p className="text-base leading-8 text-textMid">{card.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
