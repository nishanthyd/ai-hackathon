import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { motionVariants } from '../utils/animation'
import { trustHighlights } from '../data/content'

interface TrustSectionProps {
  reducedMotion: boolean
}

export default function TrustSection({ reducedMotion }: TrustSectionProps) {
  const transition = reducedMotion ? { duration: 0.05 } : undefined

  return (
    <section id="trust" aria-label="Verification and trust" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Verification and trust"
          title="Build confidence with an open verification ecosystem."
          description="EduVision centers trust by making every claim, source, and cultural reference visible and easy to evaluate." 
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {trustHighlights.map((item) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={motionVariants.fadeInUp}
              transition={transition}
              className="glass-panel rounded-[2rem] border border-white/10 p-8"
            >
              <p className="text-sm uppercase tracking-[0.32em] text-accent2">Trust</p>
              <h3 className="mt-4 text-xl font-semibold text-textHigh">{item.title}</h3>
              <p className="mt-4 text-base leading-8 text-textMid">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
