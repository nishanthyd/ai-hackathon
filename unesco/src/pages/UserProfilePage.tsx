import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle, AlertTriangle, Flame, Award, History, RotateCcw } from 'lucide-react';
import { getStudentProfile, type StudentProfile } from '../utils/learningProfileStore';
import { motionVariants } from '../utils/animation';

export default function UserProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>(getStudentProfile());

  useEffect(() => {
    setProfile(getStudentProfile());
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={motionVariants.pageTransition}
      className="space-y-10 pb-16 pt-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="glass-panel rounded-[2.5rem] border border-white/10 bg-[#0C1528]/95 p-8 shadow-soft backdrop-blur-xl sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent2/10 text-accent2 border border-accent2/30 text-3xl font-bold">
                {profile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-textHigh">{profile.name}'s Profile</h1>
                  <span className="rounded-full bg-accent2/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent2">
                    {profile.currentLevel} Level
                  </span>
                </div>
                <p className="mt-1 text-sm text-textMid">
                  Learning Speed: <span className="font-semibold text-textHigh">{profile.learningSpeed}</span> • Confidence: <span className="font-semibold text-accent2">{profile.confidence}%</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 border border-white/10">
                <Flame className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-xs uppercase text-textMid font-medium">Daily Streak</p>
                  <p className="text-sm font-bold text-textHigh">5 Days</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 border border-white/10">
                <Award className="h-5 w-5 text-accent2" />
                <div>
                  <p className="text-xs uppercase text-textMid font-medium">Mastery Rank</p>
                  <p className="text-sm font-bold text-textHigh">Intermediate III</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Section: Knowledge Progress + Weak/Strong Topics */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Knowledge Progress Bars */}
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-8 shadow-soft backdrop-blur-xl">
            <h2 className="text-xl font-bold text-textHigh flex items-center gap-2">
              <span>🧠 Knowledge Mastery</span>
            </h2>
            <p className="mt-1 text-xs text-textMid">Continuously updated based on interactive practice and quiz results.</p>

            <div className="mt-6 space-y-6">
              {Object.values(profile.subjects).map((subj) => (
                <div key={subj.subject} className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-textHigh">{subj.subject}</span>
                    <span className="text-accent2">{subj.percentage}%</span>
                  </div>
                  <div className="h-3.5 w-full overflow-hidden rounded-full bg-white/10 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-accent2 transition-all duration-1000"
                      style={{ width: `${subj.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses Breakdown */}
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-8 shadow-soft backdrop-blur-xl">
            <h2 className="text-xl font-bold text-textHigh">🎯 Topic Skill Breakdown</h2>
            <p className="mt-1 text-xs text-textMid">Identified strengths and key areas requiring targeted revision.</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {/* Strong Topics */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                  <CheckCircle className="h-4 w-4" />
                  <span>Strong Topics</span>
                </div>
                <div className="space-y-2">
                  {Object.values(profile.subjects)
                    .flatMap((s) => s.strongTopics)
                    .map((t) => (
                      <div key={t} className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{t}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Weak Topics */}
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Needs Practice</span>
                </div>
                <div className="space-y-2">
                  {Object.values(profile.subjects)
                    .flatMap((s) => s.weakTopics)
                    .map((t) => (
                      <div key={t} className="flex items-center gap-2 text-xs font-semibold text-rose-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                        <span>{t}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning History & Recent Mistakes */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Recent Mistakes Log */}
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-8 shadow-soft backdrop-blur-xl">
            <h3 className="text-lg font-bold text-textHigh flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-amber-400" />
              <span>Recent Mistakes & Revision Log</span>
            </h3>

            <div className="mt-4 space-y-3">
              {profile.recentMistakes.map((mistake, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-xs text-textMid">
                    <span className="font-semibold text-amber-400">{mistake.topic}</span>
                    <span>{mistake.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-textHigh font-medium">{mistake.question}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity History */}
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-8 shadow-soft backdrop-blur-xl">
            <h3 className="text-lg font-bold text-textHigh flex items-center gap-2">
              <History className="h-5 w-5 text-accent2" />
              <span>Learning Session History</span>
            </h3>

            <div className="mt-4 space-y-3">
              {profile.history.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <h4 className="text-sm font-bold text-textHigh">{item.topic}</h4>
                    <p className="text-xs text-textMid capitalize">Mode: {item.mode} • Level: {item.difficulty}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${item.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {item.score}% Score
                    </span>
                    <p className="text-xs text-textMid">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
