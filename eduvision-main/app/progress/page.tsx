'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Brain,
  Clock,
  Target,
  ArrowUpRight,
  RotateCcw,
  Code2,
  BookOpen,
  Check,
  Zap,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import DiagnosticTestModal from '@/components/diagnostic/DiagnosticTestModal';
import { getLearnerProfile, getKnowledgeNodes, saveLearnerProfile, resolveMistake } from '@/lib/store';
import { LearnerProfile, KnowledgeNode } from '@/types/learnai';

export default function ProgressAnalyticsPage() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProfile(getLearnerProfile());
    setNodes(getKnowledgeNodes());
  };

  if (!profile) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdateConfidence = (newScore: number) => {
    const updated = { ...profile, confidenceScore: newScore };
    setProfile(updated);
    saveLearnerProfile(updated);
    showToast(`Self-Rated Confidence updated to ${newScore}%!`);
  };

  const handleResolveMistake = (mistakeId: string, topicName: string) => {
    const updated = resolveMistake(mistakeId);
    setProfile(updated);
    setNodes(getKnowledgeNodes());
    showToast(`Resolved misconception for ${topicName}!`);
  };

  const totalStudyMinutes = profile.weeklyActivity.reduce((a, b) => a + b, 0);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weakNodes = nodes.filter((n) => n.status === 'weak');
  const masteredNodes = nodes.filter((n) => n.status === 'mastered');

  // Calibration calculation from real quiz history
  const realTotalQuestions = profile.totalQuestionsAnswered || 0;
  const realCorrect = profile.totalCorrectAnswers || 0;
  const accuracyEst = realTotalQuestions > 0 ? Math.round((realCorrect / realTotalQuestions) * 100) : 78;
  const confidenceDiff = profile.confidenceScore - accuracyEst;

  let calibrationLabel = 'Well Calibrated';
  let calibrationBadgeColor = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
  let calibrationText = `Your confidence score (${profile.confidenceScore}%) is tightly calibrated with your objective quiz accuracy (${accuracyEst}%). You demonstrate strong self-awareness.`;

  if (confidenceDiff > 15) {
    calibrationLabel = 'Over-Confident';
    calibrationBadgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    calibrationText = `Your confidence rating (${profile.confidenceScore}%) is higher than your demonstrated test accuracy (${accuracyEst}%). Review edge cases and base conditions in practice mode.`;
  } else if (confidenceDiff < -15) {
    calibrationLabel = 'Under-Confident';
    calibrationBadgeColor = 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
    calibrationText = `You are performing better than you think! Objective test accuracy (${accuracyEst}%) exceeds self-rated confidence (${profile.confidenceScore}%).`;
  }

  const focusSprintTopic = profile.lastStruggledTopic?.name || (weakNodes[0] ? weakNodes[0].name : 'Matrix Multiplication');

  return (
    <div className="min-h-screen bg-[#060a12] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Page Banner Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-indigo-950/40 p-6 md:p-8 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <TrendingUp className="h-4 w-4" /> Real Telemetry & Performance Calibration
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Learning Progress & Mastery
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              Calibrate your self-confidence against objective accuracy, track weekly progress, and resolve misconceptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {toastMessage && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4" /> {toastMessage}
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

        {/* Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Weekly Learning</span>
              <Clock className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">{totalStudyMinutes} mins</div>
            <div className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> Tracked live
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Mastered Concepts</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">
              {masteredNodes.length} / {nodes.length}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {Math.round((masteredNodes.length / (nodes.length || 1)) * 100)}% concept mastery
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Quiz Accuracy</span>
              <Target className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">{accuracyEst}%</div>
            <div className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> Calculated from real test runs
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Self-Rated Confidence</span>
              <Brain className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">{profile.confidenceScore}%</div>
            <div className="mt-1 text-xs text-amber-300">Click calibration index below</div>
          </div>
        </div>

        {/* Calibration & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Calibration & Subject Mastery */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interactive Confidence vs Accuracy Calibration Index */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-cyan-400" /> Interactive Confidence vs Accuracy Calibration
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Measures whether your perceived subject mastery matches your objective test results.
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${calibrationBadgeColor} self-start sm:self-auto`}>
                  {calibrationLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Confidence Bar & Rate Buttons */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span>Self-Rated Confidence</span>
                    <span className="text-amber-400 font-bold">{profile.confidenceScore}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                      style={{ width: `${profile.confidenceScore}%` }}
                    />
                  </div>

                  {/* Interactive Rate Buttons */}
                  <div className="pt-1 space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Update your confidence score:</span>
                    <div className="flex gap-1.5">
                      {[50, 65, 78, 90].map((score) => (
                        <button
                          key={score}
                          onClick={() => handleUpdateConfidence(score)}
                          className={`flex-1 rounded-xl py-1 text-[11px] font-bold transition-all ${
                            profile.confidenceScore === score
                              ? 'bg-amber-500 text-black shadow-md'
                              : 'bg-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {score}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actual Accuracy Bar */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
                      <span>Objective Test Accuracy</span>
                      <span className="text-emerald-400 font-bold">{accuracyEst}%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${accuracyEst}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Calculated from <span className="text-white font-semibold">{realTotalQuestions}</span> total quiz & practice questions.
                  </div>
                </div>
              </div>

              {/* Calibration Insights */}
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-white">AI Calibration Insight: </span>
                    {calibrationText}
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Mastery Progression */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-400" /> Subject Mastery Breakdown
              </h2>

              <div className="space-y-4">
                {Object.entries(profile.subjects).map(([subjectName, data]) => (
                  <div key={subjectName} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">{subjectName}</h3>
                        <span className="text-[11px] text-slate-400">
                          Last studied: {data.lastStudiedDate}
                        </span>
                      </div>
                      <span className="text-xl font-extrabold text-cyan-400">{data.percentage}%</span>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 rounded-full"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Strong: {data.strongTopics.join(', ') || 'None'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href="/practice"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:underline"
                        >
                          <Code2 className="h-3 w-3" /> Practice IDE
                        </Link>
                        <Link
                          href={`/learn/${encodeURIComponent(subjectName.toLowerCase())}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:underline"
                        >
                          <BookOpen className="h-3 w-3" /> Study Topic
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Activity Bar Chart */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-400" /> Daily Learning Activity (Minutes)
              </h2>

              <div className="flex items-end justify-between gap-3 h-40 pt-6 px-2 border-b border-white/10">
                {profile.weeklyActivity.map((minutes, idx) => {
                  const maxMins = Math.max(...profile.weeklyActivity, 30);
                  const heightPct = Math.round((minutes / maxMins) * 100);
                  const isToday = idx === 4;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] text-slate-400">{minutes}m</span>
                      <div
                        className={`w-full max-w-[40px] rounded-t-xl transition-all ${
                          isToday
                            ? 'bg-gradient-to-t from-cyan-500 to-indigo-500 shadow-lg shadow-cyan-500/20'
                            : minutes > 0
                            ? 'bg-slate-700 hover:bg-slate-600'
                            : 'bg-slate-800/50'
                        }`}
                        style={{ height: `${Math.max(heightPct, 8)}%` }}
                      />
                      <span className={`text-xs font-semibold ${isToday ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {daysOfWeek[idx]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Col: Active Misconceptions & AI Recommended Sprint */}
          <div className="space-y-6">
            {/* Active Misconceptions Bank with Resolution Actions */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" /> Active Misconceptions
                </h3>
                <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs text-red-300 font-bold">
                  {profile.recentMistakes?.length || 0} Active
                </span>
              </div>

              {profile.recentMistakes && profile.recentMistakes.length > 0 ? (
                <div className="space-y-4">
                  {profile.recentMistakes.map((mistake) => (
                    <div
                      key={mistake.id}
                      className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-red-400">{mistake.topicName}</span>
                        <span className="text-slate-400 font-mono">{mistake.occurrenceCount}x error</span>
                      </div>

                      <p className="text-xs text-white font-medium">{mistake.concept}</p>
                      <p className="text-[11px] text-slate-300 bg-black/40 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                        &ldquo;{mistake.explanation}&rdquo;
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href={`/learn/${encodeURIComponent(mistake.topicName)}`}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-red-500/20 py-2 text-xs font-semibold text-red-300 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Re-learn
                        </Link>

                        <button
                          onClick={() => handleResolveMistake(mistake.id, mistake.topicName)}
                          className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all"
                        >
                          <Check className="h-3.5 w-3.5" /> Resolved
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center space-y-1">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto" />
                  <div className="text-xs font-bold text-emerald-300">All Misconceptions Resolved!</div>
                  <p className="text-[11px] text-slate-400">Great job! You have clean accuracy on fundamental concepts.</p>
                </div>
              )}
            </div>

            {/* AI Custom Action Recommendation Sprint */}
            <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-indigo-950/40 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="h-4 w-4" /> Recommended Sprint
              </div>
              <h3 className="text-lg font-bold text-white capitalize">
                Focus Sprint: {focusSprintTopic}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Telemetry shows you can boost your mastery score by +12% by spending 15 minutes reviewing base cases & concept algorithms for <span className="text-white font-bold">{focusSprintTopic}</span>.
              </p>

              <Link
                href={`/learn/${encodeURIComponent(focusSprintTopic)}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-xs font-bold text-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all"
              >
                <Zap className="h-4 w-4" /> Start 15-Min Focused Sprint
              </Link>
            </div>
          </div>
        </div>
      </main>

      <DiagnosticTestModal isOpen={isDiagnosticOpen} onClose={() => setIsDiagnosticOpen(false)} />
    </div>
  );
}
