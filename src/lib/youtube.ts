import { unstable_cache } from 'next/cache';

export interface YouTubeShort {
  id: string;
  title: string;
  publishedAt: string;
}

const CHANNEL_ID =
  process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || 'UCkQvg1fM8ObacQhudz0KKNg';

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

async function fetchChannelFeed(): Promise<
  { id: string; title: string; publishedAt: string }[]
> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const xml = await res.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map((m) => {
      const e = m[1];
      return {
        id: (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1] ?? '',
        title: decodeXmlEntities((e.match(/<title>([^<]+)<\/title>/) || [])[1] ?? ''),
        publishedAt: (e.match(/<published>([^<]+)<\/published>/) || [])[1] ?? '',
      };
    })
    .filter((x) => x.id);
}

/**
 * A Short resolves at /shorts/{id} with a 200; a long-form video 303-redirects to
 * /watch. This is the reliable, key-free way to tell them apart.
 */
async function isShort(id: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
      method: 'HEAD',
      redirect: 'manual',
      cache: 'no-store',
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

/**
 * Latest YouTube Shorts from the Decode The Real channel, pulled from the public RSS
 * feed (no API key) and filtered to actual Shorts. Cached for 30 minutes via
 * unstable_cache, so newly posted Shorts appear on the site on their own. Any failure
 * (feed down, network) degrades to an empty list, never an error.
 */
export const getLatestShorts = unstable_cache(
  async (limit = 12): Promise<YouTubeShort[]> => {
    const items = await fetchChannelFeed();
    if (!items.length) return [];
    const flags = await Promise.all(items.map((i) => isShort(i.id)));
    return items.filter((_, i) => flags[i]).slice(0, limit);
  },
  ['decode-the-real-latest-shorts'],
  { revalidate: 1800, tags: ['youtube-shorts'] }
);
