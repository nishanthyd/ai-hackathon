'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Flame, Award, SlidersHorizontal } from 'lucide-react';
import { getLearnerProfile, recordSearchQuery } from '@/lib/store';

interface HeaderProps {
  onOpenOnboarding?: () => void;
}

export default function Header({ onOpenOnboarding }: HeaderProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<{ streakDays: number; currentLevel: string }>({
    streakDays: 3,
    currentLevel: 'Intermediate',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setProfile(getLearnerProfile());
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    recordSearchQuery(searchQuery.trim());
    router.push(`/learn?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0b0f17]/90 px-6 py-3.5 backdrop-blur-xl">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Global Search: e.g. Python recursion, binary search, call stack..."
          className="w-full rounded-2xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-24 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 rounded-xl bg-cyan-500/20 px-3 py-1 text-[11px] font-bold text-cyan-400 hover:bg-cyan-500/30"
        >
          Search
        </button>
      </form>

      {/* Stats & Actions */}
      <div className="flex items-center gap-3">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400">
          <Flame className="h-4 w-4 fill-amber-400" />
          <span suppressHydrationWarning>{profile.streakDays} Days</span>
        </div>

        {/* Level Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
          <Award className="h-4 w-4 text-cyan-400" />
          <span suppressHydrationWarning>{profile.currentLevel}</span>
        </div>

        {/* Goal / Onboarding Launcher */}
        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
          <span className="hidden md:inline">Goal & Time</span>
        </button>
      </div>
    </header>
  );
}
