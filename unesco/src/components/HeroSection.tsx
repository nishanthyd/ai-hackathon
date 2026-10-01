import { motion } from 'framer-motion'
import { motionVariants } from '../utils/animation'

interface HeroSectionProps {
  reducedMotion: boolean
}

export default function HeroSection({ reducedMotion }: HeroSectionProps) {
  const transition = reducedMotion ? { duration: 0.05 } : undefined

  return (
    <section id="home" aria-label="Hero" className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-hero-grid opacity-70" />
      <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-accent2/20 via-transparent to-transparent blur-3xl" />
      <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-gradient-to-br from-violet/20 to-transparent blur-2xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={motionVariants.fadeInUp}
            transition={transition}
            className="max-w-2xl space-y-8"
          >
            <p className="inline-flex rounded-full border border-accent2/25 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent2 shadow-glow">
              UNESCO Global Youth Hackathon 2026
            </p>
            <h1 className="text-5xl font-semibold leading-tight tracking-[-0.04em] text-textHigh sm:text-6xl lg:text-[5rem]">
              EduVision: AI-powered multilingual cultural learning for a digitally verified future.
            </h1>
            <p className="max-w-xl text-base leading-8 text-textMid sm:text-lg">
              Build trust in heritage and media literacy with a cinematic education platform that connects students to culture, language, and responsible verification.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent2 to-accent3 px-6 py-3 text-sm font-semibold text-primary shadow-glow transition hover:scale-[1.01]"
              >
                Start the pilot
              </a>
              <a
                href="#solution"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-textHigh transition hover:border-accent2 hover:text-accent2"
              >
                Explore the solution
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-panel border border-white/10 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.32em] text-textMid">Trust index</p>
                <p className="mt-3 text-2xl font-semibold text-textHigh">AI Verified</p>
              </div>
              <div className="glass-panel border border-white/10 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.32em] text-textMid">Languages</p>
                <p className="mt-3 text-2xl font-semibold text-textHigh">28+</p>
              </div>
              <div className="glass-panel border border-white/10 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.32em] text-textMid">Impact focus</p>
                <p className="mt-3 text-2xl font-semibold text-textHigh">Heritage, MIL, inclusion</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={motionVariants.fadeInRight}
            transition={reducedMotion ? { duration: 0.01 } : { duration: 0.9, delay: 0.1, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-soft backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-electricBlue/10 via-transparent to-transparent opacity-80" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-4 rounded-3xl bg-white/5 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent2/10 text-2xl">🌐</div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-textMid">Multilingual culture</p>
                    <p className="mt-2 text-lg font-semibold text-textHigh">Local stories in global languages.</p>
                  </div>
                </div>
                <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-[#0B1221]/95 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-textMid">Verification confidence</p>
                    <span className="rounded-full bg-accent1/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-accent1">Trusted</span>
                  </div>
                  <div className="space-y-3">
                    <p className="text-base text-textHigh">AI reveals source history, media lineage, and cultural context in one flow.</p>
                    <p className="text-sm text-textLow">Designed for learners, teachers, and UNESCO ambassadors who value transparency.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] bg-[#111A2D]/95 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-textMid">Learning span</p>
                    <p className="mt-3 text-3xl font-semibold text-textHigh">4–12 weeks</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-[#111A2D]/95 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-textMid">Community reach</p>
                    <p className="mt-3 text-3xl font-semibold text-textHigh">Global classrooms</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-12 top-12 h-28 w-28 animate-float rounded-full bg-violet/30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-8 left-8 h-28 w-28 rounded-full bg-accent1/25 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
