import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { motionVariants } from '../utils/animation'
import { milFeatures } from '../data/content'

interface MilSectionProps {
  reducedMotion: boolean
}

export default function MilSection({ reducedMotion }: MilSectionProps) {
  const transition = reducedMotion ? { duration: 0.05 } : undefined

  return (
    <section id="mil" aria-label="Media and Information Literacy" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why MIL matters"
          title="Media literacy is the foundation of cultural trust."
          description="EduVision makes MIL a lived experience by training learners to verify claims, interpret media, and respect heritage through a resilient learning framework."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {milFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={motionVariants.fadeInUp}
              transition={transition}
              className="glass-panel rounded-[2rem] border border-white/10 p-8"
            >
              <h3 className="text-xl font-semibold text-textHigh">{feature.title}</h3>
              <p className="mt-4 text-base leading-8 text-textMid">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={motionVariants.fadeInUp}
          transition={transition}
          className="mt-14 rounded-[2rem] border border-white/10 bg-[#0B1221]/90 p-10 backdrop-blur-xl"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-accent3">Quote</p>
          <h3 className="mt-4 text-3xl font-semibold leading-tight text-textHigh sm:text-4xl">
            "When culture is verified, it becomes a bridge instead of a broadcast."
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-8 text-textMid">
            EduVision embeds media literacy into every story, ensuring that learners build cultural understanding with resilience and authenticity.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
