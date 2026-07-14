'use client';

import { useMemo, useState } from 'react';

import { cycles } from '@/lib/site';
import type { Post } from '@/lib/types';

import { PostCard } from './PostCard';

const FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'cycle1', label: cycles.cycle1 },
  { key: 'cycle2', label: cycles.cycle2 },
  { key: 'cycle3', label: cycles.cycle3 },
];

/** Category pills that filter the post grid by cycle (client-side, no reload). */
export function BlogFilter({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState('all');

  const visible = useMemo(
    () => (active === 'all' ? posts : posts.filter((p) => p.cycle === active)),
    [active, posts]
  );

  return (
    <>
      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`filter-pill${active === f.key ? ' filter-pill--active' : ''}`}
            aria-pressed={active === f.key}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div
        className="grid-fill"
        style={{ padding: 'clamp(32px,5vw,56px) clamp(20px,6vw,100px) clamp(48px,7vw,80px)' }}
      >
        {visible.map((post) => (
          <PostCard key={post._id} post={post} showExcerpt imageHeight={190} />
        ))}
      </div>
    </>
  );
}
