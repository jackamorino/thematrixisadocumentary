import type { Metadata } from 'next';
import Script from 'next/script';

import { JsonLd } from '@/components/JsonLd';
import { cinzel, crimsonPro } from '@/lib/fonts';
import { websiteJsonLd } from '@/lib/seo';
import { siteConfig, SITE_URL } from '@/lib/site';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name}: ${siteConfig.subtitle}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  keywords: [
    'The Matrix is a Documentary',
    'Jack Amorino',
    'awakening',
    'remembering',
    'Keys Left Behind',
    'Decode The Real',
    'spiritual awakening book',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  // Favicon comes from src/app/icon.svg (small, crisp). Apple touch icon uses the
  // square book art.
  icons: {
    apple: '/assets/book-icon.png',
  },
  alternates: {
    canonical: SITE_URL,
    types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="en" className={`${cinzel.variable} ${crimsonPro.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={websiteJsonLd()} />
        {children}
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.outbound-links.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
