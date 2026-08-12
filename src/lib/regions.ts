/**
 * Geographic regions for cookie-consent behavior.
 *
 * EU member states + EEA (IS/LI/NO) + UK (GB) + Switzerland (CH) all require
 * opt-in for non-essential cookies under GDPR / UK GDPR / FADP. Everywhere
 * else, the site uses an opt-out default and shows the banner as
 * informational.
 */
export const EU_LIKE_COUNTRIES: ReadonlySet<string> = new Set([
  // EU (27)
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  // EEA (non-EU)
  'IS',
  'LI',
  'NO',
  // UK
  'GB',
  // Switzerland
  'CH',
]);

export type Region = 'eu-like' | 'other';

/**
 * Map an ISO-3166-1 alpha-2 country code (as delivered by
 * `x-vercel-ip-country`) to a consent region.
 *
 * Fail-CLOSED: anything unknown, empty, null, or undefined falls back to
 * `'eu-like'` — the opt-in region — so an EU/UK/CH visitor is never silently
 * tracked when the geo header is missing (dev, proxies, CDN edge cases).
 */
export function regionFromCountry(country: string | null | undefined): Region {
  if (!country) return 'eu-like';
  return EU_LIKE_COUNTRIES.has(country.toUpperCase()) ? 'eu-like' : 'other';
}

/**
 * Client-side region inference from the browser timezone. Used instead of the
 * `x-vercel-ip-country` header because reading headers in the root layout
 * would opt the whole site out of ISR/static generation.
 *
 * Any `Europe/*` timezone plus the EU Atlantic islands maps to `'eu-like'`.
 * This over-includes a few non-GDPR countries (Turkey, Russia, etc.) — that
 * only means they see the opt-in banner, which is the safe direction. Missing
 * or unresolvable timezone also fails closed to `'eu-like'`.
 */
export function regionFromTimeZone(): Region {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return 'eu-like';
    if (
      tz.startsWith('Europe/') ||
      tz === 'Atlantic/Reykjavik' ||
      tz === 'Atlantic/Canary' ||
      tz === 'Atlantic/Madeira' ||
      tz === 'Atlantic/Azores'
    ) {
      return 'eu-like';
    }
    return 'other';
  } catch {
    return 'eu-like';
  }
}
