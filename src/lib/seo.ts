import type { Metadata } from 'next';

import { buyLinks, cycleLabel, siteConfig, SITE_URL } from './site';
import type { Post, Video } from './types';

// 1200x630 landscape share card (assets/og-image.png). The portrait book cover
// crops badly in link previews; article pages override with their own cover.
const OG_IMAGE = '/assets/og-image.png';
const OG_ICON = '/assets/book-icon.png';

interface PageMetaInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}

/** Build per-page Metadata with canonical URL, OG + Twitter cards. */
export function pageMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  image = OG_IMAGE,
  type = 'website',
  publishedTime,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  // Share titles truncate around 60 chars on most platforms, so the OG title
  // uses the same short form as the SERP title. The full subtitle lives in the
  // H1 and the Book JSON-LD.
  const fullTitle = title
    ? `${title} · ${siteConfig.name}`
    : `${siteConfig.name}: A Book by ${siteConfig.author.name}`;

  return {
    // Homepage SERP title stays under ~60 chars; the full subtitle truncates
    // in results, so it lives in the OG title, H1, and Book JSON-LD instead.
    title: title || `${siteConfig.name}: A Book by ${siteConfig.author.name}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: [
        image === OG_IMAGE
          ? { url: image, width: 1200, height: 630, alt: siteConfig.name }
          : { url: image, alt: siteConfig.name },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

type JsonLd = Record<string, unknown>;

/** The publishing entity. Used as `publisher` on WebSite, Book, and Articles. */
export function organizationJsonLd(): JsonLd {
  return {
    '@type': 'Organization',
    name: siteConfig.name,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}${OG_IMAGE}`,
      width: 1200,
      height: 630,
    },
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: SITE_URL,
    description: `The official site for ${siteConfig.name} by ${siteConfig.author.name}: a journey of awakening, remembering, and the Keys left behind.`,
    inLanguage: siteConfig.book.inLanguage,
    publisher: organizationJsonLd(),
    author: personJsonLd(),
  };
}

export function personJsonLd(opts: { image?: string } = {}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: `${SITE_URL}/the-author`,
    jobTitle: 'Author',
    description: `Author of ${siteConfig.name}. A journey of awakening, remembering, and the Keys left behind.`,
    knowsAbout: [
      'Spiritual Awakening',
      'Consciousness',
      'Hidden History',
      'Ayahuasca Ceremonies',
    ],
    ...(opts.image ? { image: opts.image } : {}),
    // Phase 3 (E-E-A-T): append Amazon Author Central, Goodreads, and social URLs
    // here as they are created.
    sameAs: [buyLinks.youtube],
    mainEntityOfPage: `${SITE_URL}/the-author`,
  };
}

/** CollectionPage for listing pages like /blog. */
export function collectionPageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    isPartOf: { '@type': 'WebSite', name: siteConfig.name, url: SITE_URL },
  };
}

export function bookJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: `${siteConfig.name}: ${siteConfig.subtitle}`,
    alternateName: `${siteConfig.name}: A Book by ${siteConfig.author.name}`,
    url: `${SITE_URL}/the-book`,
    image: `${SITE_URL}/blog-images/the-matrix-is-a-documentary-cover-web.png`,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: `${SITE_URL}/the-author`,
    },
    inLanguage: siteConfig.book.inLanguage,
    ...(siteConfig.book.isbn ? { isbn: siteConfig.book.isbn } : {}),
    bookFormat: [
      'https://schema.org/Paperback',
      'https://schema.org/Hardcover',
      'https://schema.org/EBook',
    ],
    genre: ['Spirituality', 'Awakening', 'Memoir', 'Philosophy'],
    about: [
      { '@type': 'Thing', name: 'Spiritual Awakening' },
      { '@type': 'Thing', name: 'Consciousness' },
      { '@type': 'Thing', name: 'Ayahuasca' },
      { '@type': 'Thing', name: 'Hidden History' },
    ],
    datePublished: '2026',
    publisher: organizationJsonLd(),
    abstract: siteConfig.description,
    offers: [
      {
        '@type': 'Offer',
        url: buyLinks.amazon,
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: 'Amazon' },
      },
      {
        '@type': 'Offer',
        url: buyLinks.apple,
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: 'Apple Books' },
      },
    ],
  };
}

export function articleJsonLd(post: Post): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    articleSection: cycleLabel(post.cycle),
    url: `${SITE_URL}/blog/${post.slug}`,
    ...(post.coverImage
      ? {
          image: post.coverImage.startsWith('http')
            ? post.coverImage
            : `${SITE_URL}${post.coverImage}`,
        }
      : {}),
    datePublished: post.publishedAt,
    dateModified: post._updatedAt ?? post.publishedAt,
    author: { '@type': 'Person', name: siteConfig.author.name },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}${OG_ICON}` },
    },
    isPartOf: bookJsonLd(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  };
}

export function videoJsonLd(video: Video): JsonLd | null {
  if (!video.youtubeId) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.title,
    thumbnailUrl: [
      `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`,
    ],
    uploadDate: video.publishedAt,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    publisher: {
      '@type': 'Organization',
      name: 'Decode The Real',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}${OG_ICON}` },
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

/** FAQPage schema — the three Prologue questions are strong AI-answer extraction targets. */
export function faqJsonLd(
  faqs: { question: string; answer: string }[]
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
