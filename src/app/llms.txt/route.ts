import { getPosts } from '@/lib/data';
import { buyLinks, siteConfig, SITE_URL } from '@/lib/site';

/**
 * GEO: llms.txt gives AI answer engines a plain-text map of the site
 * (llmstxt.org). Regenerated hourly so new posts appear without a deploy.
 */
export const revalidate = 3600;

export async function GET() {
  const posts = await getPosts();

  const postLines = posts.map(
    (p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`
  );

  const text = `# ${siteConfig.name}

> Author site for the book "${siteConfig.name}: ${siteConfig.subtitle}" by ${siteConfig.author.name}. The book pairs a first-person awakening narrative (a Catholic childhood, immigrant years in Boston, Ayahuasca ceremonies in Iquitos) with 27 short "Keys" in three Cycles: Cracks in the World, Hidden Histories, and The Inner Cages, closing with The Key of Love.

Important context: the Keys and the blog essays are explorations and interpretations, not claims of settled fact. The framing is the Coin: "The Keys do not tell you what is true. They show you the faces. Your task is to feel the coin in your hand."

The blog, "Keys Left Behind," continues the book's three themes as standalone essays. The companion YouTube channel is Decode The Real (https://www.youtube.com/@DecodeTheReal).

## Pages

- [The Book](${SITE_URL}/the-book): what is inside, the three Prologue questions, formats and where to buy
- [The Author](${SITE_URL}/the-author): who Jack Amorino is, in his own words
- [Blog: Keys Left Behind](${SITE_URL}/blog): essays on the book's three themes
- [Read the beginning free](${SITE_URL}/#signup): the Prologue and Chapter One in exchange for an email

## Blog posts

${postLines.join('\n')}

## Where to buy

- [Amazon](${buyLinks.amazon})
- [Apple Books](${buyLinks.apple})

## Feeds

- [RSS](${SITE_URL}/feed.xml)
- [Sitemap](${SITE_URL}/sitemap.xml)
`;

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
