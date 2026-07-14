/**
 * Fallback content used when Sanity is not yet configured or is empty.
 * Once Sanity is populated, live CMS data takes precedence (see src/lib/data.ts).
 *
 * NOTE: these blog posts are PLACEHOLDERS with original teaser copy — deliberately
 * NOT the book's verbatim Keys, so the site never gives the manuscript away. The real
 * posts are authored in Sanity Studio (/studio); once published they replace these.
 */
import type { AuthorInfo, Post, SiteSettings, Video } from './types';

export const seedPosts: Post[] = [
  {
    _id: 'seed-placeholder-cracks-in-the-world',
    title: 'Cracks in the World',
    slug: 'cracks-in-the-world',
    cycle: 'cycle1',
    excerpt:
      'The first layer of awakening begins with a question — what if the surface of things was never the whole story? An introduction to Cycle I.',
    coverImage: '/assets/new-map.png',
    featured: true,
    publishedAt: '2026-01-06',
    verse: `Some Keys make you doubt the surface.
They are the first cracks in the world —
the moment the familiar stops explaining itself.

This is a placeholder post. The Keys of Cycle I live in the book.`,
    seo: {
      metaTitle: 'Cracks in the World — Keys Left Behind',
      metaDescription:
        'An introduction to Cycle I of The Matrix is a Documentary — the first cracks in the world.',
    },
  },
  {
    _id: 'seed-placeholder-hidden-histories',
    title: 'Hidden Histories',
    slug: 'hidden-histories',
    cycle: 'cycle2',
    excerpt:
      'What if the past is not a long chain, but a story edited in silence? A glimpse into Cycle II — the histories we were never told.',
    coverImage: '/assets/eterno-speaks.png',
    publishedAt: '2026-01-05',
    verse: `Beneath the history we were handed
lie the histories that were buried.
Cycle II asks what was edited out — and why.

This is a placeholder post. The Keys of Cycle II live in the book.`,
  },
  {
    _id: 'seed-placeholder-the-inner-cages',
    title: 'The Inner Cages',
    slug: 'the-inner-cages',
    cycle: 'cycle3',
    excerpt:
      'The deepest cages are the ones we cannot see — the beliefs we mistake for ourselves. A glimpse into Cycle III.',
    coverImage: '/assets/playground.png',
    publishedAt: '2026-01-04',
    verse: `The last cages are not made of walls.
They are made of the stories we never thought to question.
Cycle III turns the Keys inward.

This is a placeholder post. The Keys of Cycle III live in the book.`,
  },
];

export const seedVideos: Video[] = [
  {
    _id: 'seed-video-predictive-screen',
    title: 'The Predictive Screen — not prophecy, but programming',
    youtubeId: '',
    cycle: 'cycle1',
    featured: true,
    publishedAt: '2026-01-06',
  },
  {
    _id: 'seed-video-timekeepers',
    title: 'The Timekeepers — time itself is the Matrix',
    youtubeId: '',
    cycle: 'cycle2',
    publishedAt: '2026-01-05',
  },
  {
    _id: 'seed-video-language-trap',
    title: 'The Language Trap — which words are speaking you?',
    youtubeId: '',
    cycle: 'cycle3',
    publishedAt: '2026-01-04',
  },
  {
    _id: 'seed-video-schools',
    title: 'The Schools of Forgetting',
    youtubeId: '',
    cycle: 'cycle3',
    publishedAt: '2026-01-03',
  },
  {
    _id: 'seed-video-ritual-moon',
    title: 'The Ritual of the Moon',
    youtubeId: '',
    cycle: 'cycle1',
    publishedAt: '2026-01-02',
  },
  {
    _id: 'seed-video-volunteers',
    title: 'The Volunteers — trap, or mission?',
    youtubeId: '',
    cycle: 'cycle3',
    publishedAt: '2026-01-01',
  },
  {
    _id: 'seed-video-key-of-love',
    title: 'The Key of Love — the one they could not take',
    youtubeId: '',
    cycle: 'lastKey',
    publishedAt: '2025-12-31',
  },
];

export const seedAuthor: AuthorInfo = {
  name: 'Jack Amorino',
  bio: [
    'Jack Amorino is not just a name, but a mirror. His journey through Aya’s visions and the Keys reflects the path many walk in silence: questioning, remembering, awakening.',
    'This book is both story and offering — a map for those who feel the cage, who sense there is more, and who long to remember the only true Key: Love.',
  ],
  quote: 'Love is the Key.\nAll others unlock doors,\nbut this one unlocks you.',
};

export const seedSettings: SiteSettings = {
  // Client launches with videos OFF until the first videos are published.
  // Set to true locally to preview the full experience; Sanity controls it in production.
  showVideos: true,
  signupHeadline: 'Read the beginning free',
  signupBlurb:
    "Get the Prologue and Chapter One — Love's Whisper — in your inbox, plus new Keys as they're left behind.",
};
