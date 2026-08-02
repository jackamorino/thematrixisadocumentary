import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Nav } from '@/components/Nav';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Contact',
  path: '/contact',
  description:
    'Reach Jack Amorino: reader letters, podcast and interview requests, press, and review copies for The Matrix is a Documentary.',
});

export default function ContactPage() {
  const email = siteConfig.author.email;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <Nav solid />

      <main id="main" className="article-body" style={{ maxWidth: 720 }}>
        <p className="eyebrow">WRITE TO JACK</p>
        <h1
          className="section-title"
          style={{ fontSize: 'clamp(28px,4vw,44px)', margin: '10px 0 0' }}
        >
          Contact
        </h1>
        <p className="lead" style={{ margin: '10px 0 28px' }}>
          Every letter is read. Not every letter can be answered, but all of
          them are received.
        </p>

        <div
          className="article-prose"
          style={{ fontSize: 'clamp(17px,1.8vw,19px)', lineHeight: 1.7 }}
        >
          <p>
            For anything at all, one address:{' '}
            <a href={`mailto:${email}`}>{email}</a>
          </p>

          <h2 className="inside-card__title" style={{ margin: '28px 0 8px' }}>
            Readers
          </h2>
          <p>
            If a Key found you, or a passage in the book said something you had
            always felt but never said, write. Those letters are the reason the
            book exists.
          </p>

          <h2 className="inside-card__title" style={{ margin: '28px 0 8px' }}>
            Podcasts, interviews, and press
          </h2>
          <p>
            Jack speaks about the book, the Keys, awakening as remembering, and
            reading the modern world like a documentary. Include your show or
            outlet, the format, and a rough timeline. Review copies are
            available for established shows and publications.
          </p>

          <h2 className="inside-card__title" style={{ margin: '28px 0 8px' }}>
            Book clubs and bulk orders
          </h2>
          <p>
            Reading the book with a group? Write and say how many copies you
            need and where you are; there is usually a way to make it easier.
          </p>

          <p style={{ marginTop: 28 }}>
            Prefer to start with the book itself?{' '}
            <Link href="/#signup">Read the beginning free</Link>, or find it on
            the <Link href="/the-book">book page</Link>.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
