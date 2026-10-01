import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Star, Eye } from 'lucide-react';
import type { EducationalVideo } from '../../utils/videoSearchApi';

interface EducationalVideoGridProps {
  videos: EducationalVideo[];
  onSelectVideo: (video: EducationalVideo) => void;
  selectedVideoId?: string;
}

export default function EducationalVideoGrid({
  videos,
  onSelectVideo,
  selectedVideoId,
}: EducationalVideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-textMid">
        Loading educational videos for your topic...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-textHigh">🎥 Curated Educational Videos</h3>
        <span className="text-xs uppercase tracking-widest text-accent2">YouTube-Style Results</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const isSelected = selectedVideoId === video.id;
          return (
            <motion.div
              key={video.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectVideo(video)}
              className={`group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'border-accent2 bg-accent2/10 shadow-lg shadow-accent2/20'
                  : 'border-white/10 bg-[#0C1528] hover:border-white/30'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent2 text-black shadow-lg">
                    <Play className="h-6 w-6 fill-black pl-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-md">
                  <Clock className="h-3 w-3" />
                  <span>{video.duration}</span>
                </div>

                {/* Difficulty Tag */}
                <div className="absolute top-2 left-2 rounded-md bg-[#0B1221]/90 px-2 py-0.5 text-xs font-semibold text-accent2 border border-accent2/30 backdrop-blur-md">
                  {video.difficulty}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h4 className="line-clamp-2 text-sm font-semibold text-textHigh group-hover:text-accent2 transition-colors">
                  {video.title}
                </h4>
                <p className="mt-1 text-xs text-textMid">{video.channelName}</p>

                <div className="mt-3 flex items-center justify-between text-xs text-textMid border-t border-white/5 pt-2">
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
          );
        })}
      </div>
    </div>
  );
}
