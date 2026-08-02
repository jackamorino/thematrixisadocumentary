/**
 * Data-access layer. Every function tries Sanity first (via safeFetch) and falls back
 * to seed content, so the site renders fully whether or not the CMS is configured.
 */
import { imageUrl } from '@/sanity/image';
import {
  allPostsQuery,
  allVideosQuery,
  authorQuery,
  postBySlugQuery,
  postSlugsQuery,
  relatedPostsQuery,
  siteSettingsQuery,
} from '@/sanity/queries';
import { safeFetch } from '@/sanity/client';

import {
  seedAuthor,
  seedPosts,
  seedSettings,
  seedVideos,
} from './seed-content';
import type { AuthorInfo, Post, SiteSettings, Video } from './types';

type RawPost = Omit<Post, 'coverImage'> & { coverImage?: unknown };

function resolvePost(p: RawPost): Post {
  const cover =
    typeof p.coverImage === 'string'
      ? p.coverImage
      : imageUrl(p.coverImage as never, 1200) || undefined;
  const alt =
    p.coverImage && typeof p.coverImage === 'object' && 'alt' in p.coverImage
      ? ((p.coverImage as { alt?: string }).alt ?? undefined)
      : undefined;
  return { ...p, coverImage: cover, coverImageAlt: alt } as Post;
}

export async function getPosts(): Promise<Post[]> {
  const data = await safeFetch<RawPost[]>(allPostsQuery, {}, seedPosts as RawPost[]);
  return data.map(resolvePost);
}

export async function getPostSlugs(): Promise<string[]> {
  return safeFetch<string[]>(
    postSlugsQuery,
    {},
    seedPosts.map((p) => p.slug)
  );
}

export async function getPost(slug: string): Promise<Post | null> {
  const fallback = seedPosts.find((p) => p.slug === slug) ?? null;
  const data = await safeFetch<RawPost | null>(
    postBySlugQuery,
    { slug },
    fallback as RawPost | null
  );
  return data ? resolvePost(data) : null;
}

export async function getRelatedPosts(slug: string): Promise<Post[]> {
  const fallback = seedPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const data = await safeFetch<RawPost[]>(
    relatedPostsQuery,
    { slug },
    fallback as RawPost[]
  );
  return data.map(resolvePost);
}

export async function getVideos(): Promise<Video[]> {
  return safeFetch<Video[]>(allVideosQuery, {}, seedVideos);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await safeFetch<SiteSettings | null>(
    siteSettingsQuery,
    {},
    seedSettings
  );
  return { ...seedSettings, ...(data ?? {}) };
}

export async function getAuthor(): Promise<AuthorInfo> {
  type RawAuthor = Omit<AuthorInfo, 'photo'> & { photo?: unknown };
  const data = await safeFetch<RawAuthor | null>(authorQuery, {}, seedAuthor);
  if (!data) return seedAuthor;
  const photo =
    typeof data.photo === 'string'
      ? data.photo
      : imageUrl(data.photo as never, 900) || undefined;
  // GROQ projections return explicit nulls for missing fields; a null must not
  // override the seed value (author.bio.map would crash on a photo-only doc).
  const present = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== null && v !== undefined)
  );
  return { ...seedAuthor, ...present, photo } as AuthorInfo;
}
