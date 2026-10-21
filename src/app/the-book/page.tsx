import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { BuyButtons } from '@/components/BuyButtons';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Nav } from '@/components/Nav';
import {
  bookJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
} from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const description =
  'This book is a story. It is also a mirror. A journey of awakening, remembering, and the Key that frees the soul. Twenty-seven Keys in three Cycles, closing with the Key of Love.';

const baseMeta = pageMetadata({ title: 'The Book', path: '/the-book', description });

// og:type "book" adds book:author / book:tag / book:release_date for richer previews.
export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    type: 'book',
    title: baseMeta.openGraph?.title,
    description: baseMeta.openGraph?.description,
    url: baseMeta.openGraph?.url,
    siteName: baseMeta.openGraph?.siteName,
    images: baseMeta.openGraph?.images,
    authors: [`${SITE_URL}/the-author`],
    tags: ['spiritual awakening', 'consciousness', 'hidden history'],
    releaseDate: '2026',
  },
};

const QUESTIONS = [
  { n: 'I', q: 'What if the rules you live by are part of the illusion?' },
  { n: 'II', q: 'What if reality is a script written in forgetting?' },
  { n: 'III', q: 'What if the truest revolution is remembering?' },
];

// Visible FAQ (rendered below) + FAQPage JSON-LD. Google requires the answers to be
// visible on the page, so these drive both the markup and the on-page section.
const BOOK_FAQ = [
  {
    question: 'What is The Matrix is a Documentary about?',
    answer:
      "The Matrix is a Documentary follows Jack Amorino's journey of awakening, from childhood catechism in Boston to ayahuasca ceremonies in Iquitos, Peru. Through twenty-seven Keys across three Cycles, the book explores how the systems we take for granted may be the very structures that keep us asleep.",
  },
  {
    question: 'Who is Jack Amorino?',
    answer:
      'Jack Amorino is the author of The Matrix is a Documentary. His journey through ceremony, questioning, and remembering forms the backbone of the book. He writes about consciousness, hidden history, and the Keys left behind for those ready to see.',
  },
  {
    question: 'Where can I buy The Matrix is a Documentary?',
    answer:
      'The book is available in Paperback, Hardcover, and Kindle on Amazon, and as an ebook on Apple Books. You can also read the Prologue and Chapter One for free by signing up on the website.',
  },
  {
    question: 'What are the Keys Left Behind?',
    answer:
      'The Keys are twenty-seven essays across three Cycles (Cracks in the World, Hidden Histories, and The Inner Cages) that accompany the book. Each Key explores a question, a hidden truth, or a cage we never noticed. They close with the Key of Love.',
  },
];

