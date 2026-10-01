import React from 'react';
import type { EducationalVideo } from '../../utils/videoSearchApi';

interface EmbeddedVideoPlayerProps {
  video: EducationalVideo;
}

export default function EmbeddedVideoPlayer({ video }: EmbeddedVideoPlayerProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&modestbranding=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-textHigh">{video.title}</h3>
          <p className="mt-1 text-sm text-textMid">{video.channelName} • {video.views}</p>
        </div>
        <span className="rounded-full border border-accent2/40 bg-accent2/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent2">
          {video.difficulty} Mode
        </span>
      </div>
    </div>
  );
}
