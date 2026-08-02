import type { PortableTextBlock } from '@portabletext/react';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

import type { CycleKey } from './site';

type Image = SanityImageSource;

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
}

export interface Post {
  _id: string;
  /** Sanity revision timestamp; absent on seed content. */
  _updatedAt?: string;
  title: string;
  slug: string;
  cycle: CycleKey;
  excerpt: string;
  /** Local asset path (seed) OR resolved Sanity image URL. */
  coverImage?: string;
  coverImageRef?: Image;
  /** Alt text authored on the Sanity image (falls back to post title in the UI). */
  coverImageAlt?: string;
  /** Portable Text from Sanity, OR pre-split verse lines for seed content. */
  body?: PortableTextBlock[];
  /** Verse-style plain text (seed / fallback). Preserves manuscript line breaks. */
  verse?: string;
  featured?: boolean;
  publishedAt: string;
  seo?: SeoFields;
}

export interface Video {
  _id: string;
  title: string;
  youtubeId: string;
  cycle: CycleKey;
  featured?: boolean;
  publishedAt: string;
}

export interface SiteSettings {
  showVideos: boolean;
  signupHeadline: string;
  signupBlurb: string;
  buyLinks?: {
    amazon?: string;
    apple?: string;
  };
  socialLinks?: {
    youtube?: string;
  };
}

export interface AuthorInfo {
  name: string;
  bio: string[];
  quote?: string;
  photo?: string;
  photoRef?: Image;
}
