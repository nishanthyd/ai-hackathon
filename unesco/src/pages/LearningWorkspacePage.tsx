import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Video, Sparkles, Layers, Sliders, Play, Clock, Star, Eye } from 'lucide-react';
import EducationalVideoGrid from '../components/learn/EducationalVideoGrid';
import EmbeddedVideoPlayer from '../components/learn/EmbeddedVideoPlayer';
import AiTutorSidebar from '../components/learn/AiTutorSidebar';
import VideoResultPanel from '../components/generate/VideoResultPanel';
import QuizCard, { type QuizBatch } from '../components/generate/QuizCard';
import { searchEducationalVideos, type EducationalVideo } from '../utils/videoSearchApi';
import { updateProfileAfterQuiz, type DifficultyLevel, type LearningMode } from '../utils/learningProfileStore';
import { startGeneration, pollJob, getFullVideoUrl, generateQuiz, type JobStatusResponse } from '../utils/eduvisionApi';
import { motionVariants } from '../utils/animation';

interface LearningWorkspacePageProps {
  initialTopic?: string;
  initialMode?: LearningMode;
  initialDifficulty?: DifficultyLevel;
  reducedMotion?: boolean;
}

export default function LearningWorkspacePage({
  initialTopic = '',
  initialMode = 'both',
  initialDifficulty = 'Beginner',
}: LearningWorkspacePageProps) {
  const [searchQuery, setSearchQuery] = useState(initialTopic);
  const [activeTopic, setActiveTopic] = useState(initialTopic);
  const [mode, setMode] = useState<LearningMode>(initialMode);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);

  // Active view: 'feed' (showing YouTube suggestions grid) vs 'player' (active video selected)
  const [viewState, setViewState] = useState<'feed' | 'player'>(initialTopic ? 'player' : 'feed');
  const [activeTab, setActiveTab] = useState<'video' | 'manim'>('video');

  // Video state
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<EducationalVideo | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Manim state
  const [manimResult, setManimResult] = useState<{ title: string; videoUrl: string; duration: string } | null>(null);
  const [isGeneratingManim, setIsGeneratingManim] = useState(false);
  const [manimError, setManimError] = useState<string | null>(null);

  // Quiz state
  const [quizBatches, setQuizBatches] = useState<QuizBatch[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Perform video search whenever topic or difficulty changes
  useEffect(() => {
    const topicToSearch = activeTopic.trim() || 'Python Programming';
    setIsSearching(true);
    searchEducationalVideos(topicToSearch, difficulty).then((res) => {
      setVideos(res);
      setIsSearching(false);
    });
  }, [activeTopic, difficulty]);

  // Handle Search Submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveTopic(searchQuery.trim());
    setSelectedVideo(null);
    setViewState('feed');
  };

  // When student clicks a video from the suggestions feed
  const handleSelectVideo = (video: EducationalVideo) => {
    setSelectedVideo(video);
    setViewState('player');
    setActiveTab('video');

    // Trigger Manim generation if in 'manim' or 'both' mode
    if (mode === 'manim' || mode === 'both') {
      handleGenerateManim(video.title);
    }
  };

  const handleGenerateManim = async (customTopic?: string) => {
    const targetTopic = customTopic || activeTopic || 'Educational Lesson';
    setIsGeneratingManim(true);
    setManimError(null);
    setManimResult(null);

    try {
      const { jobId } = await startGeneration({
        topic: targetTopic,
        language: 'English',
        ageGroup: difficulty === 'Beginner' ? 'Simple' : difficulty === 'Advanced' ? 'Detailed' : 'Moderate',
      });

      pollJob(jobId, {
        onUpdate: (job: JobStatusResponse) => {
          if (job.status === 'done') {
            setIsGeneratingManim(false);
            setManimResult({
              title: job.title || `AI Animation: ${targetTopic}`,
              videoUrl: getFullVideoUrl(job.videoUrl),
              duration: `${Math.floor((job.duration || 30) / 60)}:${Math.floor((job.duration || 30) % 60).toString().padStart(2, '0')}`,
            });
          }
        },
        onError: (err) => {
          setIsGeneratingManim(false);
          setManimError(err.message || 'Failed to render AI animation.');
        },
      });
    } catch (err: any) {
      setIsGeneratingManim(false);
      setManimError(err.message || 'Failed to start AI generation.');
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setQuizError(null);
    try {
      const { questions } = await generateQuiz({
        topic: activeTopic || 'General Science',
        language: 'English',
        ageGroup: difficulty,
        count: 5,
      });

      const batchQuestions = questions.map((q, idx) => ({ ...q, id: `w_q${idx}` }));
      setQuizBatches([
        {
          id: 'w-batch-1',
          title: `Concept Check: ${activeTopic || 'Lesson'} (${difficulty} Level)`,
          questions: batchQuestions,
          userAnswers: {},
          isSubmitted: false,
          score: null,
        },
      ]);
    } catch (err: any) {
      setQuizError(err.message || 'Failed to generate quiz.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSubmitBatch = (batchId: string, userAnswers: Record<string, number>) => {
    setQuizBatches((prev) =>
      prev.map((batch) => {
        if (batch.id !== batchId) return batch;
        let correct = 0;
        batch.questions.forEach((q) => {
          if (userAnswers[q.id] === q.correctIndex) correct++;
        });

        // Trigger Adaptive Profile Update
        updateProfileAfterQuiz(activeTopic || 'General Science', 'Python', correct, batch.questions.length);

        return {
          ...batch,
          userAnswers,
          isSubmitted: true,
          score: { correct, total: batch.questions.length },
        };
      })
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={motionVariants.pageTransition}
      className="space-y-8 pb-16"
    >
      {/* Top Search Bar & Controls Header */}
      <section className="pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#0C1528]/95 p-6 backdrop-blur-xl shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type a topic to search (e.g. Recursion, Photosynthesis, Binary Search)..."
                  className="w-full rounded-2xl border border-white/10 bg-black/50 py-3.5 pl-12 pr-28 text-sm text-textHigh placeholder-textMid focus:border-accent2 focus:outline-none"
                />
                <Search className="absolute left-4 top-4 h-4 w-4 text-textMid" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 rounded-xl bg-accent2 px-4 py-1.5 text-xs font-bold text-black hover:opacity-90"
                >
                  Search
                </button>
              </form>

              {/* Difficulty & Mode Settings */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Difficulty Settings */}
                <div className="flex items-center gap-1 rounded-2xl bg-black/40 p-1.5 border border-white/10">
                  <span className="pl-2 text-xs text-textMid flex items-center gap-1 font-semibold">
                    <Sliders className="h-3.5 w-3.5 text-accent2" />
                    <span>Level:</span>
                  </span>
                  {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((lvl) => {
                    const isSel = difficulty === lvl;
                    return (
                      <button
                        key={lvl}
                        onClick={() => setDifficulty(lvl)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          isSel
                            ? 'bg-accent2 text-black shadow-md'
                            : 'text-textMid hover:text-textHigh hover:bg-white/5'
                        }`}
                      >
                        {lvl === 'Beginner' ? '🟢 Beginner' : lvl === 'Intermediate' ? '🟡 Intermediate' : '🔴 Advanced'}
                      </button>
                    );
                  })}
                </div>

                {/* Mode Selector */}
                <div className="flex items-center gap-1 rounded-2xl bg-black/40 p-1.5 border border-white/10">
                  <button
                    onClick={() => setMode('videos')}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      mode === 'videos' ? 'bg-white/15 text-accent2 font-bold' : 'text-textMid hover:text-textHigh'
                    }`}
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Videos</span>
                  </button>

                  <button
                    onClick={() => setMode('manim')}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      mode === 'manim' ? 'bg-white/15 text-accent2 font-bold' : 'text-textMid hover:text-textHigh'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Manim</span>
                  </button>

                  <button
                    onClick={() => setMode('both')}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      mode === 'both' ? 'bg-white/15 text-accent2 font-bold' : 'text-textMid hover:text-textHigh'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Both</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Body */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* VIEW 1: YouTube Suggestions Feed Grid (Initial or Search State) */}
        {viewState === 'feed' || !selectedVideo ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-textHigh">
                  {activeTopic ? `Educational Video Suggestions for "${activeTopic}"` : 'Educational Video Feed'}
                </h2>
                <p className="text-xs text-textMid mt-0.5">
                  Filtered for <span className="font-semibold text-accent2">{difficulty} Level</span> • Select a video to start learning with AI Tutor
                </p>
              </div>
            </div>

            {isSearching ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-textMid">
                Searching YouTube educational videos...
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectVideo(video)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0C1528] transition-all hover:border-accent2/50 hover:shadow-lg"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent2 text-black shadow-lg">
                          <Play className="h-6 w-6 fill-black pl-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-xs font-semibold text-white">
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2 rounded-md bg-[#0B1221]/90 px-2 py-0.5 text-xs font-semibold text-accent2 border border-accent2/30">
                        {difficulty}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold text-textHigh group-hover:text-accent2 transition-colors">
                        {video.title}
                      </h3>
                      <p className="mt-1 text-xs text-textMid">{video.channelName}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-xs text-textMid">
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-3.5 w-3.5 fill-yellow-400" />
                          <span className="font-semibold">{video.rating}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{video.views}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: Active Split-Screen Learning Player (Video + ChatGPT AI Tutor + Quiz) */
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            {/* Left Column: Player & Video Navigation */}
            <div className="space-y-6">
              {/* Back to Feed button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setViewState('feed')}
                  className="text-xs font-semibold text-accent2 hover:underline flex items-center gap-1"
                >
                  ← Back to Video Feed Suggestions
                </button>

                {/* Both Mode Tab Switcher */}
                {mode === 'both' && (
                  <div className="flex items-center gap-2 rounded-2xl bg-black/40 p-1 border border-white/10">
                    <button
                      onClick={() => setActiveTab('video')}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        activeTab === 'video' ? 'bg-white/15 text-accent2 font-bold' : 'text-textMid hover:text-textHigh'
                      }`}
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>🎥 Educational Video</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('manim')}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        activeTab === 'manim' ? 'bg-white/15 text-accent2 font-bold' : 'text-textMid hover:text-textHigh'
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>✨ AI Manim Animation</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Player Stage */}
              {(mode === 'videos' || (mode === 'both' && activeTab === 'video')) && selectedVideo && (
                <EmbeddedVideoPlayer video={selectedVideo} />
              )}

              {(mode === 'manim' || (mode === 'both' && activeTab === 'manim')) && (
                <VideoResultPanel
                  result={
                    manimResult
                      ? {
                          title: manimResult.title,
                          language: 'English',
                          grade: difficulty,
                          duration: manimResult.duration,
                          description: `AI-generated Manim visualization for ${activeTopic} (${difficulty} Level)`,
                          videoUrl: manimResult.videoUrl,
                        }
                      : null
                  }
                  isGenerating={isGeneratingManim}
                  error={manimError}
                  onReset={() => handleGenerateManim()}
                  onGenerateQuiz={handleGenerateQuiz}
                  isGeneratingQuiz={isGeneratingQuiz}
                />
              )}

              {/* Assessment Card */}
              {quizBatches.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-[#0C1528]/95 p-6 backdrop-blur-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-textHigh">Finished watching?</h4>
                    <p className="text-xs text-textMid">Take a 5-question quiz to test understanding & adapt your level.</p>
                  </div>
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={isGeneratingQuiz}
                    className="rounded-2xl bg-accent2 px-5 py-2.5 text-sm font-bold text-black hover:opacity-90"
                  >
                    {isGeneratingQuiz ? 'Generating...' : 'Take Quiz & Adapt Level'}
                  </button>
                </div>
              )}

              {/* Quizzes */}
              {quizBatches.length > 0 && (
                <QuizCard
                  batches={quizBatches}
                  isLoading={isGeneratingQuiz}
                  error={quizError}
                  onSubmitBatch={handleSubmitBatch}
                  onFetchMoreQuestions={() => {}}
                />
              )}
            </div>

            {/* Right Column: Same-Screen ChatGPT AI Tutor */}
            <div className="h-[680px]">
              <AiTutorSidebar
                topic={selectedVideo ? selectedVideo.title : activeTopic || 'Educational Lesson'}
                currentMode={mode}
                difficulty={difficulty}
              />
            </div>
          </div>
        )}
      </section>
    </motion.div>
  );
}
