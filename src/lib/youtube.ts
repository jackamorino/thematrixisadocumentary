import { unstable_cache } from 'next/cache';

export interface YouTubeShort {
  id: string;
  title: string;
  /** ISO date. Empty when it could not be resolved. */
  publishedAt: string;
}

const CHANNEL_ID =
  process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || 'UCkQvg1fM8ObacQhudz0KKNg';
/** Optional YouTube Data API v3 key. When set, it is the primary source. */
const API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * YouTube keeps a Shorts-only uploads playlist per channel: "UUSH" + the channel id
 * without its "UC" prefix (long-form lives in "UULF", everything in "UU"). Using it
 * means no per-video Short/long-form check is needed.
 */
const SHORTS_PLAYLIST_ID = `UUSH${CHANNEL_ID.slice(2)}`;

/** Hard stop on pagination so a bad token can never loop forever. */
const MAX_PAGES = 40;

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  // Skip the EU consent interstitial.
  Cookie: 'CONSENT=YES+1; SOCS=CAI',
};

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

/* ------------------------------------------------------------------------------ */
/* Source 1: YouTube Data API v3 (needs YOUTUBE_API_KEY), paged 50 at a time.      */
/* ------------------------------------------------------------------------------ */

interface PlaylistItemsResponse {
  nextPageToken?: string;
  items?: {
    snippet?: { title?: string; resourceId?: { videoId?: string } };
    contentDetails?: { videoId?: string; videoPublishedAt?: string };
    status?: { privacyStatus?: string };
  }[];
}

async function fetchShortsFromApi(key: string): Promise<YouTubeShort[]> {
  const all: YouTubeShort[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,status',
      playlistId: SHORTS_PLAYLIST_ID,
      maxResults: '50',
      key,
    });
    if (pageToken) params.set('pageToken', pageToken);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?${params}`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error(`YouTube API ${res.status}`);
    const data = (await res.json()) as PlaylistItemsResponse;
    for (const item of data.items ?? []) {
      const id = item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId;
      if (!id || item.status?.privacyStatus !== 'public') continue;
      all.push({
        id,
        title: item.snippet?.title ?? '',
        publishedAt: item.contentDetails?.videoPublishedAt ?? '',
      });
    }
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }
  return all;
}

/* ------------------------------------------------------------------------------ */
/* Source 2 (no key): the public Shorts playlist page plus its continuations.     */
/* ------------------------------------------------------------------------------ */

interface ShortLockup {
  onTap?: { innertubeCommand?: { reelWatchEndpoint?: { videoId?: string } } };
  overlayMetadata?: { primaryText?: { content?: string } };
}

/** Walks YouTube's page JSON collecting Short tiles and the next continuation token. */
function collect(
  node: unknown,
  shorts: { id: string; title: string }[],
  tokens: string[]
): void {
  if (Array.isArray(node)) {
    for (const n of node) collect(n, shorts, tokens);
    return;
  }
  if (!node || typeof node !== 'object') return;
  const obj = node as Record<string, unknown>;
  const lockup = obj.shortsLockupViewModel as ShortLockup | undefined;
  if (lockup) {
    const id = lockup.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId;
    if (id) shorts.push({ id, title: lockup.overlayMetadata?.primaryText?.content ?? '' });
  }
  const cmd = obj.continuationCommand as { token?: string } | undefined;
  if (cmd?.token) tokens.push(cmd.token);
  for (const v of Object.values(obj)) collect(v, shorts, tokens);
}

async function fetchShortsFromPlaylistPage(): Promise<{ id: string; title: string }[]> {
  const res = await fetch(`https://www.youtube.com/playlist?list=${SHORTS_PLAYLIST_ID}`, {
    headers: BROWSER_HEADERS,
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const html = await res.text();
  const json = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/)?.[1];
  if (!json) return [];
  const clientVersion =
    html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1] ?? '2.20250101.00.00';

  const shorts: { id: string; title: string }[] = [];
  let tokens: string[] = [];
  collect(JSON.parse(json), shorts, tokens);

  // The first page holds up to 100 videos; anything beyond comes from continuations.
  for (let page = 0; tokens.length && page < MAX_PAGES; page++) {
    const token = tokens[tokens.length - 1];
    tokens = [];
    const next = await fetch('https://www.youtube.com/youtubei/v1/browse', {
      method: 'POST',
      headers: { ...BROWSER_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: { client: { clientName: 'WEB', clientVersion, hl: 'en' } },
        continuation: token,
      }),
      cache: 'no-store',
    });
    if (!next.ok) break;
    collect(await next.json(), shorts, tokens);
  }

  const seen = new Set<string>();
  return shorts.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}

