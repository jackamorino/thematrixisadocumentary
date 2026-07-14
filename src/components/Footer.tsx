import Link from 'next/link';

import { buyLinks, siteConfig, withUtm } from '@/lib/site';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__copy">{siteConfig.copyright}</div>
      <div className="footer__links">
        <a
          href={withUtm(buyLinks.amazon, 'footer')}
          target="_blank"
          rel="noopener noreferrer"
        >
          Amazon
        </a>
        <a
          href={withUtm(buyLinks.apple, 'footer')}
          target="_blank"
          rel="noopener noreferrer"
        >
          Apple Books
        </a>
        <a href={buyLinks.youtube} target="_blank" rel="noopener noreferrer">
          YouTube
        </a>
        <Link href="/blog">Blog</Link>
      </div>
    </footer>
  );
}
