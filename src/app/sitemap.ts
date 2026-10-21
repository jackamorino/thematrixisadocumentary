import type { MetadataRoute } from 'next';

import { getPosts } from '@/lib/data';
import { SITE_URL, videosEnabled } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/the-book`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/the-author`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
    ...(videosEnabled
      ? [
          {
            url: `${SITE_URL}/videos`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.6,
          } as const,
        ]
      : []),
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt ?? post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
