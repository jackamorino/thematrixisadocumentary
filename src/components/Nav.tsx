'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { buyLinks, navLinks, siteConfig, withUtm } from '@/lib/site';

export function Nav({ solid = false }: { solid?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className={`nav${solid ? ' nav--solid' : ''}`} aria-label="Primary">
      <Link href="/" className="nav__wordmark">
        {siteConfig.wordmark}
      </Link>
      <button
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="nav-links"
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
      <div
        id="nav-links"
        className={`nav__links${open ? ' nav__links--open' : ''}`}
      >
        {navLinks.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className="nav__link"
              aria-current={active ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}
        <a
          href={withUtm(buyLinks.amazon, 'nav')}
          className="nav__cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get the Book
        </a>
      </div>
    </nav>
  );
}
