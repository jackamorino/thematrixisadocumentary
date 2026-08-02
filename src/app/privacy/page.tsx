import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  path: '/privacy',
  description:
    'How thematrixisadocumentary.com collects and uses your information, including email signups for the free sample and newsletter.',
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ])}
      />
      <Nav solid />

      <main id="main" className="article-body" style={{ maxWidth: 720 }}>
        <p className="eyebrow">THE FINE PRINT</p>
        <h1 className="section-title" style={{ fontSize: 'clamp(28px,4vw,44px)', margin: '10px 0 0' }}>
          Privacy Policy
        </h1>
        <p className="lead" style={{ margin: '10px 0 28px' }}>
          Last updated: August 2026
        </p>

        <div className="article-prose" style={{ fontSize: 'clamp(17px,1.8vw,19px)', lineHeight: 1.7 }}>
          <p>
            This policy explains what information {siteConfig.name} collects, why,
            and what choices you have. It applies to thematrixisadocumentary.com.
          </p>

          <h2 className="inside-card__title" style={{ margin: '28px 0 8px' }}>
            What we collect
          </h2>
          <p>
            If you sign up to read the beginning of the book for free, we collect
            your email address. We do not ask for or store payment information on
            this site. Purchases happen on Amazon or Apple Books under their own
            terms and privacy policies.
          </p>

          <h2 className="inside-card__title" style={{ margin: '28px 0 8px' }}>
            How we use it
          </h2>
          <p>
            Your email is used to send you the free sample (the Prologue and
            Chapter One) and, if you stay subscribed, occasional updates and new
            writing from Jack Amorino. Every email includes an unsubscribe link,
            and you can opt out at any time.
          </p>

          <h2 className="inside-card__title" style={{ margin: '28px 0 8px' }}>
            Who processes it
          </h2>
          <p>
            Email signups and newsletters are handled by MailerLite, our email
            service provider, which stores your address and sends messages on our
            behalf. The site is hosted on Vercel. These providers process data
            only to run the service.
          </p>

          <h2 className="inside-card__title" style={{ margin: '28px 0 8px' }}>
            Cookies and analytics
          </h2>
          <p>
            The site uses only what it needs to function, plus privacy-respecting
            analytics to understand which pages are read. We do not sell your
            data, and we do not share it except with the providers named above.
          </p>

          <h2 className="inside-card__title" style={{ margin: '28px 0 8px' }}>
            Your choices
          </h2>
          <p>
            You can unsubscribe from any email, and you can ask us to delete your
            address entirely. To make a request, email{' '}
            <a href={`mailto:${siteConfig.author.email}`}>
              {siteConfig.author.email}
            </a>
            .
          </p>

          <h2 className="inside-card__title" style={{ margin: '28px 0 8px' }}>
            Contact
          </h2>
          <p>
            Questions about this policy can go to{' '}
            <a href={`mailto:${siteConfig.author.email}`}>
              {siteConfig.author.email}
            </a>
            . Return to the{' '}
            <Link href="/">home page</Link>.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
