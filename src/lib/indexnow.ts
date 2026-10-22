/**
 * IndexNow: instantly notify participating search engines (Bing, Yandex, and the
 * shared IndexNow network) when a URL is added, updated, or removed, so they
 * re-crawl it right away instead of waiting for the next scheduled crawl.
 *
 * The key is NOT a secret. Ownership is proven by hosting a file named `${KEY}.txt`
 * at the site root whose contents are exactly the key. That file lives at
 * `public/${KEY}.txt`; if you rotate the key here, rename that file to match.
 *
 * Called from the Sanity publish webhook (src/app/api/revalidate/route.ts) after
 * on-demand revalidation. Failures are swallowed: a missed ping is harmless (the
 * normal crawl still happens) and must never break publishing.
 */
const KEY = 'b1a4dd70e8fedf0f9683e067ed063617';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://thematrixisadocumentary.com'
).replace(/\/$/, '');

function host(): string {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return 'thematrixisadocumentary.com';
  }
}

/**
 * Submit absolute URLs to IndexNow. Accepts site-relative paths or full URLs;
 * relative paths are resolved against NEXT_PUBLIC_SITE_URL. No-ops on empty input.
 */
export async function pingIndexNow(paths: string[]): Promise<void> {
  const urlList = [...new Set(paths)]
    .filter(Boolean)
    .map((p) => (p.startsWith('http') ? p : `${SITE_URL}${p.startsWith('/') ? '' : '/'}${p}`));

  if (urlList.length === 0) return;

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: host(),
        key: KEY,
        keyLocation: `${SITE_URL}/${KEY}.txt`,
        urlList,
      }),
    });
    // 200 and 202 are both success; anything else we just log and move on.
    if (!res.ok && res.status !== 202) {
      console.warn('[indexnow] non-ok response:', res.status);
    }
  } catch (err) {
    console.warn('[indexnow] ping failed:', err);
  }
}
