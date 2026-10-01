'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Code2,
  BookmarkCheck,
  GitGraph,
  TrendingUp,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/practice', label: 'Practice', icon: Code2 },
  { href: '/my-learning', label: 'My Learning', icon: BookmarkCheck },
  { href: '/knowledge-map', label: 'Knowledge Map', icon: GitGraph },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-white/10 bg-[#080d17] p-5 sticky top-0 h-screen select-none z-40">
        <div>
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 text-black font-bold shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-5 w-5 fill-black" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                LearnAI
                <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/30">
                  PRO
                </span>
              </span>
              <p className="text-[11px] text-slate-400">Adaptive AI Platform</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Learner DNA Mini Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Adaptive Engine</span>
            <span className="text-emerald-400">Active</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Personalizing content, difficulty & learning path.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/10 bg-[#080d17]/95 p-2 backdrop-blur-xl lg:hidden">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] font-medium ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
