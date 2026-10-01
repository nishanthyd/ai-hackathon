'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Video,
  Sparkles,
  ShieldCheck,
  Filter,
  Clock,
  Play,
  List,
  LayoutGrid,
  Tv,
  ArrowRight,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { EducationalVideo, DifficultyLevel } from '@/types/learnai';

function LearnSearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list'); // YouTube style vertical list feed
  const [source, setSource] = useState<string>('live_youtube_search');

  useEffect(() => {
    if (initialQuery) {
      fetchVideos(initialQuery, difficulty);
    }
  }, [initialQuery]);

  const fetchVideos = async (q: string, diff: string) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    const storedYtKey = typeof window !== 'undefined' ? localStorage.getItem('YOUTUBE_API_KEY') || '' : '';

    try {
      const res = await fetch('/api/videos/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q.trim(), difficulty: diff, apiKey: storedYtKey }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.videos)) {
        setVideos(data.videos);
        setSource(data.source || 'live_youtube_search');
      }
    } catch (err) {
      console.error('Failed to search educational videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchVideos(query.trim(), difficulty);
  };

  const quickTopics = ['Matrix', 'Stacks', 'Python', 'Binary Search', 'Recursion', 'Calculus'];

  return (
    <div className="flex min-h-screen bg-[#060a12] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header & Search Bar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-bold">
              <Tv className="h-4 w-4" />
              <span>Official YouTube Video Search</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Search Educational Lessons
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Type any topic (e.g. <span className="text-cyan-300 font-semibold">Matrix</span>, <span className="text-cyan-300 font-semibold">Stacks</span>, <span className="text-cyan-300 font-semibold">Python</span>) to fetch official YouTube video lessons.
            </p>

            {/* Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type any topic (e.g. Matrix, Stacks, Python, Calculus)..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/90 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-inner"
                />
                <Search className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
              </div>

              {/* Difficulty Selector */}
              <div className="flex items-center gap-1 rounded-2xl bg-slate-900 p-1.5 border border-white/10 shrink-0">
                <Filter className="h-4 w-4 text-cyan-400 pl-1" />
                {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setDifficulty(lvl);
                      if (query.trim()) fetchVideos(query, lvl);
                    }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      difficulty === lvl
                        ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-cyan-500 px-6 py-3.5 text-sm font-bold text-black hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 shrink-0 flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search YouTube
              </button>
            </form>

            {/* Quick Topic Shortcut Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
              <span className="text-xs text-slate-500 font-semibold shrink-0">Try searching:</span>
              {quickTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    setQuery(topic);
                    fetchVideos(topic, difficulty);
                  }}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-all shrink-0"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* INITIAL STATE: NO VIDEOS UNTIL USER SEARCHES */}
          {!hasSearched && !isLoading && (
            <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30 p-12 md:p-16 text-center space-y-4 backdrop-blur-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mx-auto">
                <Search className="h-8 w-8" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Search YouTube Lessons Above</h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Type any topic (e.g. <span className="font-semibold text-cyan-400">Matrix</span>, <span className="font-semibold text-cyan-400">Stacks</span>, or <span className="font-semibold text-cyan-400">Python</span>) in the search box above to fetch official YouTube video lessons.
              </p>
            </div>
          )}

          {/* Subheader & Feed Layout Toggle when hasSearched */}
          {hasSearched && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs text-slate-400">
              <div>
                Showing official YouTube search feed for <span className="font-bold text-cyan-400 text-sm">&quot;{query}&quot;</span> ({difficulty} Level)
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  {source === 'youtube_api'
                    ? 'Live YouTube API'
                    : source === 'live_youtube_search'
                    ? 'Live YouTube Search'
                    : 'Topic-Matched YouTube Feed'}
                </span>

                {/* Layout Toggle: List (YouTube Style) vs Grid */}
                <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-white/10">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      viewMode === 'list' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                    title="YouTube List Feed (One Below Another)"
                  >
                    <List className="h-3.5 w-3.5" />
                    <span>List</span>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      viewMode === 'grid' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Grid</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Feed */}
          {isLoading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-16 text-center text-slate-400 animate-pulse space-y-3">
              <Sparkles className="h-8 w-8 text-cyan-400 mx-auto animate-spin" />
              <div className="text-base font-bold text-white">Searching official YouTube videos for &quot;{query}&quot;...</div>
              <p className="text-xs text-slate-500">Ranking by educational relevance and {difficulty} difficulty match.</p>
            </div>
          ) : (
            hasSearched && (
              viewMode === 'list' ? (
                /* YOUTUBE STYLE VERTICAL LIST FEED (ONE BELOW ANOTHER) */
                <div className="space-y-4">
                  {videos.map((vid) => (
                    <div
                      key={vid.id}
                      className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-xl"
                    >
                      {/* Left Thumbnail (YouTube Aspect Ratio) */}
                      <div className="relative aspect-video w-full md:w-80 shrink-0 overflow-hidden bg-black">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-black shadow-lg">
                            <Play className="h-6 w-6 fill-black pl-0.5" />
                          </div>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/90 px-2 py-0.5 text-xs font-bold text-white">
                          <Clock className="h-3.5 w-3.5 text-cyan-400" />
                          <span>{vid.duration}</span>
                        </div>

                        {/* Edu Score Badge */}
                        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-emerald-950/90 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                          <ShieldCheck className="h-3 w-3" />
                          <span>{vid.educationScore}% Edu Score</span>
                        </div>
                      </div>

                      {/* Right Video Info (YouTube Style Metadata) */}
                      <div className="flex-1 p-5 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                              {vid.difficulty}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{vid.channelName}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs text-slate-400">{vid.views}</span>
                          </div>

                          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                            {vid.title}
                          </h3>

                          <p className="mt-2 text-xs text-slate-300 leading-relaxed line-clamp-2">
                            {vid.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                          <span className="text-xs text-slate-400">
                            Topic Match: <span className="font-bold text-cyan-400">{vid.topicMatchScore}%</span>
                          </span>

                          <Link
                            href={`/learn/${encodeURIComponent(query.toLowerCase())}?v=${vid.youtubeId}&title=${encodeURIComponent(
                              vid.title
                            )}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all"
                          >
                            <Play className="h-3.5 w-3.5 fill-black" /> Launch Interactive Workspace
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* GRID VIEW */
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {videos.map((vid) => (
                    <div
                      key={vid.id}
                      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl hover:border-cyan-500/50 transition-all duration-300"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-xs font-bold text-white">
                          <span>{vid.duration}</span>
                        </div>
                      </div>

                      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="line-clamp-2 text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {vid.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-400">{vid.channelName}</p>
                          <p className="mt-2 line-clamp-2 text-xs text-slate-400 leading-relaxed">{vid.description}</p>
                        </div>

                        <Link
                          href={`/learn/${encodeURIComponent(query.toLowerCase())}?v=${vid.youtubeId}&title=${encodeURIComponent(
                            vid.title
                          )}`}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all"
                        >
                          <Play className="h-3.5 w-3.5 fill-black" /> Launch Lesson
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )
          )}
        </main>
      </div>
    </div>
  );
}

export default function LearnSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen bg-[#060a12] text-white items-center justify-center">
          <div className="text-cyan-400 font-bold">Loading educational search...</div>
        </div>
      }
    >
      <LearnSearchContent />
    </Suspense>
  );
}
