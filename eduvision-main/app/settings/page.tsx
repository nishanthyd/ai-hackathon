'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  Database,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Terminal,
  Save,
  Trash2,
  Download,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { getLearnerProfile, saveLearnerProfile } from '@/lib/store';
import { LearnerProfile } from '@/types/learnai';

export default function SettingsPage() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [groqKey, setGroqKey] = useState('');
  const [ytKey, setYtKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    setProfile(getLearnerProfile());
    if (typeof window !== 'undefined') {
      setGroqKey(localStorage.getItem('GROQ_API_KEY') || '');
      setYtKey(localStorage.getItem('YOUTUBE_API_KEY') || '');
    }
  }, []);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('GROQ_API_KEY', groqKey);
      localStorage.setItem('YOUTUBE_API_KEY', ytKey);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (typeof window !== 'undefined') {
      if (confirm('Are you sure you want to reset your local progress to default demo state?')) {
        localStorage.clear();
        setResetSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    }
  };

  const handleExportData = () => {
    if (!profile) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `learnai-profile-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#060a12] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-indigo-950/40 p-6 md:p-8 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <Settings className="h-4 w-4" /> Platform & Engine Configuration
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              System Settings & Integration Keys
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              Configure Groq API keys, YouTube search integration, standalone demo fallbacks, and local storage state.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-center">
              <div className="text-xs text-slate-400">Demo Engine</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> Standalone Active
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: API Keys & AI Calibration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Demo Mode Status Card */}
            <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 p-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Standalone Demo Mode Enabled
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs text-emerald-400 font-semibold border border-emerald-500/30">
                      100% Functional
                    </span>
                  </h3>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    LearnAI is configured with realistic deterministic fallbacks for LLM chat, YouTube video transcripts, and Manim animation generation. Providing your own API keys below will elevate responses to live Groq models.
                  </p>
                </div>
              </div>
            </div>

            {/* API Keys Form */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Key className="h-5 w-5 text-cyan-400" /> External API Credentials
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Keys are stored locally in your browser session. They are never sent to external servers beyond direct API endpoints.
              </p>

              <form onSubmit={handleSaveKeys} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Groq LLM API Key (llama-3.3-70b-versatile)
                  </label>
                  <input
                    type="password"
                    placeholder="gsk_..."
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    If omitted, system uses built-in high-quality AI tutor fallback responses.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    YouTube Data API v3 Key
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={ytKey}
                    onChange={(e) => setYtKey(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    If omitted, educational videos are searched via fallback educational index.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all"
                  >
                    <Save className="h-4 w-4" /> Save API Credentials
                  </button>
                  {savedSuccess && (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Saved!
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* AI Engine & Socratic Controls */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <Sliders className="h-5 w-5 text-indigo-400" /> AI Engine Calibration
              </h2>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Socratic Prompting Mode</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ask guiding questions instead of direct answers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const updated = { ...profile, socraticMode: !profile.socraticMode };
                    setProfile(updated);
                    saveLearnerProfile(updated);
                  }}
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

              <div className="border-t border-white/5 pt-4">
                <h4 className="text-sm font-bold text-white mb-2">Adaptive Engine Sensitivity</h4>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Conservative (Slow Progression)</span>
                  <span className="text-cyan-400 font-semibold">Balanced (Default)</span>
                  <span>Aggressive (Fast Progression)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 mt-2 overflow-hidden">
                  <div className="h-full bg-cyan-500 w-1/2 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Data & Diagnostics Management */}
          <div className="space-y-6">
            {/* Data Export & Reset Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Database className="h-5 w-5 text-amber-400" /> Storage & Reset Controls
              </h3>

              <p className="text-xs text-slate-400">
                Manage your local progress data, backup your learner DNA, or restore default state.
              </p>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleExportData}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Download className="h-4 w-4 text-cyan-400" /> Export Learner DNA (JSON)
                </button>

                <button
                  onClick={handleResetData}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 className="h-4 w-4" /> Reset Local State & Restore Demo
                </button>
                {resetSuccess && (
                  <p className="text-center text-xs font-bold text-emerald-400">
                    Restoring demo state... reloading!
                  </p>
                )}
              </div>
            </div>

            {/* Architecture Information Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <Terminal className="h-4 w-4 text-cyan-400" /> LearnAI App Architecture
              </div>
              <p>Next.js 16 (App Router) + React 19</p>
              <p>Tailwind CSS v4 + Framer Motion</p>
              <p>Deterministic AI Fallback Engine v2.0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
