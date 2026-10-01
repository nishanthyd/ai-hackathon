'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GitGraph,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Brain,
  ChevronRight,
  Layers,
  BarChart2,
  RefreshCw,
  Code2,
  Target,
  Zap,
  BookOpen,
  Award,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { getKnowledgeNodes, getLearnerProfile, getPracticeHistory } from '@/lib/store';
import { KnowledgeNode, LearnerProfile } from '@/types/learnai';

export default function KnowledgeMapPage() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [practiceHistory, setPracticeHistory] = useState<Record<string, any>>({});
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNode, setActiveNode] = useState<KnowledgeNode | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const loadedNodes = getKnowledgeNodes();
    const loadedProfile = getLearnerProfile();
    const loadedPractice = getPracticeHistory();
    setNodes(loadedNodes);
    setProfile(loadedProfile);
    setPracticeHistory(loadedPractice);

    if (loadedNodes.length > 0) {
      // Prioritize selecting a weak node first, otherwise first available
      const weak = loadedNodes.find((n) => n.status === 'weak');
      setActiveNode(weak || loadedNodes[0]);
    }
  };

  const subjects = ['All', ...Array.from(new Set(nodes.map((n) => n.subject)))];

  const filteredNodes = nodes.filter((node) => {
    const matchesSubject = selectedSubject === 'All' || node.subject === selectedSubject;
    const matchesSearch =
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const weakNodes = nodes.filter((n) => n.status === 'weak');
  const masteredNodes = nodes.filter((n) => n.status === 'mastered');
  const learningNodes = nodes.filter((n) => n.status === 'learning');

  const getStatusBadge = (status: KnowledgeNode['status']) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" /> Mastered
          </span>
        );
      case 'learning':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/30">
            <Clock className="h-3 w-3" /> Learning
          </span>
        );
      case 'weak':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-400 border border-red-500/30">
            <AlertTriangle className="h-3 w-3" /> Weak Gap
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400 border border-slate-700">
            Not Started
          </span>
        );
    }
  };

  const getNodeCardBorder = (status: KnowledgeNode['status'], isSelected: boolean) => {
    if (isSelected) return 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500';
    switch (status) {
      case 'mastered':
        return 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/60';
      case 'learning':
        return 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/60';
      case 'weak':
        return 'border-red-500/40 bg-red-950/15 hover:border-red-500/70';
      default:
        return 'border-white/10 bg-slate-900/50 hover:border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Page Banner & Real Telemetry Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-indigo-950/40 p-6 md:p-8 backdrop-blur-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <GitGraph className="h-4 w-4" /> Real Telemetry Knowledge Graph
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Concept Tree & Learner Diagnostics
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Dynamically calculated from your past quiz attempts, VS Code practice executions, and search history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center">
              <div className="text-[11px] text-slate-400 font-semibold">Mastered Concepts</div>
              <div className="text-xl font-extrabold text-emerald-400">{masteredNodes.length} Nodes</div>
            </div>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center">
              <div className="text-[11px] text-slate-400 font-semibold">In Progress</div>
              <div className="text-xl font-bold text-amber-400">{learningNodes.length} Nodes</div>
            </div>
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center">
              <div className="text-[11px] text-slate-400 font-semibold">Weak Gaps</div>
              <div className="text-xl font-bold text-red-400">{weakNodes.length} Critical</div>
            </div>
          </div>
        </div>

        {/* Real Strengths & Weaknesses Dashboard */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Weaknesses & Misconception Log */}
          <div className="rounded-3xl border border-red-500/30 bg-gradient-to-b from-red-950/20 to-[#0b0f17] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <h3 className="text-base font-bold text-white">Areas of Weakness (Gaps)</h3>
              </div>
              <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold text-red-300">
                {weakNodes.length} Detected
              </span>
            </div>

            <div className="space-y-3">
              {weakNodes.map((wNode) => (
                <div key={wNode.id} className="rounded-2xl border border-red-500/20 bg-black/40 p-3.5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{wNode.name}</span>
                    <span className="text-red-400 font-bold">{wNode.masteryPercentage}% Mastery</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {wNode.mistakeCount} recorded errors on base logic & condition evaluation.
                  </p>
                  <Link
                    href={`/learn/${encodeURIComponent(wNode.name)}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:underline pt-1"
                  >
                    <span>Bridge Knowledge Gap</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}

              {weakNodes.length === 0 && (
                <p className="text-xs text-slate-400 italic">No critical knowledge gaps detected! Keep practicing.</p>
              )}
            </div>
          </div>

          {/* Card 2: Strengths & Verified Masteries */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-[#0b0f17] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Areas of Strength</h3>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                {masteredNodes.length} Mastered
              </span>
            </div>

            <div className="space-y-3">
              {masteredNodes.map((mNode) => (
                <div key={mNode.id} className="rounded-2xl border border-emerald-500/20 bg-black/40 p-3.5 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{mNode.name}</span>
                    <span className="text-emerald-400 font-bold">{mNode.masteryPercentage}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>0 active misconceptions logged</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Actionable AI Practice Suggestions */}
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-[#0b0f17] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Actionable AI Recommendations</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Code2 className="h-4 w-4" /> VS Code AI Line Diagnostic
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Run test checks on <span className="text-white font-semibold">ReLU Activation</span> or <span className="text-white font-semibold">Matrix Multiplication</span> in the practice sandbox.
                </p>
                <Link href="/practice" className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:underline">
                  <span>Open VS Code IDE</span> <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                  <Brain className="h-4 w-4" /> 3D Manim Visualization
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Watch 3D animated matrix dot products to visualize spatial vector transformations.
                </p>
                <Link href="/learn/matrix" className="inline-flex items-center gap-1 font-bold text-purple-400 hover:underline">
                  <span>Watch 3D Animation</span> <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`rounded-xl px-4 py-2 text-xs font-medium transition-all shrink-0 ${
                  selectedSubject === subj
                    ? 'bg-cyan-500 text-black font-semibold shadow-lg shadow-cyan-500/20'
                    : 'border border-white/10 bg-slate-900/80 text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search concepts or nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Knowledge Tree Grid & Side Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Concept Nodes */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
              <span>CONCEPT NODES ({filteredNodes.length})</span>
              <span>Click node to inspect telemetry details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredNodes.map((node) => {
                const isSelected = activeNode?.id === node.id;
                const parentNode = nodes.find((n) => n.id === node.parent);

                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNode(node)}
                    className={`cursor-pointer rounded-2xl border p-5 transition-all relative overflow-hidden ${getNodeCardBorder(
                      node.status,
                      isSelected
                    )}`}
                  >
                    {/* Background Progress Tint */}
                    <div
                      className="absolute bottom-0 left-0 top-0 bg-white/5 transition-all pointer-events-none"
                      style={{ width: `${node.masteryPercentage}%` }}
                    />

                    <div className="relative z-10 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                            {node.subject}
                          </span>
                          <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                            {node.name}
                          </h3>
                        </div>
                        {getStatusBadge(node.status)}
                      </div>

                      {/* Parent Dependency */}
                      {parentNode && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-white/5 rounded-lg px-2.5 py-1 w-fit border border-white/5">
                          <Layers className="h-3 w-3 text-cyan-400" />
                          <span>Requires: {parentNode.name}</span>
                        </div>
                      )}

                      {/* Mastery Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-400">Mastery Level</span>
                          <span className="font-bold text-white">{node.masteryPercentage}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              node.status === 'mastered'
                                ? 'bg-emerald-400'
                                : node.status === 'learning'
                                ? 'bg-amber-400'
                                : node.status === 'weak'
                                ? 'bg-red-400'
                                : 'bg-slate-600'
                            }`}
                            style={{ width: `${node.masteryPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer Details */}
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/5">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {node.estimatedTimeMinutes} min
                        </span>
                        {node.mistakeCount > 0 ? (
                          <span className="text-red-400 font-medium">
                            {node.mistakeCount} Misconceptions
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium">Verified</span>
                        )}
                        <span className="text-cyan-400 hover:underline flex items-center gap-0.5 font-medium">
                          Select <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Active Node Inspector */}
          <div className="space-y-6">
            {activeNode ? (
              <div className="sticky top-24 rounded-3xl border border-white/10 bg-slate-900/90 p-6 backdrop-blur-xl shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">Node Inspector</h3>
                  </div>
                  {getStatusBadge(activeNode.status)}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      {activeNode.subject}
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-0.5">
                      {activeNode.name}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Difficulty Level: <span className="font-semibold text-cyan-400">{activeNode.difficulty}</span>
                    </p>
                  </div>

                  {/* Mastery Gauge Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>Calculated Mastery Score</span>
                      <span className="text-cyan-400 text-sm font-bold">
                        {activeNode.masteryPercentage}%
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all"
                        style={{ width: `${activeNode.masteryPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Prerequisite Chain */}
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 space-y-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Dependency Mapping
                    </div>
                    {activeNode.parent ? (
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Layers className="h-4 w-4 text-cyan-400" />
                        <span>Depends on concept:</span>
                        <span className="font-bold text-white">
                          {nodes.find((n) => n.id === activeNode.parent)?.name || activeNode.parent}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Foundational Concept (No prerequisites required)
                      </div>
                    )}
                  </div>

                  {/* Misconception Summary */}
                  {activeNode.mistakeCount > 0 ? (
                    <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                        <AlertTriangle className="h-4 w-4" /> {activeNode.mistakeCount} Misconceptions Logged
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Recorded errors on termination conditions and structural evaluation for this topic.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Zero Misconceptions Logged
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Demonstrated clean accuracy on practice questions for this node.
                      </p>
                    </div>
                  )}

                  {/* Direct Launch Actions */}
                  <div className="pt-2 space-y-2">
                    <Link
                      href={`/learn/${encodeURIComponent(activeNode.name)}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
                    >
                      <Sparkles className="h-4 w-4 fill-black" /> Launch AI Video & Tutor Workspace
                    </Link>

                    <Link
                      href="/practice"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <Code2 className="h-3.5 w-3.5 text-cyan-400" /> Practice in VS Code IDE
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 text-center text-slate-400">
                Select a concept node to inspect details.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
