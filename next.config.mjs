import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// Same build-time flag as src/lib/site.ts (videosEnabled). When off, /videos redirects home.
const videosEnabled = process.env.NEXT_PUBLIC_SHOW_VIDEOS === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the tracing root to THIS project. A lockfile higher up the tree makes Next 15.5
  // infer the wrong workspace root, which breaks generated metadata routes (icon.svg,
  // robots.txt, sitemap.xml) and file tracing.
  outputFileTracingRoot: projectRoot,
  // Bundle the private sample PDF into the /api/download serverless function so it
  // ships to Vercel (it lives outside /public and isn't traced automatically).
  outputFileTracingIncludes: {
    '/api/download': ['./private/the-beginning.pdf'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/rss', destination: '/feed.xml', permanent: true },
      // While the video section is disabled, send /videos home instead of 404ing.
      ...(videosEnabled
        ? []
        : [{ source: '/videos', destination: '/', permanent: false }]),
    ];
  },
};

export default nextConfig;
