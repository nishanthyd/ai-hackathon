'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Target, Clock, BookOpen, Check } from 'lucide-react';
import { getLearnerProfile, saveLearnerProfile } from '@/lib/store';
import { DifficultyLevel, LearningGoal, DailyTimeBudget, PreferredStyle } from '@/types/learnai';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const profile = getLearnerProfile();
  const [goal, setGoal] = useState<LearningGoal>(profile.goal || 'Exam preparation');
  const [dailyTime, setDailyTime] = useState<DailyTimeBudget>(profile.dailyTime || '20 minutes');
  const [style, setStyle] = useState<PreferredStyle>(profile.preferredStyle || 'Visual');
  const [level, setLevel] = useState<DifficultyLevel>(profile.currentLevel || 'Intermediate');

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = {
      ...profile,
      goal,
      dailyTime,
      preferredStyle: style,
      currentLevel: level,
    };
    saveLearnerProfile(updated);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0f172a] p-6 sm:p-8 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-white/5 p-2 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Customize Your Learner DNA</h2>
              <p className="text-xs text-slate-400">Personalize AI recommendations & session length</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {/* Goal */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">1. Primary Learning Goal</label>
              <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  'College/exams',
                  'Interview preparation',
                  'Competitive programming',
                  'Project building',
                  'General understanding',
                ].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g as LearningGoal)}
                    className={`rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                      goal === g
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Time */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">2. Available Daily Time</label>
              <div className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {['10 minutes', '20 minutes', '30 minutes', '1 hour', '2+ hours'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setDailyTime(t as DailyTimeBudget)}
                    className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all ${
                      dailyTime === t
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Style */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">3. Preferred Learning Style</label>
              <div className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {['Visual', 'Examples', 'Theory', 'Hands-on', 'Discussion'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s as PreferredStyle)}
                    className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all ${
                      style === s
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-black hover:bg-cyan-400"
            >
              <Check className="h-4 w-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
