import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 1200)
    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-nightNavy text-textHigh"
          aria-label="Loading screen"
        >
          <div className="glass-panel relative mx-4 flex w-full max-w-3xl flex-col items-center gap-6 rounded-[2rem] border border-white/10 p-10 text-center shadow-soft md:p-14">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-accent2 via-accent3 to-accent1 text-2xl font-semibold text-primary shadow-glow">
              EV
            </div>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-accent2">EduVision</p>
              <h1 className="text-3xl font-semibold leading-tight text-textHigh sm:text-4xl">
                Forging the next generation of verified cultural learning.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-textMid">
                A cinematic educational platform for UNESCO youth, blending media literacy, immersive AI, and multilingual cultural discovery.
              </p>
            </div>
            <div className="flex w-full items-center justify-center gap-4 pt-4">
              <span className="h-2 w-20 rounded-full bg-accent2/30 shadow-[0_0_24px_rgba(74,222,128,0.22)]" />
              <span className="h-2 w-10 rounded-full bg-white/20" />
              <span className="h-2 w-6 rounded-full bg-white/15" />
            </div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  )
}
