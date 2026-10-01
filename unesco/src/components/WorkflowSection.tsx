import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { motionVariants } from '../utils/animation'
import { workflowPanels } from '../data/content'

interface WorkflowSectionProps {
  reducedMotion: boolean
}

export default function WorkflowSection({ reducedMotion }: WorkflowSectionProps) {
  const transition = reducedMotion ? { duration: 0.05 } : undefined

  return (
    <section id="workflow" aria-label="Interactive workflow" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Interactive workflow timeline"
          title="From insight to impact with transparent verification steps."
          description="A fluid workflow designed to make cultural discovery meaningful, accountable, and community-centered."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {workflowPanels.map((panel) => (
            <motion.div
              key={panel.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={motionVariants.fadeInRight}
              transition={transition}
              className="glass-panel rounded-[2rem] border border-white/10 p-8"
            >
              <h3 className="text-xl font-semibold text-textHigh">{panel.title}</h3>
              <p className="mt-4 text-base leading-8 text-textMid">{panel.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
