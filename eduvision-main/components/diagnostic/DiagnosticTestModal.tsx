'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { DEMO_DIAGNOSTIC_QUESTIONS } from '@/data/demoData';

interface DiagnosticTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function DiagnosticTestModal({ isOpen, onClose, onComplete }: DiagnosticTestModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = DEMO_DIAGNOSTIC_QUESTIONS[currentIndex];

  const handleSelectOption = (option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: option }));
  };

  const handleNext = () => {
    if (currentIndex < DEMO_DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f172a] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-white/5 p-2 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {!isFinished ? (
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-bold">
                <Sparkles className="h-4 w-4" />
                <span>AI Subject Diagnostic Test • Question {currentIndex + 1} of {DEMO_DIAGNOSTIC_QUESTIONS.length}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-white">{currentQ.question}</h3>

              <div className="mt-6 space-y-3">
                {currentQ.options?.map((opt) => {
                  const isSel = selectedAnswers[currentQ.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full rounded-2xl border p-4 text-left text-sm font-semibold transition-all ${
                        isSel
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  disabled={!selectedAnswers[currentQ.id]}
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold text-black hover:bg-cyan-400 disabled:opacity-50"
                >
                  <span>{currentIndex < DEMO_DIAGNOSTIC_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Diagnostic'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Diagnostic Knowledge Profile</h3>
                  <p className="text-xs text-slate-400">Personalized learning path automatically generated!</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { name: 'Variables & Types', score: 95, status: '🟢 Mastered (Skipped)' },
                  { name: 'Loops & Iteration', score: 82, status: '🟢 Mastered' },
                  { name: 'Functions & Scope', score: 61, status: '🟡 Review Needed' },
                  { name: 'Lists & Arrays', score: 87, status: '🟢 Mastered' },
                  { name: 'Recursion', score: 24, status: '🔴 Weak (High Focus)' },
                  { name: 'OOP', score: 48, status: '🟡 Learning' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5">
                    <span className="text-sm font-semibold text-white">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-cyan-400">{item.score}%</span>
                      <span className="text-xs text-slate-300">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    onComplete?.();
                    onClose();
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold text-black hover:bg-cyan-400"
                >
                  <span>Launch Personalized Path</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
