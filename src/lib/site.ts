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
    "Jack Amorino's journey of awakening and remembering — from the classrooms that taught forgetting, through the ceremonies of Iquitos, to the Keys left behind for those ready to feel the coin in their hand.",
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

export const navLinks = [
  { href: '/the-book', label: 'The Book' },
  { href: '/the-author', label: 'The Author' },
  { href: '/blog', label: 'Blog' },
  { href: '/videos', label: 'Videos' },
] as const;

/** Cycle taxonomy — matches the Sanity `cycle` enum and the manuscript's structure. */
export const cycles = {
  cycle1: 'Cycle I · Cracks in the World',
  cycle2: 'Cycle II · Hidden Histories',
  cycle3: 'Cycle III · The Inner Cages',
  lastKey: 'The Last Key',
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
