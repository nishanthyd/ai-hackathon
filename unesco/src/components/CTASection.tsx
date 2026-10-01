import { motion } from 'framer-motion'
import { motionVariants } from '../utils/animation'

interface CTASectionProps {
  reducedMotion: boolean
}

export default function CTASection({ reducedMotion }: CTASectionProps) {
  const transition = reducedMotion ? { duration: 0.05 } : undefined

  return (
    <section id="contact" aria-label="Engage with EduVision" className="relative py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={motionVariants.fadeInUp}
          transition={transition}
          className="glass-panel rounded-[2rem] border border-white/10 bg-[#111A2D]/95 p-10 text-center shadow-soft backdrop-blur-xl"
        >
          <p className="text-sm uppercase tracking-[0.32em] text-accent2">Final call to action</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight text-textHigh sm:text-5xl">
            Partner with EduVision to shape trusted cultural learning for the next generation.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-textMid">
            Join the pilot cohort, share heritage resources, or become a UNESCO education partner. Our platform is built to scale in equity and authenticity.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:team@eduvsion.org"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent2 to-accent3 px-8 py-4 text-sm font-semibold text-primary shadow-glow transition hover:scale-[1.01]"
            >
              Request access
            </a>
            <a
              href="#team"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-textHigh transition hover:border-accent2 hover:text-accent2"
            >
              Meet the team
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
