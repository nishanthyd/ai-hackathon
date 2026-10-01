import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { motionVariants, scrollReveal } from '../utils/animation'
import { timelineSteps } from '../data/content'

interface InteractiveTimelineProps {
  reducedMotion: boolean
}

export default function InteractiveTimeline({ reducedMotion }: InteractiveTimelineProps) {
  const timelineRef = useRef<HTMLDivElement | null>(null)
  const transition = reducedMotion ? { duration: 0.05 } : undefined

  useEffect(() => {
    if (timelineRef.current) {
      scrollReveal.fadeUp(timelineRef.current)
    }
  }, [])

  return (
    <section id="challenge" aria-label="UNESCO challenge" className="relative py-20">
      <div className="mx-auto flex max-w-7xl gap-12 px-4 sm:px-6 lg:px-8 xl:gap-20">
        <div className="sticky top-28 hidden min-w-[35%] self-start rounded-[2rem] border border-white/10 bg-surface/95 p-10 shadow-soft backdrop-blur-xl lg:block">
          <p className="text-sm uppercase tracking-[0.32em] text-accent3">UNESCO challenge</p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight text-textHigh sm:text-4xl">
            Preserve heritage while teaching students to verify information.
          </h2>
          <p className="mt-6 text-base leading-8 text-textMid">
            EduVision answers the UNESCO call by making cultural learning immersive, inclusive, and anchored in digital trust.
          </p>
        </div>

        <div className="flex-1" ref={timelineRef}>
          <div className="space-y-8">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={motionVariants.fadeInUp}
                transition={transition}
                className="glass-panel rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-8"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-accent2 to-accent3 text-lg font-semibold text-primary shadow-glow">
                    {index + 1}
                  </span>
                  <h3 className="text-2xl font-semibold text-textHigh">{step.title}</h3>
                </div>
                <p className="mt-4 text-base leading-8 text-textMid">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
