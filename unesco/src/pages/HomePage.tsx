import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Video, Layers, Clock, ArrowRight, AlertCircle } from 'lucide-react'
import { getStudentProfile, type DifficultyLevel, type LearningMode, type StudentProfile } from '../utils/learningProfileStore'

interface HomePageProps {
  reducedMotion: boolean
  onStartLearning?: (topic: string, mode: LearningMode, difficulty: DifficultyLevel) => void
}

export default function HomePage({ onStartLearning }: HomePageProps) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<StudentProfile>(getStudentProfile())

  const [topicInput, setTopicInput] = useState('Recursion & Base Cases')
  const [selectedMode, setSelectedMode] = useState<LearningMode>('both')
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Intermediate')

  useEffect(() => {
    const loaded = getStudentProfile()
    setProfile(loaded)
    if (loaded.lastStruggledTopic?.topic) {
      setTopicInput(loaded.lastStruggledTopic.topic)
    }
    setSelectedDifficulty(loaded.currentLevel)
    setSelectedMode(loaded.preferredMode)
  }, [])

  const handleStartLearning = () => {
    if (onStartLearning) {
      onStartLearning(topicInput, selectedMode, selectedDifficulty)
    }
    navigate('/workspace')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Main Personalized Learning Recommendation Hero */}
      <div className="glass-panel relative overflow-hidden rounded-[2.5rem] border border-accent2/30 bg-gradient-to-b from-[#0F1C36]/95 to-[#09101F]/95 p-8 shadow-2xl backdrop-blur-2xl sm:p-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent2/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent2/20 text-accent2 border border-accent2/40 shadow-soft">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent2 font-semibold">Personalized Learning Platform</p>
            <h1 className="text-3xl font-bold text-textHigh sm:text-4xl">What should I learn today?</h1>
          </div>
        </div>

        {/* Today's Recommendation Banner */}
        <div className="mt-8 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-6 w-6 text-rose-400 shrink-0" />
              <div>
                <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-300">
                  TODAY'S AI RECOMMENDATION
                </span>
                <h3 className="mt-2 text-xl font-bold text-white">
                  🔴 You struggled with {profile.lastStruggledTopic?.topic || 'Recursion'} yesterday.
                </h3>
                <p className="mt-1 text-sm text-rose-200">
                  Our AI engine recommends reinforcing base cases & call stack execution using split visual animations and same-screen tutoring.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-black/40 px-4 py-2.5 text-xs font-semibold text-textMid border border-white/10 shrink-0">
              <Clock className="h-4 w-4 text-accent2" />
              <span>Estimated Time: 20 min</span>
            </div>
          </div>
        </div>

        {/* Learning Configuration Controls */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* 1. Topic Input */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-textMid font-bold">1. Learning Topic</label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Enter topic e.g. Photosynthesis, Binary Search..."
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-textHigh placeholder-textMid focus:border-accent2 focus:outline-none"
            />
          </div>

          {/* 2. Mode Selector */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-textMid font-bold">2. Choose Learning Mode</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedMode('videos')}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all ${
                  selectedMode === 'videos'
                    ? 'border-accent2 bg-accent2/20 text-accent2 font-bold shadow-soft'
                    : 'border-white/10 bg-white/5 text-textMid hover:border-white/30'
                }`}
              >
                <Video className="h-5 w-5" />
                <span className="text-xs">🎥 Videos</span>
              </button>

              <button
                onClick={() => setSelectedMode('manim')}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all ${
                  selectedMode === 'manim'
                    ? 'border-accent2 bg-accent2/20 text-accent2 font-bold shadow-soft'
                    : 'border-white/10 bg-white/5 text-textMid hover:border-white/30'
                }`}
              >
                <Sparkles className="h-5 w-5" />
                <span className="text-xs">✨ Manim</span>
              </button>

              <button
                onClick={() => setSelectedMode('both')}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all ${
                  selectedMode === 'both'
                    ? 'border-accent2 bg-accent2/20 text-accent2 font-bold shadow-soft'
                    : 'border-white/10 bg-white/5 text-textMid hover:border-white/30'
                }`}
              >
                <Layers className="h-5 w-5" />
                <span className="text-xs">🔀 Both</span>
              </button>
            </div>
          </div>

          {/* 3. Difficulty Picker */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-textMid font-bold">3. Select Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((level) => {
                const isSel = selectedDifficulty === level
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    className={`rounded-2xl border px-3 py-3 text-xs font-bold transition-all ${
                      isSel
                        ? 'border-accent2 bg-accent2/20 text-accent2 shadow-soft'
                        : 'border-white/10 bg-white/5 text-textMid hover:border-white/30'
                    }`}
                  >
                    {level === 'Beginner' ? '🟢 Beginner' : level === 'Intermediate' ? '🟡 Intermediate' : '🔴 Advanced'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Start Learning Action */}
        <div className="mt-8 flex items-center justify-end border-t border-white/10 pt-6">
          <button
            onClick={handleStartLearning}
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-accent2 to-accent3 px-10 py-4 text-base font-bold text-black shadow-lg hover:scale-[1.02] transition-transform"
          >
            <span>START LEARNING</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
