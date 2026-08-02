/**
 * Central site configuration. Values here drive metadata, JSON-LD, nav and footer.
 * Buy links are read from env (with sensible fallbacks) so they can change without a deploy.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://thematrixisadocumentary.com'
).replace(/\/$/, '');

export const siteConfig = {
  name: 'The Matrix is a Documentary',
  wordmark: 'THE MATRIX IS A DOCUMENTARY',
  title: 'The Matrix is a Documentary',
  subtitle:
    'A Journey of Awakening, Remembering, and the Key That Frees the Soul',
  description:
    "Jack Amorino's journey of awakening and remembering, from the classrooms that taught forgetting, through the ceremonies of Iquitos, to the Keys left behind for those ready to feel the coin in their hand.",
  author: {
    name: 'Jack Amorino',
    email: 'jack.amorino@thematrixisadocumentary.com',
  },
  url: SITE_URL,
  copyright: 'JACK AMORINO © 2026',
  // Book identifiers for JSON-LD (fill ISBN when available)
  book: {
    isbn: '',
    bookFormat: ['Paperback', 'Hardcover', 'EBook'],
    inLanguage: 'en',
  },
} as const;

export const buyLinks = {
  amazon:
    process.env.NEXT_PUBLIC_AMAZON_URL || 'https://www.amazon.com/dp/B0GT4B3R2S',
  apple:
    process.env.NEXT_PUBLIC_APPLE_BOOKS_URL ||
    'https://books.apple.com/us/book/the-matrix-is-a-documentary/id6761010093',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://www.youtube.com/@DecodeTheReal',
} as const;

/**
 * Master switch for the whole video / Decode The Real section (nav item, footer
 * YouTube link, homepage band, author cross-promo, /videos route, sitemap + JSON-LD).
 * Build-time so it reaches client components (Nav) and next.config. Flip
 * NEXT_PUBLIC_SHOW_VIDEOS=true in the env (and redeploy) to turn everything on.
 */
export const videosEnabled = process.env.NEXT_PUBLIC_SHOW_VIDEOS === 'true';

export const navLinks: { href: string; label: string }[] = [
  { href: '/the-book', label: 'The Book' },
  { href: '/the-author', label: 'The Author' },
  { href: '/blog', label: 'Blog' },
  ...(videosEnabled ? [{ href: '/videos', label: 'Videos' }] : []),
];

/**
 * Theme taxonomy — the values still match the Sanity `cycle` enum (cycle1..3), but the
 * public labels are plain theme names: blog readers arriving from search shouldn't need
 * the book's Cycle numbering to understand the categories.
 */
export const cycles = {
  cycle1: 'Cracks in the World',
  cycle2: 'Hidden Histories',
  cycle3: 'The Inner Cages',
  lastKey: 'The Key of Love',
} as const;

export type CycleKey = keyof typeof cycles;

export function cycleLabel(cycle?: string | null): string {
  if (!cycle) return '';
  return (cycles as Record<string, string>)[cycle] ?? cycle;
}

/**
 * Append UTM params to a buy/outbound link so Amazon vs Apple performance is comparable
 * in analytics. Leaves non-http links untouched.
 */
export function withUtm(
  url: string,
  source: string,
  medium = 'website',
  campaign = 'book-sales'
): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', source);
    u.searchParams.set('utm_medium', medium);
    u.searchParams.set('utm_campaign', campaign);
    return u.toString();
  } catch {
    return url;
  }
}
