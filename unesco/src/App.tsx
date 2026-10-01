import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import Layout from './components/Layout'
import LoadingScreen from './components/LoadingScreen'
import HomePage from './pages/HomePage'
import GenerateVideoPage from './pages/GenerateVideoPage'
import InteractiveLearningPage from './pages/InteractiveLearningPage'
import LearningWorkspacePage from './pages/LearningWorkspacePage'
import UserProfilePage from './pages/UserProfilePage'
import AboutPage from './pages/AboutPage'
import { type DifficultyLevel, type LearningMode } from './utils/learningProfileStore'
import { motionVariants } from './utils/animation'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

function App() {
  const lenis = useLenis()
  const reducedMotion = useReducedMotion()
  const [isLoaded, setIsLoaded] = useState(false)
  const location = useLocation()

  // Active Workspace State
  const [activeTopic, setActiveTopic] = useState('Recursion & Base Cases')
  const [activeMode, setActiveMode] = useState<LearningMode>('both')
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel>('Intermediate')

  useEffect(() => {
    if (!lenis) return

    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value, { instant: true }) : window.scrollY
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed'
    })

    const handleResize = () => ScrollTrigger.refresh()

    lenis.on('scroll', ScrollTrigger.update)
    window.addEventListener('resize', handleResize)
    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [lenis])

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoaded(true), 1200)
    return () => window.clearTimeout(timeout)
  }, [])

  const handleStartLearning = (topic: string, mode: LearningMode, difficulty: DifficultyLevel) => {
    setActiveTopic(topic)
    setActiveMode(mode)
    setActiveDifficulty(difficulty)
  }

  return (
    <AnimatePresence mode="wait">
      {!isLoaded ? (
        <LoadingScreen />
      ) : (
        <motion.div
          key={location.pathname}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={motionVariants.pageTransition}
          className="min-h-screen bg-deepCharcoal text-textHigh"
        >
          <Layout>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={<HomePage reducedMotion={reducedMotion} onStartLearning={handleStartLearning} />}
              />
              <Route
                path="/workspace"
                element={
                  <LearningWorkspacePage
                    initialTopic={activeTopic}
                    initialMode={activeMode}
                    initialDifficulty={activeDifficulty}
                    reducedMotion={reducedMotion}
                  />
                }
              />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/generate" element={<GenerateVideoPage reducedMotion={reducedMotion} />} />
              <Route path="/learn" element={<InteractiveLearningPage reducedMotion={reducedMotion} />} />
              <Route path="/about" element={<AboutPage reducedMotion={reducedMotion} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
