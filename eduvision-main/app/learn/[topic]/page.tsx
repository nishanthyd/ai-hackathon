'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Video,
  Sparkles,
  Layers,
  Send,
  Bot,
  Sliders,
  HelpCircle,
  Lightbulb,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowLeft,
  Clock,
  BookOpen,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ChatMessageContent from '@/components/chat/ChatMessageContent';
import { getTopicVideoDetails } from '@/lib/videoHelper';
import { getTopicSummary } from '@/lib/topicSummary';
import { DEMO_VIDEOS } from '@/data/demoData';
import { processQuizResult, evaluateExplainBack, recordMistake, recordTopicVisit, recordQuizAttempt } from '@/lib/store';
import { DifficultyLevel, QuizQuestion } from '@/types/learnai';

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'user';
  text: string;
}

function MainLearningWorkspaceContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const rawTopic = (params?.topic as string) || 'recursion';
  const cleanTopic = decodeURIComponent(rawTopic).replace(/%20/g, ' ').replace(/-/g, ' ').trim();
  const topicTitle = cleanTopic.replace(/\b\w/g, (l) => l.toUpperCase());
  const topicSummary = getTopicSummary(topicTitle);

  const paramVid = searchParams.get('v');
  const paramTitle = searchParams.get('title');

  const videoInfo = getTopicVideoDetails(topicTitle, paramVid || undefined, paramTitle || undefined);
  const activeTitle = paramTitle ? decodeURIComponent(paramTitle).replace(/%20/g, ' ').trim() : videoInfo.title;
  const activeYoutubeId = videoInfo.youtubeId;

  // Mode & Settings
  const [learningMode, setLearningMode] = useState<'video' | 'manim'>('video');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [socraticMode, setSocraticMode] = useState(false);

  // Manim State
  const [manimVideoUrl, setManimVideoUrl] = useState<string | null>(null);
  const [isManimLoading, setIsManimLoading] = useState<boolean>(false);
  const [manimStage, setManimStage] = useState<string>('Initializing Manim generator...');
  const [manimError, setManimError] = useState<string | null>(null);

  const handleGenerateManim = async () => {
    setIsManimLoading(true);
    setManimError(null);
    setManimStage('Planning lesson & visual scenes...');

    try {
      const res = await fetch('/api/manim/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicTitle, difficulty }),
      });
      const data = await res.json();

      if (data.success && data.videoUrl && data.status === 'done') {
        setManimVideoUrl(data.videoUrl);
        setIsManimLoading(false);
        return;
      }

      if (data.success && data.jobId) {
        const jobId = data.jobId;
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/manim/status/${jobId}`);
            const statusData = await statusRes.json();
            if (statusData.stage) {
              setManimStage(`Stage: ${statusData.stage} (${Math.round((statusData.stageProgress || 0) * 100)}%)`);
            }
            if (statusData.status === 'done' && statusData.videoUrl) {
              clearInterval(pollInterval);
              setManimVideoUrl(statusData.videoUrl);
              setIsManimLoading(false);
            } else if (statusData.status === 'error') {
              clearInterval(pollInterval);
              setManimError(statusData.error || 'Failed to render Manim video.');
              setManimVideoUrl('https://vjs.zencdn.net/v/oceans.mp4');
              setIsManimLoading(false);
            }
          } catch (e) {
            clearInterval(pollInterval);
            setIsManimLoading(false);
          }
        }, 2000);
      } else {
        setManimError('Could not launch Manim pipeline.');
        setIsManimLoading(false);
      }
    } catch (err: any) {
      setManimError(err.message || 'Error connecting to Manim service.');
      setIsManimLoading(false);
    }
  };

  useEffect(() => {
    if (learningMode === 'manim' && !manimVideoUrl && !isManimLoading) {
      handleGenerateManim();
    }
  }, [learningMode]);

  // Dynamic Transcript for active topic
  const dynamicTranscript = [
    { timestamp: '00:00', seconds: 0, text: `Welcome to this deep dive into ${activeTitle}.` },
    { timestamp: '01:15', seconds: 75, text: `First, let's understand the core problem ${topicTitle} solves.` },
    { timestamp: '03:40', seconds: 220, text: `Notice how ${topicTitle} operates under the hood with key operations.` },
    { timestamp: '06:10', seconds: 370, text: `Here is the critical condition that governs execution safety.` },
    { timestamp: '08:45', seconds: 525, text: `If this base condition is missing, you trigger memory errors or infinite loops.` },
    { timestamp: '10:30', seconds: 630, text: `Once completed, execution unwinds and returns final values.` },
  ];

  const [currentTimestamp, setCurrentTimestamp] = useState('03:40');
  const [transcriptFilter, setTranscriptFilter] = useState('');

  // AI Tutor Chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'tutor',
      text: `👋 Hey! I'm your AI Tutor. I'm following along with your lesson on **${topicTitle}**. Ask me any question, or tap an action below to get started!`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Explain-Back Mode
  const [isExplainBackOpen, setIsExplainBackOpen] = useState(false);
  const [userExplanationText, setUserExplanationText] = useState('');
  const [explainResult, setExplainResult] = useState<any>(null);

  // Quiz State
  const [quizRoundIndex, setQuizRoundIndex] = useState(0);
  const [askedQuestionIds, setAskedQuestionIds] = useState<string[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [confidenceRating, setConfidenceRating] = useState<number>(4);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  const loadQuizQuestions = (roundIdx: number, excludeIds: string[]) => {
    fetch('/api/ai/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topicTitle, roundIndex: roundIdx, excludeIds }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.questions)) {
          setQuizQuestions(data.questions);
          const newIds = data.questions.map((q: QuizQuestion) => q.id);
          setAskedQuestionIds((prev) => Array.from(new Set([...prev, ...newIds])));
        }
      });
  };

  useEffect(() => {
    recordTopicVisit(topicTitle);
    setQuizRoundIndex(0);
    setAskedQuestionIds([]);
    setCurrentQIndex(0);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    loadQuizQuestions(0, []);
  }, [topicTitle, difficulty]);

  const chatEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendChat = async (overridePrompt?: string, action?: string) => {
    const textToSend = overridePrompt || inputText;
    if (!textToSend.trim() || isTyping) return;

    if (!overridePrompt) setInputText('');

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    const storedApiKey = typeof window !== 'undefined' ? localStorage.getItem('GROQ_API_KEY') || '' : '';

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicTitle,
          prompt: textToSend,
          action: action || 'chat',
          timestamp: currentTimestamp,
          socraticMode,
          difficulty,
          apiKey: storedApiKey,
          messages: updatedMessages,
        }),
      });
      const data = await res.json();
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'tutor', text: data.reply || 'I am here to help you learn!' },
      ]);
    } catch (err) {
      setIsTyping(false);
    }
  };

  const handleEvaluateExplainBack = () => {
    if (!userExplanationText.trim()) return;
    const res = evaluateExplainBack(topicTitle, userExplanationText);
    setExplainResult(res);
  };

  const handleSelectQuizAnswer = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < quizQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  const handleFinishQuiz = () => {
    let score = 0;
    const reviewDetails: Array<{
      question: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
      isCorrect: boolean;
    }> = [];

    quizQuestions.forEach((q) => {
      const uAns = userAnswers[q.id] || 'No answer selected';
      const isCorrect = uAns === q.correctAnswer;
      if (isCorrect) {
        score++;
      } else {
        recordMistake('recursion', topicTitle, q.concept, q.question, uAns, q.correctAnswer, q.explanation);
      }

      reviewDetails.push({
        question: q.question,
        userAnswer: uAns,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect,
      });
    });

    const res = processQuizResult('recursion', topicTitle, 'Python', score, quizQuestions.length, confidenceRating);
    recordQuizAttempt(score, quizQuestions.length);
    setQuizResult({
      score,
      total: quizQuestions.length,
      reviewDetails,
      ...res,
    });
    setQuizSubmitted(true);
  };

  const handleNextRound = () => {
    const nextRound = quizRoundIndex + 1;
    setQuizRoundIndex(nextRound);
    setCurrentQIndex(0);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    loadQuizQuestions(nextRound, askedQuestionIds);
  };

  const handleRetakeMissed = () => {
    if (!quizResult?.reviewDetails) return;
    const missedQuestions = quizQuestions.filter((q) => userAnswers[q.id] !== q.correctAnswer);
    if (missedQuestions.length > 0) {
      setQuizQuestions(missedQuestions);
      setCurrentQIndex(0);
      setUserAnswers({});
      setQuizSubmitted(false);
      setQuizResult(null);
    } else {
      handleNextRound();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f17] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Navigation & Choice Bar (Prompt Point 20) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#0f172a] p-4 sm:p-5 shadow-xl">
            <div className="flex items-center gap-3">
              <Link href="/learn" className="rounded-xl bg-white/5 p-2 text-slate-400 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">3-Part Learning Workspace</span>
                <h1 className="text-xl font-bold text-white sm:text-2xl">{topicTitle}</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* HOW DO YOU WANT TO LEARN? Choice Selector */}
              <div className="flex items-center gap-1 rounded-2xl bg-black/50 p-1 border border-white/10">
                <button
                  onClick={() => setLearningMode('video')}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    learningMode === 'video' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="h-4 w-4" />
                  <span>🎥 Watch Video</span>
                </button>

                <button
                  onClick={() => setLearningMode('manim')}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    learningMode === 'manim' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>✨ Manim Animation</span>
                </button>
              </div>

              {/* Difficulty Level Settings Selector */}
              <div className="flex items-center gap-1 rounded-2xl bg-black/50 p-1 border border-white/10">
                {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      difficulty === lvl ? 'bg-white/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Socratic Mode Toggle (Prompt Point 18) */}
              <button
                onClick={() => setSocraticMode(!socraticMode)}
                className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-bold transition-all ${
                  socraticMode
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="h-4 w-4 text-purple-400" />
                <span>{socraticMode ? '🧑‍🏫 Socratic Tutor' : '🎯 Direct Tutor'}</span>
              </button>
            </div>
          </div>

          {/* MAIN 3-PART WORKSPACE (Desktop: Left Video/Manim, Right AI Tutor, Bottom Practice) */}
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            {/* LEFT / CENTER PANE: Player & Searchable Transcript */}
            <div className="space-y-6">
              {learningMode === 'video' ? (
                <div className="space-y-4">
                  {/* Embedded YouTube Player */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${activeYoutubeId}?autoplay=0&modestbranding=1`}
                      title={activeTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  </div>

                  {/* Searchable Transcript Panel (Prompt Point 12) */}
                  <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-cyan-400" />
                        <span>Interactive Searchable Transcript</span>
                      </h3>
                      <input
                        type="text"
                        value={transcriptFilter}
                        onChange={(e) => setTranscriptFilter(e.target.value)}
                        placeholder="Search transcript..."
                        className="rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white placeholder-slate-400 focus:outline-none"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2 text-xs">
                      {dynamicTranscript
                        .filter((t) => t.text.toLowerCase().includes(transcriptFilter.toLowerCase()))
                        .map((t, idx) => {
                          const isCurrent = t.timestamp === currentTimestamp;
                          return (
                            <div
                              key={idx}
                              onClick={() => setCurrentTimestamp(t.timestamp)}
                              className={`flex items-start gap-3 rounded-xl p-2.5 cursor-pointer transition-all ${
                                isCurrent
                                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                                  : 'hover:bg-white/5 text-slate-300'
                              }`}
                            >
                              <span className="font-mono text-[11px] text-cyan-400 shrink-0">{t.timestamp}</span>
                              <p className="flex-1">{t.text}</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendChat(`Explain what the video means at ${t.timestamp}: "${t.text}"`);
                                }}
                                className="text-[10px] text-cyan-400 hover:underline shrink-0"
                              >
                                Ask AI →
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Manim Visual Animation Player */
                <div className="space-y-4">
                  {isManimLoading ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#0a0f1d] shadow-2xl flex flex-col items-center justify-center p-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-spin text-3xl mb-4">
                        <Sparkles className="h-8 w-8 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Generating Manim Visual Animation</h3>
                      <p className="text-xs text-cyan-400 max-w-md mt-2 font-mono">{manimStage}</p>
                      <p className="text-[11px] text-slate-400 max-w-sm mt-3">
                        Synthesizing Python script, generating narration, and compiling vector graphics...
                      </p>
                    </div>
                  ) : manimVideoUrl ? (
                    <div className="space-y-3">
                      <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-cyan-500/40 bg-black shadow-2xl">
                        <video
                          src={manimVideoUrl}
                          controls
                          autoPlay
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-[#0f172a] border border-white/10 p-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-semibold text-white">AI-Generated Vector Animation ({topicTitle})</span>
                        </div>
                        <button
                          onClick={handleGenerateManim}
                          disabled={isManimLoading}
                          className="flex items-center gap-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-3 py-1.5 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/30 transition-all disabled:opacity-50"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Regenerate Animation</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#0a0f1d] shadow-2xl flex flex-col items-center justify-center p-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-3xl mb-4">
                        ✨
                      </div>
                      <h3 className="text-lg font-bold text-white">Manim Visual Animation</h3>
                      <p className="text-xs text-slate-400 max-w-md mt-1">
                        Generate custom, step-by-step vector graphics and voiceover for {topicTitle}.
                      </p>
                      <button
                        onClick={handleGenerateManim}
                        className="mt-5 flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 transition-all"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Generate AI Animation</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT PANE: VIDEO-AWARE AI TUTOR & ACTION CHIPS (Prompt Point 11) */}
            <div className="flex flex-col h-[640px] rounded-3xl border border-white/10 bg-[#0f172a] p-5 shadow-2xl relative">
              {/* Tutor Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Video-Aware AI Tutor</h3>
                    <p className="text-[11px] text-cyan-400">Context: {currentTimestamp} • {difficulty}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExplainBackOpen(!isExplainBackOpen)}
                  className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[11px] font-bold text-purple-300 hover:bg-purple-500/20"
                >
                  Teach Back
                </button>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs pr-1">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[92%] rounded-2xl px-4 py-3 leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-cyan-500 text-black font-semibold rounded-tr-none text-xs'
                          : 'bg-slate-900/90 text-slate-100 border border-white/10 rounded-tl-none text-xs shadow-lg'
                      }`}
                    >
                      {m.sender === 'user' ? (
                        <span>{m.text}</span>
                      ) : (
                        <ChatMessageContent content={m.text} />
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                    <span>AI Tutor is thinking...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Action Chips */}
              <div className="border-t border-white/10 pt-3 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSendChat('Explain simpler', 'simplify')}
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/20"
                  >
                    Simplify
                  </button>
                  <button
                    onClick={() => handleSendChat('Give real world example', 'example')}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20"
                  >
                    Example
                  </button>
                  <button
                    onClick={() => handleSendChat('Show visually', 'visual')}
                    className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/20"
                  >
                    Flowchart
                  </button>
                  <button
                    onClick={() => handleSendChat('Quiz me', 'quiz')}
                    className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[11px] font-bold text-purple-300 hover:bg-purple-500/20"
                  >
                    Quiz Me
                  </button>
                </div>

                {/* Input Field */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="Ask AI about this exact moment in video..."
                    className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendChat()}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-black hover:bg-cyan-400"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* EXPLAIN-BACK MODE PANEL (Prompt Point 17) */}
          {isExplainBackOpen && (
            <div className="rounded-3xl border border-purple-500/30 bg-purple-950/20 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-400" />
                  <span>Explain-Back Mode: "Teach it back to me"</span>
                </h3>
                <button onClick={() => setIsExplainBackOpen(false)} className="text-xs text-slate-400 hover:text-white">
                  Close
                </button>
              </div>
              <p className="text-xs text-slate-300">
                Explain <strong>{topicTitle}</strong> in your own words below. The AI will evaluate your conceptual accuracy and detect missing ideas.
              </p>
              <textarea
                rows={3}
                value={userExplanationText}
                onChange={(e) => setUserExplanationText(e.target.value)}
                placeholder="Type your explanation here (e.g., Recursion is when a function calls itself until a base case returns...)"
                className="w-full rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleEvaluateExplainBack}
                  className="rounded-xl bg-purple-500 px-5 py-2 text-xs font-bold text-black hover:bg-purple-400"
                >
                  Evaluate My Explanation
                </button>
              </div>

              {explainResult && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>Conceptual Understanding:</span>
                    <span className="text-purple-300">{explainResult.understandingPct}%</span>
                  </div>
                  <p className="text-slate-300">{explainResult.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* BOTTOM PANE: AI SUMMARY & ADAPTIVE QUIZ (Prompt Points 13, 14, 16) */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Structured AI Summary */}
            <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                <span>Structured AI Lesson Summary ({topicTitle})</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="rounded-2xl bg-white/5 p-3.5">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">Key Idea</span>
                  <p className="mt-1 text-slate-200 leading-relaxed">
                    {topicSummary.keyIdea}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 p-3.5">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">What To Remember</span>
                  <p className="mt-1 text-slate-200">{topicSummary.whatToRemember}</p>
                </div>
              </div>
            </div>

            {/* Adaptive Quiz */}
            <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-400" />
                  <span>Adaptive Quiz (Round {quizRoundIndex + 1})</span>
                </h3>
                <span className="text-xs text-purple-300 font-semibold">{difficulty} Level</span>
              </div>

              {!quizSubmitted && quizQuestions.length > 0 && currentQIndex < quizQuestions.length && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
                    <span>Question {currentQIndex + 1} of {quizQuestions.length}</span>
                    <span>Topic: {topicTitle}</span>
                  </div>

                  <p className="font-semibold text-white text-sm leading-snug">
                    Q{currentQIndex + 1}: {quizQuestions[currentQIndex].question}
                  </p>

                  <div className="space-y-2">
                    {quizQuestions[currentQIndex].options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectQuizAnswer(quizQuestions[currentQIndex].id, opt)}
                        className={`w-full rounded-xl border p-3 text-left transition-all ${
                          userAnswers[quizQuestions[currentQIndex].id] === opt
                            ? 'border-purple-500 bg-purple-500/20 text-purple-200 font-bold shadow-lg'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* Confidence Rating Slider */}
                  <div className="pt-2">
                    <label className="text-[11px] text-slate-400 font-medium">How confident are you? ({confidenceRating}/5)</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={confidenceRating}
                      onChange={(e) => setConfidenceRating(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    {currentQIndex < quizQuestions.length - 1 ? (
                      <button
                        onClick={handleNextQuestion}
                        disabled={!userAnswers[quizQuestions[currentQIndex].id]}
                        className={`rounded-xl px-5 py-2.5 font-bold transition-all ml-auto ${
                          userAnswers[quizQuestions[currentQIndex].id]
                            ? 'bg-purple-500 text-black hover:bg-purple-400 cursor-pointer'
                            : 'bg-white/10 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishQuiz}
                        disabled={!userAnswers[quizQuestions[currentQIndex].id]}
                        className={`rounded-xl px-5 py-2.5 font-bold transition-all ml-auto ${
                          userAnswers[quizQuestions[currentQIndex].id]
                            ? 'bg-emerald-400 text-black hover:bg-emerald-300 cursor-pointer shadow-lg'
                            : 'bg-white/10 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Finish & See Results 🎯
                      </button>
                    )}
                  </div>
                </div>
              )}

              {quizSubmitted && quizResult && (
                <div className="space-y-4 text-xs">
                  {/* Summary Score Header */}
                  <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-cyan-300 text-sm">
                        Round {quizRoundIndex + 1} Complete! Score: {quizResult.score} / {quizResult.total} ({Math.round((quizResult.score / quizResult.total) * 100)}%)
                      </h4>
                    </div>
                    <p className="text-slate-200">{quizResult.feedbackMessage}</p>
                    <p className="text-slate-300 italic">{quizResult.confidenceComparison}</p>
                  </div>

                  {/* Question-by-Question Review (Revealed AFTER Finish) */}
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Detailed Answer Review:</h5>
                    {quizResult.reviewDetails?.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-3.5 space-y-1.5 ${
                          item.isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'
                        }`}
                      >
                        <p className="font-semibold text-white">
                          Q{idx + 1}: {item.question}
                        </p>
                        <p className={`font-bold ${item.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          Your Choice: {item.userAnswer} {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </p>
                        {!item.isCorrect && (
                          <p className="text-emerald-400 font-bold">
                            Correct Answer: {item.correctAnswer}
                          </p>
                        )}
                        <p className="text-slate-300 text-[11px] leading-relaxed pt-1 border-t border-white/5">
                          💡 <span className="font-medium text-slate-200">Explanation:</span> {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons for Next Round or Missed Questions */}
                  <div className="flex flex-wrap gap-3 pt-2 justify-end">
                    {quizResult.score < quizResult.total && (
                      <button
                        onClick={handleRetakeMissed}
                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 font-bold text-rose-300 hover:bg-rose-500/20"
                      >
                        Retry Missed Questions ({quizResult.total - quizResult.score})
                      </button>
                    )}
                    <button
                      onClick={handleNextRound}
                      className="rounded-xl bg-purple-500 px-5 py-2 font-bold text-black hover:bg-purple-400 shadow-lg"
                    >
                      Start Next 5 Questions (Round {quizRoundIndex + 2}) →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function MainLearningWorkspace() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen bg-[#0b0f17] text-white items-center justify-center">
          <div className="text-cyan-400 font-bold">Loading learning workspace...</div>
        </div>
      }
    >
      <MainLearningWorkspaceContent />
    </Suspense>
  );
}
