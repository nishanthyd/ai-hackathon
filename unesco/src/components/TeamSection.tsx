import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { motionVariants } from '../utils/animation'
import { teamMembers } from '../data/content'

interface TeamSectionProps {
  reducedMotion: boolean
}

export default function TeamSection({ reducedMotion }: TeamSectionProps) {
  const transition = reducedMotion ? { duration: 0.05 } : undefined

  return (
    <section id="team" aria-label="Team" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Team"
          title="A cross-disciplinary collective building a trust-first learning experience."
          description="EduVision blends design, AI, education, and cultural research with UNESCO values at the center."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <motion.article
              key={member.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={motionVariants.fadeInUp}
              transition={transition}
              className="glass-panel rounded-[2rem] border border-white/10 p-8"
            >
              <div className="mb-6 h-24 w-24 rounded-[1.75rem] bg-gradient-to-br from-accent2 via-accent3 to-accent1" />
              <h3 className="text-xl font-semibold text-textHigh">{member.name}</h3>
              <p className="mt-2 text-sm uppercase tracking-[0.24em] text-textMid">{member.role}</p>
              <p className="mt-4 text-base leading-8 text-textLow">{member.focus}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
