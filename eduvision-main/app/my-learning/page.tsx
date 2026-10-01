'use client';

import React from 'react';
import Link from 'next/link';
import { BookmarkCheck, RotateCcw, CheckCircle2, ArrowRight, Sparkles, Clock } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { getSpacedRevisions } from '@/lib/store';

export default function MyLearningPage() {
  const revisions = getSpacedRevisions();

  return (
    <div className="flex min-h-screen bg-[#0b0f17] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-10 space-y-10 max-w-7xl mx-auto w-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-bold">
              <BookmarkCheck className="h-4 w-4" />
              <span>Personalized Learning Path & Spaced Revisions</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              My Learning Path & Review Schedule
            </h1>
          </div>

          {/* SPACED REVISION SECTION (Prompt Point 25) */}
          <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-amber-400" />
                  <span>Due for Review (Spaced Repetition)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Scheduled based on your memory retention curve to prevent forgetting.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {revisions.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400">{item.topicName}</span>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 font-bold">
                      {item.dueDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">{item.recallQuestion}</p>
                  <Link
                    href="/practice"
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:underline pt-2"
                  >
                    <span>Quick 2-Min Review</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* VISUAL LEARNING PATH (Prompt Point 8) */}
          <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span>Python & Data Structures Learning Path</span>
            </h2>

            <div className="relative space-y-8 pl-6 border-l-2 border-cyan-500/30">
              {[
                { name: 'Variables & Data Types', status: 'completed', pct: 95, difficulty: 'Beginner' },
                { name: 'Loops & Iteration', status: 'completed', pct: 88, difficulty: 'Beginner' },
                { name: 'Functions & Scope', status: 'completed', pct: 82, difficulty: 'Beginner' },
                { name: 'Recursion & Base Cases', status: 'current', pct: 24, difficulty: 'Intermediate', isFocus: true },
                { name: 'Call Stack Tracing', status: 'current', pct: 30, difficulty: 'Intermediate' },
                { name: 'Linked Lists', status: 'upcoming', pct: 58, difficulty: 'Intermediate' },
                { name: 'Dynamic Programming', status: 'upcoming', pct: 0, difficulty: 'Advanced' },
              ].map((node, idx) => (
                <div key={idx} className="relative flex items-center justify-between">
                  <div className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-[#0b0f17] border-2 border-cyan-500 text-cyan-400">
                    {node.status === 'completed' ? '✓' : idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-base font-bold ${node.isFocus ? 'text-rose-400' : 'text-white'}`}>
                      {node.name} {node.isFocus && '🔴 High Focus'}
                    </h4>
                    <p className="text-xs text-slate-400">{node.difficulty} • Mastery: {node.pct}%</p>
                  </div>

                  <Link
                    href={`/learn/${node.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 hover:border-cyan-500 hover:text-cyan-400"
                  >
                    Open Lesson →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