/** Newest 15 Shorts with publish dates, from the public RSS feed. */
async function fetchFeed(): Promise<Map<string, { title: string; publishedAt: string }>> {
  const map = new Map<string, { title: string; publishedAt: string }>();
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${SHORTS_PLAYLIST_ID}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return map;
    const xml = await res.text();
    for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
      const e = m[1];
      const id = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
      if (!id) continue;
      map.set(id, {
        title: decodeXmlEntities(e.match(/<title>([^<]+)<\/title>/)?.[1] ?? ''),
        publishedAt: e.match(/<published>([^<]+)<\/published>/)?.[1] ?? '',
      });
    }
  } catch {
    // Dates are a nice-to-have; fall through with what we have.
  }
  return map;
}

/**
 * Upload date for one Short, read from its public page. A video's date never changes,
 * so each lookup is cached for a week, and only Shorts older than the RSS window ever
 * need one.
 */
const getUploadDate = unstable_cache(
  async (id: string): Promise<string> => {
    try {
      const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
        headers: BROWSER_HEADERS,
        cache: 'no-store',
      });
      if (!res.ok) return '';
      const html = await res.text();
      return html.match(/"uploadDate":"([^"]+)"/)?.[1] ?? '';
    } catch {
      return '';
    }
  },
  ['decode-the-real-short-upload-date'],
  { revalidate: 60 * 60 * 24 * 7 }
);

async function fetchShortsWithoutKey(): Promise<YouTubeShort[]> {
  const [listed, feed] = await Promise.all([fetchShortsFromPlaylistPage(), fetchFeed()]);

  // Playlist page unavailable: fall back to the (15 item) feed rather than nothing.
  if (!listed.length) {
    return [...feed].map(([id, v]) => ({ id, ...v }));
  }

  return Promise.all(
    listed.map(async (s) => {
      const fromFeed = feed.get(s.id);
      return {
        id: s.id,
        title: fromFeed?.title || s.title,
        publishedAt: fromFeed?.publishedAt || (await getUploadDate(s.id)),
      };
    })
  );
}

/* ------------------------------------------------------------------------------ */

function newestFirst(list: YouTubeShort[]): YouTubeShort[] {
  const time = (s: YouTubeShort) => (s.publishedAt ? Date.parse(s.publishedAt) || 0 : 0);
  // Undated items compare equal, so the stable sort keeps their playlist position.
  return [...list].sort((a, b) => (time(a) && time(b) ? time(b) - time(a) : 0));
}

/**
 * Every public Short on the Decode The Real channel, newest first.
 *
 * With YOUTUBE_API_KEY set, pages through the Data API (50 per page, following
 * nextPageToken). Without it, reads the channel's public Shorts playlist and its
 * continuations. Cached for 30 minutes via unstable_cache, so new Shorts appear on
 * their own without hitting YouTube on every request. Any failure degrades to the
 * next source, then to an empty list, never an error.
 */
export const getAllShorts = unstable_cache(
  async (): Promise<YouTubeShort[]> => {
    if (API_KEY) {
      try {
        const viaApi = await fetchShortsFromApi(API_KEY);
        if (viaApi.length) return newestFirst(viaApi);
      } catch (err) {
        console.error('[youtube] Data API failed, using public playlist', err);
      }
    }
    try {
      return newestFirst(await fetchShortsWithoutKey());
    } catch (err) {
      console.error('[youtube] could not load Shorts', err);
      return [];
    }
  },
  ['decode-the-real-all-shorts'],
  { revalidate: 1800, tags: ['youtube-shorts'] }
);
