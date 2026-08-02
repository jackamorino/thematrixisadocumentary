import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/site';

/**
 * Web app manifest (served at /manifest.webmanifest, auto-linked by Next). Gives the
 * "Add to Home Screen" experience a proper name, theme color, and icon. Not a full PWA.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name}: ${siteConfig.subtitle}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'browser',
    background_color: '#05070d',
    theme_color: '#05070d',
    icons: [
      {
        src: '/assets/favicon.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
