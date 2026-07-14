import { Cinzel, Crimson_Pro } from 'next/font/google';

/**
 * Display / headings / wordmark / buttons. Cinzel 400–700.
 * Body / quotes. Crimson Pro with italics.
 * next/font self-hosts and subsets these, so no render-blocking Google Fonts request.
 */
export const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
  display: 'swap',
});
