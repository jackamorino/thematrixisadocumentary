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

export const metadata = pageMetadata({
  title: 'The Book',
  path: '/the-book',
  description:
    'This book is a story. It is also a mirror. A journey of awakening, remembering, and the Key that frees the soul — twenty-seven Keys in three Cycles, closing with the Key of Love.',
});

const QUESTIONS = [
  { n: 'I', q: 'What if the rules you live by are part of the illusion?' },
  { n: 'II', q: 'What if reality is a script written in forgetting?' },
  { n: 'III', q: 'What if the truest revolution is remembering?' },
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
          faqJsonLd(
            QUESTIONS.map((x) => ({ question: x.q, answer: x.q }))
          ),
        ]}
      />
      <Nav solid />

      <main id="main">
        {/* Split hero */}
        <section className="split-hero split-hero--left">
          <Image
            src="/assets/cover.png"
            alt="The Matrix is a Documentary — book cover"
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
              <Image src="/assets/playground.png" alt="" width={600} height={220} className="inside-card__img" sizes="(max-width:700px) 100vw, 33vw" />
              <div className="inside-card__body">
                <h3 className="inside-card__title">The Journey</h3>
                <p className="inside-card__text">
                  Ten chapters and the interludes between them — Jack&rsquo;s path
                  from a too-tall chair in catechism, through Boston&rsquo;s grey
                  mornings, to the ceremonies of Iquitos and the remembering that
                  followed.
                </p>
              </div>
            </article>
            <article className="inside-card">
              <Image src="/assets/eterno-speaks.png" alt="" width={600} height={220} className="inside-card__img" style={{ objectPosition: 'center 15%' }} sizes="(max-width:700px) 100vw, 33vw" />
              <div className="inside-card__body">
                <h3 className="inside-card__title">Eterno Speaks</h3>
                <p className="inside-card__text">
                  Jack&rsquo;s Higher Self — the compass of his ceremonies, the
                  voice of memory itself. When Eterno speaks, pause. Feel the space
                  between your thoughts. That is where the real story lives.
                </p>
              </div>
            </article>
            <article className="inside-card">
              <Image src="/assets/the-coin.png" alt="" width={600} height={220} className="inside-card__img" style={{ objectPosition: 'center 25%' }} sizes="(max-width:700px) 100vw, 33vw" />
              <div className="inside-card__body">
                <h3 className="inside-card__title">Keys Left Behind</h3>
                <p className="inside-card__text">
                  Twenty-seven Keys in three Cycles — Cracks in the World, Hidden
                  Histories, The Inner Cages — closing with the Key of Love: the
                  one that was always in your pocket.
                </p>
              </div>
            </article>
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
