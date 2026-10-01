import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { motionVariants } from '../utils/animation'
import { roadmapItems } from '../data/content'

interface RoadmapSectionProps {
  reducedMotion: boolean
}

export default function RoadmapSection({ reducedMotion }: RoadmapSectionProps) {
  const transition = reducedMotion ? { duration: 0.05 } : undefined

  return (
    <section id="roadmap" aria-label="Roadmap" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Roadmap"
          title="A clear trajectory for global educational impact."
          description="EduVision’s roadmap is built around prototype validation, UNESCO collaboration, and scalable community deployment."
        />
        <div className="mt-12 space-y-6">
          {roadmapItems.map((item) => (
            <motion.div
              key={item.quarter}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={motionVariants.fadeInUp}
              transition={transition}
              className="glass-panel rounded-[2rem] border border-white/10 p-8"
            >
              <div className="flex items-center justify-between gap-8">
                <span className="font-mono text-sm uppercase tracking-[0.28em] text-accent2">{item.quarter}</span>
                <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-textHigh">Milestone</span>
              </div>
              <p className="mt-4 text-lg font-semibold text-textHigh">{item.milestone}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
