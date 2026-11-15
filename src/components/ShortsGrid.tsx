'use client';

import { useState } from 'react';

import { LiteYouTube } from '@/components/LiteYouTube';
import type { YouTubeShort } from '@/lib/youtube';

/** Divides evenly into the 2, 3 and 6 column layouts of .grid-shorts. */
const PAGE_SIZE = 18;

/**
 * The full Shorts list, revealed a page at a time so the grid stays light as the
 * channel grows. Every Short is still server rendered into the JSON-LD.
 */
export function ShortsGrid({ shorts }: { shorts: YouTubeShort[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = shorts.slice(0, visible);
  const remaining = shorts.length - shown.length;

  return (
    <>
      <div className="grid-shorts">
        {shown.map((short) => (
          <div className="video-card" key={short.id}>
            <LiteYouTube id={short.id} title={short.title} short />
            <div className="video-card__body">
              <div className="video-card__title">{short.title}</div>
            </div>
          </div>
        ))}
      </div>
      {remaining > 0 && (
        <div className="btn-row btn-row--center mt-lg">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            LOAD MORE SHORTS ({remaining})
          </button>
        </div>
      )}
    </>
  );
}
