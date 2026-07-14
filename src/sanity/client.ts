import { createClient, type SanityClient } from 'next-sanity';

import { apiVersion, dataset, projectId, sanityConfigured } from './env';

/**
 * A single shared client. When no project id is configured we still create a client
 * object (so imports don't crash), but callers should guard on `sanityConfigured`
 * and fall back to seed content. `useCdn: false` keeps content fresh for ISR/SSG.
 */
export const client: SanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  token: process.env.SANITY_API_READ_TOKEN || undefined,
});

/**
 * Safe fetch: returns `fallback` if Sanity isn't configured or the query errors,
 * so a missing/empty CMS never takes the site down.
 */
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T
): Promise<T> {
  if (!sanityConfigured) return fallback;
  try {
    const data = await client.fetch<T>(query, params, {
      next: { revalidate: 60 },
    });
    if (data === null || data === undefined) return fallback;
    if (Array.isArray(data) && data.length === 0) return fallback;
    return data;
  } catch (err) {
    console.error('[sanity] fetch failed, using fallback:', err);
    return fallback;
  }
}
