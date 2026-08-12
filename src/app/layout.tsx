import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { Analytics } from '@/components/Analytics';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';
import { JsonLd } from '@/components/JsonLd';
import { cinzel, crimsonPro } from '@/lib/fonts';
import { websiteJsonLd } from '@/lib/seo';
import { siteConfig, SITE_URL } from '@/lib/site';

const GA_MEASUREMENT_ID = 'G-H0BCJDZ2H9';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // SERP-length homepage title (52 chars; the full subtitle truncates at ~60
    // and lives in the H1 and Book JSON-LD instead).
    default: `${siteConfig.name}: A Book by ${siteConfig.author.name}`,
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
  // Favicon + Apple touch icon: the author-supplied 500x500 mark.
  icons: {
    icon: '/assets/favicon.png',
    apple: '/assets/favicon.png',
  },
  alternates: {
    canonical: SITE_URL,
    types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
  },
};

export const viewport: Viewport = {
  themeColor: '#05070d',
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
        {/* Google Analytics (gtag.js), loads only after analytics consent */}
        <Analytics measurementId={GA_MEASUREMENT_ID} />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