export default function TheBookPage() {
  return (
    <>
      <JsonLd
        data={[
          bookJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'The Book', path: '/the-book' },
          ]),
          faqJsonLd(BOOK_FAQ),
        ]}
      />
      <Nav solid />

      <main id="main">
        {/* Split hero */}
        <section className="split-hero split-hero--left">
          <Image
            src="/blog-images/the-matrix-is-a-documentary-cover-web.png"
            alt="The Matrix is a Documentary book cover"
            width={380}
            height={570}
            priority
            className="split-hero__cover"
            sizes="(max-width: 640px) 86vw, 380px"
          />
          <div className="split-hero__copy">
            <p className="eyebrow--caps">
              A JOURNEY OF AWAKENING, REMEMBERING, AND THE KEY THAT FREES THE SOUL
            </p>
            <h1 className="split-hero__title">
              This book is a story.
              <br />
              It is also a mirror.
            </h1>
            <p className="split-hero__para">
              Some will read it as fiction. Some will read it as philosophy. Some
              will recognize pieces of their own awakening inside it. However you
              read it — read it slowly.
            </p>
            <p className="split-hero__para">
              This is not an escape manual. It&rsquo;s a call to awaken the
              director in you. Because the real prison isn&rsquo;t made of walls —
              it&rsquo;s built from beliefs you never tested.
            </p>
            <div style={{ margin: '30px 0 0' }}>
              <BuyButtons source="the-book-hero" />
            </div>
            <div className="pill-row">
              <span className="pill">Paperback</span>
              <span className="pill">Hardcover</span>
              <span className="pill">Kindle</span>
            </div>
          </div>
        </section>

        {/* Prologue questions */}
        <section className="section section--panel" aria-labelledby="q-title">
          <p className="eyebrow center" id="q-title">
            THE QUESTIONS THEY NEVER TAUGHT YOU IN SCHOOL
          </p>
          <div className="grid-auto" style={{ marginTop: 44 }}>
            {QUESTIONS.map((x) => (
              <div className="q-card" key={x.n}>
                <div className="q-card__num">{x.n}</div>
                <p className="q-card__q">{x.q}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What's inside */}
        <section className="section" aria-labelledby="inside-title">
          <div className="section__head-center">
            <p className="eyebrow">WHAT&rsquo;S INSIDE</p>
            <h2 className="section-title" id="inside-title" style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}>
              A Story, a Voice, and the Keys
            </h2>
          </div>
          <div className="grid-auto">
            <article className="inside-card">
              <Image src="/assets/playground.png" alt="A childhood playground, evoking Jack's early years of questioning" width={600} height={220} className="inside-card__img" sizes="(max-width:700px) 100vw, 33vw" />
              <div className="inside-card__body">
                <h3 className="inside-card__title">The Journey</h3>
                <p className="inside-card__text">
                  Ten chapters and the interludes between them: Jack&rsquo;s path
                  from a too-tall chair in catechism, through Boston&rsquo;s grey
                  mornings, to the ceremonies of Iquitos and the remembering that
                  followed.
                </p>
              </div>
            </article>
            <article className="inside-card">
              <Image src="/assets/eterno-speaks.png" alt="Eterno, Jack's Higher Self, speaking during ceremony" width={600} height={220} className="inside-card__img" style={{ objectPosition: 'center 15%' }} sizes="(max-width:700px) 100vw, 33vw" />
              <div className="inside-card__body">
                <h3 className="inside-card__title">Eterno Speaks</h3>
                <p className="inside-card__text">
                  Jack&rsquo;s Higher Self, the compass of his ceremonies, the
                  voice of memory itself. When Eterno speaks, pause. Feel the space
                  between your thoughts. That is where the real story lives.
                </p>
              </div>
            </article>
            <article className="inside-card">
              <Image src="/assets/the-coin.png" alt="The Coin, one of the twenty-seven Keys from The Matrix is a Documentary" width={600} height={220} className="inside-card__img" style={{ objectPosition: 'center 25%' }} sizes="(max-width:700px) 100vw, 33vw" />
              <div className="inside-card__body">
                <h3 className="inside-card__title">Keys Left Behind</h3>
                <p className="inside-card__text">
                  Twenty-seven Keys in three Cycles (Cracks in the World, Hidden
                  Histories, The Inner Cages), closing with the Key of Love: the
                  one that was always in your pocket.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* FAQ (visible; mirrors the FAQPage JSON-LD above) */}
        <section className="section section--panel" aria-labelledby="faq-title">
          <div className="section__head-center">
            <p className="eyebrow">QUESTIONS &amp; ANSWERS</p>
            <h2 className="section-title" id="faq-title" style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}>
              Frequently Asked
            </h2>
          </div>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {BOOK_FAQ.map((item) => (
              <div key={item.question} style={{ margin: '0 0 28px' }}>
                <h3 className="inside-card__title" style={{ marginBottom: 8 }}>
                  {item.question}
                </h3>
                <p className="lead" style={{ fontSize: 18, color: 'var(--text-70)' }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Prologue excerpt band */}
        <section className="art-band" aria-labelledby="excerpt-title">
          <Image src="/assets/new-map.png" alt="" fill className="art-band__bg" sizes="100vw" aria-hidden />
          <div className="art-band__scrim" aria-hidden />
          <div className="art-band__inner">
            <p className="eyebrow" id="excerpt-title">FROM THE PROLOGUE</p>
            <p className="art-band__para">
              There is no one coming to rescue you — because the rescuer
              you&rsquo;re waiting for is the self you&rsquo;ve forgotten to
              remember.
            </p>
            <p className="art-band__para">
              So read this not with your eyes — but with the part of you that
              still remembers dancing in light before language existed. Let it do
              what it came to do: <em style={{ color: 'var(--gold-bright)' }}>wake you up.</em>
            </p>
            <div className="art-band__buttons">
              <BuyButtons source="the-book-excerpt" amazonLabel="GET THE BOOK" appleLabel="APPLE BOOKS" />
              <Link href="/#signup" className="btn btn-outline">
                READ THE BEGINNING FREE
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
