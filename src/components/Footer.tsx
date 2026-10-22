import Link from 'next/link';

import { CookiePreferencesLink } from '@/components/CookiePreferencesLink';
import { buyLinks, siteConfig, socialLinks, withUtm } from '@/lib/site';

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
        <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
          YouTube
        </a>
        <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
          TikTok
        </a>
        <a href={socialLinks.x} target="_blank" rel="noopener noreferrer">
          X
        </a>
        <Link href="/blog">Blog</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/privacy">Privacy</Link>
        <CookiePreferencesLink />
      </div>
    </footer>
  );
}
