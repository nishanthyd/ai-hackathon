import { motion } from 'framer-motion'
import { motionVariants } from '../utils/animation'
import { impactMetrics } from '../data/content'
import AnimatedCounter from './AnimatedCounter'

interface ImpactMetricsProps {
  reducedMotion: boolean
}

export default function ImpactMetrics({ reducedMotion }: ImpactMetricsProps) {
  const transition = reducedMotion ? { duration: 0.05 } : undefined

  return (
    <section id="impact" aria-label="Impact metrics" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {impactMetrics.map((metric) => (
            <motion.div
              key={metric.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={motionVariants.fadeInUp}
              transition={transition}
              className="glass-panel rounded-[2rem] border border-white/10 p-8 text-center"
            >
              <AnimatedCounter value={metric.value} suffix={metric.suffix} reducedMotion={reducedMotion} />
              <p className="mt-4 text-sm uppercase tracking-[0.28em] text-textMid">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
