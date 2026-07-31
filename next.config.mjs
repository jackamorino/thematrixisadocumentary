/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    ];
  },
};

export default nextConfig;
