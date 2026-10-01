'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Brain,
  Target,
  Clock,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Zap,
  Search,
  Trash2,
  RotateCcw,
  ChevronRight,
  Code2,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import DiagnosticTestModal from '@/components/diagnostic/DiagnosticTestModal';
import { getLearnerProfile, saveLearnerProfile, DEMO_LEARNER } from '@/lib/store';
import {
  LearnerProfile,
  LearningGoal,
  DailyTimeBudget,
  PreferredStyle,
  DifficultyLevel,
} from '@/types/learnai';

export default function LearnerProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  useEffect(() => {
    setProfile(getLearnerProfile());
  }, []);

  if (!profile) return null;

  const triggerSaveAlert = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleGoalChange = (goal: LearningGoal) => {
    const updated = { ...profile, goal };
    setProfile(updated);
    saveLearnerProfile(updated);
    triggerSaveAlert();
  };

  const handleTimeChange = (dailyTime: DailyTimeBudget) => {
    const updated = { ...profile, dailyTime };
    setProfile(updated);
    saveLearnerProfile(updated);
    triggerSaveAlert();
  };

  const handleStyleChange = (preferredStyle: PreferredStyle) => {
    const updated = { ...profile, preferredStyle };
    setProfile(updated);
    saveLearnerProfile(updated);
    triggerSaveAlert();
  };

  const handleLevelChange = (currentLevel: DifficultyLevel) => {
    const updated = { ...profile, currentLevel };
    setProfile(updated);
    saveLearnerProfile(updated);
    triggerSaveAlert();
  };

  const handleSocraticToggle = () => {
    const updated = { ...profile, socraticMode: !profile.socraticMode };
    setProfile(updated);
    saveLearnerProfile(updated);
    triggerSaveAlert();
  };

  const handleClearSearchHistory = () => {
    const updated = { ...profile, searchHistory: [] };
    setProfile(updated);
    saveLearnerProfile(updated);
    triggerSaveAlert();
  };

  const handleResetProfile = () => {
    if (confirm('Are you sure you want to reset your learner profile preferences to defaults?')) {
      setProfile(DEMO_LEARNER);
      saveLearnerProfile(DEMO_LEARNER);
      triggerSaveAlert();
    }
  };

  const goals: LearningGoal[] = [
    'College/exams',
    'Interview preparation',
    'Competitive programming',
    'Project building',
    'General understanding',
  ];

  const timeBudgets: DailyTimeBudget[] = [
    '10 minutes',
    '20 minutes',
    '30 minutes',
    '1 hour',
    '2+ hours',
  ];

  const styles: PreferredStyle[] = [
    'Visual',
    'Examples',
    'Theory',
    'Hands-on',
    'Discussion',
  ];

  const levels: { level: DifficultyLevel; label: string; desc: string }[] = [
    {
      level: 'Beginner',
      label: 'Beginner (Weak / Basic)',
      desc: 'Simple, long-context explanations with step-by-step analogies for struggling students.',
    },
    {
      level: 'Intermediate',
      label: 'Intermediate (Balanced)',
      desc: 'Standard explanation pace with diagrams and code snippets.',
    },
    {
      level: 'Advanced',
      label: 'Advanced (Smart / Expert)',
      desc: 'Concise, high-density technical explanations focusing on mathematical precision.',
    },
    {
      level: 'Challenge',
      label: 'Challenge Mode',
      desc: 'Hardcore problem-solving focus with minimal hand-holding.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#060a12] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Page Banner Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-indigo-950/40 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-2xl font-bold text-black shadow-lg shadow-cyan-500/20">
              {profile.avatar || profile.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                <User className="h-4 w-4" /> Adaptive Learner Profile
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5">
                {profile.name}&apos;s AI Personalization Hub
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Configure your student level, AI context depth, and learning preferences.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {savedSuccess && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4" /> Learner Profile Saved
              </span>
            )}

            <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all"
            >
              <Award className="h-4 w-4 text-cyan-400" />
              <span>Run AI Diagnostic</span>
            </button>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Streak</div>
              <div className="text-base font-bold text-amber-400 flex items-center gap-1">
                <Flame className="h-4 w-4 fill-amber-400" /> {profile.streakDays} Days
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Learner DNA Preferences */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learner Level & Context Depth (Weak vs Smart / Advanced Students) */}
            <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">Learner Level & AI Context Depth</h2>
                </div>
                <span className="text-xs text-emerald-400 font-bold">Active: {profile.currentLevel}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Controls how detailed or concise the AI explains topics across the platform:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {levels.map((item) => {
                  const isSelected = profile.currentLevel === item.level;
                  return (
                    <button
                      key={item.level}
                      onClick={() => handleLevelChange(item.level)}
                      className={`flex flex-col justify-between rounded-2xl p-4 text-left transition-all space-y-2 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/30 text-white ring-1 ring-emerald-500 shadow-md'
                          : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{item.label}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Learning Goal Selector */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-cyan-400" /> Primary Learning Goal
              </h2>
              <p className="text-xs text-slate-400">
                The AI Tutor tailors practice questions and explanation focus based on your main goal.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goals.map((g) => {
                  const isSelected = profile.goal === g;
                  return (
                    <button
                      key={g}
                      onClick={() => handleGoalChange(g)}
                      className={`flex items-center justify-between rounded-2xl p-4 text-xs font-semibold transition-all text-left ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/30 text-white ring-1 ring-cyan-500 shadow-md'
                          : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span>{g}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Time Budget */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-400" /> Daily Time Budget
              </h2>
              <p className="text-xs text-slate-400">
                Optimizes your learning sessions into bite-sized video, summary, and practice chunks.
              </p>

              <div className="flex flex-wrap gap-3">
                {timeBudgets.map((tb) => {
                  const isSelected = profile.dailyTime === tb;
                  return (
                    <button
                      key={tb}
                      onClick={() => handleTimeChange(tb)}
                      className={`rounded-2xl px-5 py-3 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-950/30 text-amber-300 ring-1 ring-amber-500 shadow-md'
                          : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {tb}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Learning Style */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-400" /> Preferred Learning Style
              </h2>
              <p className="text-xs text-slate-400">
                Formats tutor responses (e.g. step-by-step visual analogies vs hands-on code examples).
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {styles.map((s) => {
                  const isSelected = profile.preferredStyle === s;
                  return (
                    <button
                      key={s}
                      onClick={() => handleStyleChange(s)}
                      className={`rounded-2xl p-4 text-center text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/30 text-indigo-300 ring-1 ring-indigo-500 shadow-md'
                          : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Col: Tutor Behavior & Functional Action Summary */}
          <div className="space-y-6">
            {/* Socratic Mode Toggle Switch */}
            <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Socratic Mode</h3>
                </div>
                <button
                  onClick={handleSocraticToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    profile.socraticMode ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profile.socraticMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                When <span className="font-semibold text-cyan-400">Socratic Mode</span> is enabled, the AI Tutor guides you with targeted questions rather than handing you direct answers.
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] text-slate-400">
                Status: <span className="font-bold text-white">{profile.socraticMode ? 'Enabled (Guiding Questions)' : 'Disabled (Direct Concise Explanations)'}</span>
              </div>
            </div>

            {/* Learner DNA Overview & Quick Actions */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Award className="h-5 w-5 text-amber-400" /> Profile Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Student Name</span>
                  <span className="font-semibold text-white">{profile.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Goal</span>
                  <span className="font-semibold text-cyan-400">{profile.goal}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Daily Budget</span>
                  <span className="font-semibold text-amber-400">{profile.dailyTime}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Style</span>
                  <span className="font-semibold text-indigo-400">{profile.preferredStyle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Level / Depth</span>
                  <span className="font-semibold text-emerald-400">{profile.currentLevel}</span>
                </div>
              </div>

              {/* Functional CTA Navigation Buttons */}
              <div className="pt-2 space-y-2">
                <Link
                  href={`/learn/${encodeURIComponent(profile.lastStruggledTopic?.id || 'matrix')}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-3 text-xs font-bold text-black shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
                >
                  <BookOpen className="h-4 w-4 fill-black" /> Continue AI Learning Path
                </Link>

                <Link
                  href="/practice"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Code2 className="h-3.5 w-3.5 text-cyan-400" /> Open VS Code Practice IDE
                </Link>

                <button
                  onClick={handleResetProfile}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-rose-400" /> Reset Profile Settings
                </button>
              </div>
            </div>

            {/* Real Search & Activity History Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Search className="h-5 w-5 text-cyan-400" /> Recent Search & Activity Log
                </h3>

                {profile.searchHistory && profile.searchHistory.length > 0 && (
                  <button
                    onClick={handleClearSearchHistory}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:underline font-semibold"
                  >
                    <Trash2 className="h-3 w-3" /> Clear Log
                  </button>
                )}
              </div>

              {profile.searchHistory && profile.searchHistory.length > 0 ? (
                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 text-xs">
                  {profile.searchHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => router.push(`/learn?q=${encodeURIComponent(item.query)}`)}
                      className="w-full flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3 hover:border-cyan-500/40 hover:bg-white/10 transition-all text-left group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Search className="h-3.5 w-3.5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          &ldquo;{item.query}&rdquo;
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                        <span>{item.timestamp}</span>
                        <ChevronRight className="h-3 w-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No search history recorded yet. Use the top search bar to find topics!</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <DiagnosticTestModal isOpen={isDiagnosticOpen} onClose={() => setIsDiagnosticOpen(false)} />
    </div>
  );
}
