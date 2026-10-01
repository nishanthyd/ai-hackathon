import type { VideoResultData } from '../../pages/GenerateVideoPage'
import { Download, Share2, RefreshCw, HelpCircle } from 'lucide-react'

interface VideoResultPanelProps {
  result: VideoResultData | null
  isGenerating: boolean
  error?: string | null
  onReset: () => void
  onGenerateQuiz?: () => void
  isGeneratingQuiz?: boolean
}

export default function VideoResultPanel({
  result,
  isGenerating,
  error,
  onReset,
  onGenerateQuiz,
  isGeneratingQuiz,
}: VideoResultPanelProps) {
  const handleShare = () => {
    if (result?.videoUrl && navigator.clipboard) {
      navigator.clipboard.writeText(result.videoUrl)
      alert('Video link copied to clipboard!')
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0C1528]/95 p-6 shadow-soft backdrop-blur-xl space-y-6">
      {/* 16:9 Video Player Stage */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
        {result?.videoUrl ? (
          <video
            controls
            autoPlay
            src={result.videoUrl}
            className="h-full w-full object-contain bg-black rounded-2xl"
          >
            Your browser does not support the video tag.
          </video>
        ) : isGenerating ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-textMid bg-gradient-to-b from-[#09101F] to-[#040812]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent2/10 text-accent2 border border-accent2/30 animate-pulse text-2xl">
              ✨
            </div>
            <p className="mt-4 text-base font-semibold text-textHigh">Rendering AI Lesson Animation...</p>
            <p className="mt-1 text-xs text-textMid max-w-sm">
              Our AI is planning scenes, generating voice narration, and rendering visual animations.
            </p>
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-rose-300 bg-rose-950/20">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 text-2xl mb-3">
              ⚠️
            </div>
            <p className="text-base font-bold">Generation Failed</p>
            <p className="mt-1 text-xs text-rose-300/80 max-w-md">{error}</p>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-textMid bg-[#08101F]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl text-textMid mb-3">
              🎬
            </div>
            <p className="text-sm font-semibold text-textHigh">No video generated yet</p>
            <p className="mt-1 text-xs text-textMid">Select a topic and click Generate to start rendering.</p>
          </div>
        )}
      </div>

      {/* Result Info & Action Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-4">
        <div>
          <h3 className="text-lg font-bold text-textHigh">
            {result ? result.title : error ? 'Generation Error' : 'AI Visualization Player'}
          </h3>
          <p className="text-xs text-textMid mt-0.5">
            {result?.description || 'AI Manim visual explanation'}
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center gap-2">
          {result?.videoUrl && (
            <a
              href={result.videoUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-textHigh hover:bg-white/10 transition-all"
            >
              <Download className="h-4 w-4 text-accent2" />
              <span>Download</span>
            </a>
          )}

          {result?.videoUrl && (
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-textHigh hover:bg-white/10 transition-all"
            >
              <Share2 className="h-4 w-4 text-accent2" />
              <span>Share</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-textHigh hover:bg-white/10 transition-all"
          >
            <RefreshCw className="h-4 w-4 text-accent2" />
            <span>Regenerate</span>
          </button>
        </div>
      </div>
    </div>
  )
}
