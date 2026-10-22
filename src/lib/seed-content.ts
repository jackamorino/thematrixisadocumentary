/**
 * Fallback content used when Sanity is not yet configured or is empty.
 * Once Sanity is populated, live CMS data takes precedence (see src/lib/data.ts).
 *
 * NOTE: these three posts are original Cycle-introduction teasers, deliberately NOT the
 * book's verbatim Keys, so the site never gives the manuscript away. They are safe to
 * publish as-is. Real per-Key posts are authored in Sanity Studio (/studio); once
 * published they replace these.
 */
import type { AuthorInfo, Post, SiteSettings, Video } from './types';

export const seedPosts: Post[] = [
  {
    _id: 'seed-intro-cracks-in-the-world',
    title: 'Cracks in the World',
    slug: 'cracks-in-the-world',
    cycle: 'cycle1',
    excerpt:
      'The first layer of awakening begins with a question. What if the surface of things was never the whole story? An introduction to Cycle I.',
    coverImage: '/assets/new-map.png',
    featured: true,
    publishedAt: '2026-01-06',
    verse: `Some Keys begin by making you doubt the surface.
They are the first cracks in the world, the moment the familiar stops explaining itself.

Cycle I gathers the questions that loosen the ground: the parts of science, sky, and story that were quietly edited before they ever reached you.

You will not be told what to believe here. You will be shown the two faces of the coin, and left to feel its weight in your own hand.

The Keys themselves live in the book. This is only the doorway.`,
    seo: {
      metaTitle: 'Cracks in the World: an introduction to Cycle I',
      metaDescription:
        'Cycle I of The Matrix is a Documentary. The first cracks in the world, where the familiar stops explaining itself.',
    },
  },
  {
    _id: 'seed-intro-hidden-histories',
    title: 'Hidden Histories',
    slug: 'hidden-histories',
    cycle: 'cycle2',
    excerpt:
      'What if the past is not a long chain, but a story edited in silence? A glimpse into Cycle II, the histories we were never told.',
    coverImage: '/assets/eterno-speaks.png',
    publishedAt: '2026-01-05',
    verse: `Beneath the history we were handed lie the histories that were buried.

Cycle II asks a quieter, stranger question. What if the past is not a straight line of progress, but a story rewritten more than once, its missing chapters swept away and paved over?

These Keys do not hand you a new dogma to replace the old one. They point at the seams, the anomalies, the places where the official account stops making sense, and they invite you to look for yourself.

The full Keys are in the book. Consider this the first thread.`,
  },
  {
    _id: 'seed-intro-the-inner-cages',
    title: 'The Inner Cages',
    slug: 'the-inner-cages',
    cycle: 'cycle3',
    excerpt:
      'The deepest cages are the ones we cannot see, the beliefs we mistake for ourselves. A glimpse into Cycle III.',
    coverImage: '/assets/playground.png',
    publishedAt: '2026-01-04',
    verse: `The last cages are not made of walls. They are made of the stories we were taught so early that we no longer notice them.

Cycle III turns the Keys inward: toward school, language, screens, and the quiet training that teaches us what to want and what to forget.

This is the most personal Cycle, because the cage it describes is the one you carry. And a cage you can finally see is a cage you can finally open.

The Keys wait in the book. This is where the turning begins.`,
  },
];

// No seed/placeholder videos. Real videos (Shorts especially) are authored in Sanity;
// until then the video section renders a "coming soon" state rather than fake content.
export const seedVideos: Video[] = [];

export const seedAuthor: AuthorInfo = {
  name: 'Jack Amorino',
  bio: [
    'Jack Amorino is not just a name, but a mirror. His journey through Aya’s visions and the Keys reflects the path many walk in silence: questioning, remembering, awakening.',
    'This book is both story and offering — a map for those who feel the cage, who sense there is more, and who long to remember the only true Key: Love.',
  ],
  quote: 'Love is the Key.\nAll others unlock doors,\nbut this one unlocks you.',
};

export const seedSettings: SiteSettings = {
  // Launch default is OFF until the first videos are published. This is also the live
  // fallback when Sanity has no siteSettings doc, so the public site hides videos by
  // default. Flip to true here (or set siteSettings.showVideos in Sanity) to show them.
  showVideos: false,
  signupHeadline: 'Read the beginning free',
  signupBlurb:
    "Get the Prologue and Chapter One, Love's Whisper, in your inbox, plus new Keys as they're left behind.",
};
