'use client';

import { useState } from 'react';

import { buyLinks } from '@/lib/site';

interface LiteYouTubeProps {
  id: string;
  title: string;
  large?: boolean;
  /** Render vertical (9:16) for YouTube Shorts. */
  short?: boolean;
}

/**
 * Click-to-load YouTube facade: renders the thumbnail (cheap) and only mounts the
 * iframe on interaction, keeping full iframes off the initial paint. When no id is
 * set yet (pre-launch), links out to the channel instead.
 */
export function LiteYouTube({ id, title, large = false, short = false }: LiteYouTubeProps) {
  const [playing, setPlaying] = useState(false);
  const thumbClass = `video-thumb${short ? ' video-thumb--short' : ''}`;

  if (!id) {
    return (
      <a
        href={buyLinks.youtube}
        target="_blank"
        rel="noopener noreferrer"
        className={thumbClass}
        aria-label={`${title}, watch on YouTube`}
      >
        <span className={`video-thumb__play${large ? ' video-thumb__play--lg' : ''}`}>▶</span>
      </a>
    );
  }

  if (playing) {
    return (
      <div className={thumbClass}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={thumbClass}
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${title}`}
      style={{ border: 0, cursor: 'pointer', padding: 0, width: '100%' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
      />
      <span className={`video-thumb__play${large ? ' video-thumb__play--lg' : ''}`}>▶</span>
    </button>
  );
}
