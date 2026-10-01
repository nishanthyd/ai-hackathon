'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Brain,
  Code2,
  Cpu,
  Layers,
  TrendingUp,
  ArrowRight,
  Play,
  CheckCircle2,
  Award,
  Clock,
  Zap,
  BarChart3,
  Search,
  BookOpen,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import DiagnosticTestModal from '@/components/diagnostic/DiagnosticTestModal';
import { getLearnerProfile, getSpacedRevisions, DEMO_LEARNER } from '@/lib/store';
import { DailyTimeBudget } from '@/types/learnai';

export default function HomePage() {
  const [profile, setProfile] = useState(DEMO_LEARNER);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [sessionLength, setSessionLength] = useState<DailyTimeBudget>('20 minutes');

  useEffect(() => {
    const loadedProfile = getLearnerProfile();
    setProfile(loadedProfile);
    setRevisions(getSpacedRevisions());
    if (loadedProfile.dailyTime) {
      setSessionLength(loadedProfile.dailyTime);
    }
  }, []);

  const aiTracks = [
    {
      id: 'matrix',
      title: 'Linear Algebra & Matrix Math',
      category: 'AI Mathematics',
      desc: 'Master dot products, matrix multiplication, and multi-dimensional tensors powering modern neural networks.',
      icon: Layers,
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-500/30',
      href: '/learn/matrix',
      tag: '3D Manim Visuals',
    },
    {
      id: 'neural',
      title: 'Neural Networks & Deep Learning',
      category: 'Architecture',
      desc: 'Understand activation functions (ReLU, Sigmoid), forward pass, backpropagation, and loss functions.',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-500/30',
      href: '/learn/stacks',
      tag: 'Interactive AI',
    },
    {
      id: 'python-ai',
      title: 'Python for AI & Data Structures',
      category: 'Implementation',
      desc: 'Implement high-performance vector operations, function stacks, memory tracing, and algorithmic efficiency.',
      icon: Code2,
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-500/30',
      href: '/practice',
      tag: 'VS Code Sandbox',
    },
    {
      id: 'optimization',
      title: 'Gradient Descent & Optimization',
      category: 'Model Training',
      desc: 'Visualize cost function landscapes, learning rates, partial derivatives, and parameter optimization.',
      icon: Cpu,
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-500/30',
      href: '/practice',
      tag: 'AI Code Check',
    },
  ];

  const practiceHighlights = [
    { title: 'ReLU Activation Function', difficulty: 'Easy', line: 'return max(0.0, x)', topic: 'Neural Nets' },
    { title: '2x2 Matrix Multiplication', difficulty: 'Medium', line: 'C[i][j] += A[i][k] * B[k][j]', topic: 'Linear Algebra' },
    { title: 'Gradient Descent Step', difficulty: 'Medium', line: 'w = w - lr * dw', topic: 'Optimization' },
    { title: 'Sigmoid Activation', difficulty: 'Easy', line: 'return 1 / (1 + exp(-x))', topic: 'Neural Nets' },
  ];

  return (
    <div className="flex min-h-screen bg-[#0b0f17] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenOnboarding={() => setIsOnboardingOpen(true)} />

        <main className="flex-1 p-6 md:p-10 space-y-10 max-w-7xl mx-auto w-full">
          {/* AI Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-[#0d1527] via-[#0f172a] to-[#131b2e] p-8 md:p-10 shadow-2xl">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-300">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>AI-Focused Learning Engine</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Master AI & Machine Learning with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">Interactive Visuals & Code</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Explore 3D Manim mathematical animations, code real AI algorithms in our VS Code-style Python sandbox, and track real-time learning telemetry.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/practice"
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-400 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform"
                >
                  <Code2 className="h-4 w-4" />
                  <span>Launch VS Code AI IDE</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/learn/matrix"
                  className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 transition-colors"
                >
                  <Play className="h-4 w-4 text-cyan-400" />
                  <span>3D Manim Matrix Math</span>
                </Link>

                <button
                  onClick={() => setIsDiagnosticOpen(true)}
                  className="flex items-center gap-2 rounded-2xl border border-purple-500/30 bg-purple-500/10 px-5 py-3 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-all"
                >
                  <Award className="h-4 w-4 text-purple-400" />
                  <span>Run AI Diagnostic</span>
                </button>
              </div>
            </div>
          </div>

          {/* Core AI Learning Tracks Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  <span>AI Core Learning Tracks</span>
                </h2>
                <p className="text-xs text-slate-400">Neat, high-yield subjects for modern Artificial Intelligence</p>
              </div>
              <Link href="/knowledge-map" className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1">
                <span>View Full Knowledge Map</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {aiTracks.map((track) => {
                const IconComponent = track.icon;
                return (
                  <Link
                    key={track.id}
                    href={track.href}
                    className={`group relative rounded-3xl border ${track.borderColor} bg-[#0f172a] p-6 transition-all hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-xl flex flex-col justify-between`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`rounded-2xl bg-gradient-to-r ${track.color} p-3 text-white shadow-md`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                          {track.tag}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {track.category}
                        </span>
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {track.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {track.desc}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                      <span>Start Learning</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* VS Code AI Practice Highlights & Quick Sessions */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* AI Practice Quick Problems */}
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#0f172a] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">VS Code AI Practice Sandbox</h3>
                </div>
                <span className="text-xs text-slate-400">AI Code Diagnostics & Python Runner</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {practiceHighlights.map((prob, i) => (
                  <Link
                    key={i}
                    href="/practice"
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-cyan-500/40 hover:bg-white/[0.07] transition-all space-y-2 group"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-cyan-300">{prob.topic}</span>
                      <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-400 border border-cyan-500/20">
                        {prob.difficulty}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {prob.title}
                    </h4>

                    <div className="rounded-xl bg-black/50 p-2 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-white/5">
                      <code>{prob.line}</code>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-slate-400">Includes ⚡ Run Test Check & 🧠 Line-by-Line AI Diagnostics</span>
                <Link href="/practice" className="font-bold text-cyan-400 hover:underline flex items-center gap-1">
                  <span>Open Interactive Editor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Daily Session Budget */}
            <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                  <Clock className="h-4 w-4" />
                  <span>AI Daily Learning Budget</span>
                </div>
                <h4 className="text-sm font-bold text-white">How much time do you have today?</h4>

                <div className="grid grid-cols-2 gap-2">
                  {(['10 minutes', '20 minutes', '30 minutes', '1 hour'] as DailyTimeBudget[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSessionLength(t)}
                      className={`rounded-2xl border p-2.5 text-xs font-bold transition-all ${
                        sessionLength === t
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Breakdown preview */}
              <div className="rounded-2xl bg-black/40 p-4 text.xs text-slate-300 space-y-2 border border-white/5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">🎥 3D Manim AI Video</span>
                  <span className="font-semibold text-white">5 min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">✨ AI Topic Summary</span>
                  <span className="font-semibold text-white">4 min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">🧪 VS Code Practice</span>
                  <span className="font-semibold text-white">7 min</span>
                </div>
                <div className="flex justify-between text-xs text-cyan-400 font-semibold pt-2 border-t border-white/10">
                  <span>Optimized AI Session</span>
                  <span>{sessionLength}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real Learning Telemetry & Tracked Profile Activity */}
          <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  <span>Real Learner Telemetry & Profile Data</span>
                </h3>
                <p className="text-xs text-slate-400">Automatically tracking your searches, runs, and quiz attempts</p>
              </div>

              <Link href="/profile" className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1 self-start md:self-auto">
                <span>View Complete Profile Log</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1: Subject Mastery */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>AI & Math Subject Mastery</span>
                  <span className="text-cyan-400">82%</span>
                </div>
                <div className="space-y-2">
                  {(Object.values(profile.subjects || {}) as any[]).map((subj: any) => (
                    <div key={subj.subject} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-300">
                        <span>{subj.subject}</span>
                        <span className="text-cyan-400 font-semibold">{subj.percentage}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400"
                          style={{ width: `${subj.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Tracked Search Log */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Recent Tracked Searches</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Live Saved</span>
                </div>

                {profile.searchHistory && profile.searchHistory.length > 0 ? (
                  <div className="space-y-2">
                    {profile.searchHistory.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center rounded-xl bg-black/40 px-3 py-2 text-xs">
                        <span className="font-mono text-cyan-300 truncate max-w-[150px]">"{item.query}"</span>
                        <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No search queries recorded yet. Search topics above to log live data!</p>
                )}
              </div>

              {/* Card 3: Quiz Telemetry */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                    <span>Quiz Telemetry</span>
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">Active</span>
                </div>

                <div className="rounded-xl bg-black/40 p-3 text-xs text-slate-300 space-y-2 border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quizzes Attempted:</span>
                    <span className="font-bold text-cyan-300">{profile.totalQuizzesAttempted || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Questions Answered:</span>
                    <span className="font-bold text-purple-300">{profile.totalQuestionsAnswered || 5}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-1.5">
                    <span className="text-slate-400">Accuracy Rate:</span>
                    <span className="font-bold text-emerald-400">
                      {profile.totalQuestionsAnswered
                        ? Math.round(((profile.totalCorrectAnswers || 0) / profile.totalQuestionsAnswered) * 100)
                        : 80}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      <DiagnosticTestModal isOpen={isDiagnosticOpen} onClose={() => setIsDiagnosticOpen(false)} />
    </div>
  );
}