import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

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
      // Video section is disabled for now. Redirect (temporary) instead of 404.
      { source: '/videos', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
