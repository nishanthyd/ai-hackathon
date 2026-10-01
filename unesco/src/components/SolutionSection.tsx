import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { motionVariants } from '../utils/animation'
import { solutionCards } from '../data/content'

interface SolutionSectionProps {
  reducedMotion: boolean
}

export default function SolutionSection({ reducedMotion }: SolutionSectionProps) {
  const transition = reducedMotion ? { duration: 0.05 } : undefined

  return (
    <section id="solution" aria-label="Solution architecture" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="AI + cultural learning"
          title="A coherent platform for verification, heritage, and learning." 
          description="EduVision combines adaptive AI, multilingual content, and UNESCO-aligned MIL scaffolding for a trusted student experience."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {solutionCards.map((card) => (
            <motion.div
              key={card.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={motionVariants.fadeInUp}
              transition={transition}
              className="glass-panel rounded-[2rem] border border-white/10 p-8"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/5 text-2xl shadow-glow">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-textHigh">{card.title}</h3>
              <p className="mt-4 text-base leading-8 text-textMid">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
