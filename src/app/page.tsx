import Image from 'next/image';
import Link from 'next/link';

import { BuyButtons } from '@/components/BuyButtons';
import { EmailCapture } from '@/components/EmailCapture';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { LiteYouTube } from '@/components/LiteYouTube';
import { Nav } from '@/components/Nav';
import { PostCard } from '@/components/PostCard';
import { getPosts, getSiteSettings, getVideos } from '@/lib/data';
import { bookJsonLd, faqJsonLd, pageMetadata, websiteJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata = pageMetadata({ path: '/' });
export const revalidate = 60;

const PROLOGUE_QUESTIONS = [
  {
    question: 'What if the rules you live by are part of the illusion?',
    answer:
      'The real prison isn’t made of walls — it’s built from beliefs you never tested.',
  },
  {
    question: 'What if reality is a script written in forgetting?',
    answer:
      'The Matrix isn’t just a movie. It’s the world’s oldest confession, dressed as fiction.',
  },
  {
    question: 'What if the truest revolution is remembering?',
    answer:
      'There is no one coming to rescue you — because the rescuer you’re waiting for is the self you’ve forgotten to remember.',
  },
];

export default async function HomePage() {
  const [posts, videos, settings] = await Promise.all([
    getPosts(),
    getVideos(),
    getSiteSettings(),
  ]);

  const previewPosts = posts.slice(0, 3);
  const bandVideos = videos.slice(0, 3);

  return (
    <>
      <JsonLd
        data={[websiteJsonLd(), bookJsonLd(), faqJsonLd(PROLOGUE_QUESTIONS)]}
      />

      <div className="home-hero">
        <Nav />
        <div className="home-hero__inner">
          <p className="home-hero__prologue">
            &ldquo;The Matrix isn&rsquo;t just a movie. It&rsquo;s the world&rsquo;s
            oldest confession, dressed as fiction.&rdquo;
          </p>
          <Image
            src="/blog-images/the-matrix-is-a-documentary-cover-web.png"
            alt="The Matrix is a Documentary book cover"
            width={400}
            height={600}
            priority
            className="home-hero__cover"
            sizes="(max-width: 640px) 82vw, 400px"
          />
          <p className="home-hero__pitch">{siteConfig.description}</p>
          <div className="home-hero__buttons">
            <BuyButtons source="home-hero" center />
          </div>
          <p className="home-hero__formats">PAPERBACK · HARDCOVER · KINDLE</p>
        </div>
      </div>

      <main id="main">
        {/* Typographic quote band */}
        <section className="quote-band" aria-label="Quote from the Prologue">
          <Image
            src="/assets/eterno-speaks.png"
            alt=""
            fill
            className="quote-band__bg"
            sizes="100vw"
            aria-hidden
          />
          <div className="quote-band__scrim" aria-hidden />
          <div className="quote-band__inner">
            <p className="quote-band__text">
              You&rsquo;re not <span className="gold-text">in</span> the Matrix.
              <br />
              You <span className="gold-text">are</span> the Matrix —
              <br />
              until you remember you&rsquo;re not.
            </p>
            <p className="quote-band__cite">— Prologue</p>
          </div>
        </section>

        {/* Keys Left Behind */}
        <section className="section" aria-labelledby="keys-title">
          <div className="section__head-center">
            <p className="eyebrow">INSIDE THE BOOK</p>
            <h2 className="section-title" id="keys-title" style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}>
              Keys Left Behind
            </h2>
            <p className="lead" style={{ fontSize: 20, maxWidth: 600, margin: '16px auto 0' }}>
              Three Cycles of Keys: Cracks in the World, Hidden Histories, The
              Inner Cages. The Keys do not tell you what is true. They show you
              the faces. Your task is to feel the coin in your hand.
            </p>
          </div>
          <div className="grid-auto">
            <article className="key-card">
              <Image
                src="/assets/the-coin.png"
                alt="The Coin"
                width={600}
                height={420}
                className="key-card__img"
                style={{ objectPosition: 'center 22%' }}
                sizes="(max-width: 700px) 100vw, 50vw"
              />
              <div className="key-card__body">
                <div className="key-card__kicker">INTRO TO THE KEYS</div>
                <h3 className="key-card__title">The Coin</h3>
                <p className="key-card__text">
                  One face says true. The other says false. Both faces exist only
                  because the coin itself is real. The metal, the weight, the
                  thing beneath.
                </p>
              </div>
            </article>
            <article className="key-card">
              <Image
                src="/assets/key-of-love.png"
                alt="The Key of Love"
                width={600}
                height={420}
                className="key-card__img"
                style={{ objectPosition: 'center 30%' }}
                sizes="(max-width: 700px) 100vw, 50vw"
              />
              <div className="key-card__body">
                <div className="key-card__kicker">THE LAST KEY, BECAUSE IT IS THE FIRST</div>
                <h3 className="key-card__title">The Key of Love</h3>
                <p className="key-card__text">
                  All cages are made of fear, and every shadow dissolves in light.
                  Love is the Key. All others unlock doors, but this one unlocks
                  you.
                </p>
              </div>
            </article>
          </div>
          <div className="center mt-lg">
            <Link href="/the-book" className="text-link">
              Explore the book →
            </Link>
          </div>
        </section>

        {/* Prologue questions — FAQ-style extraction targets for GEO */}
        <section className="section section--panel" aria-labelledby="questions-title">
          <p className="eyebrow center" id="questions-title">
            THE QUESTIONS THEY NEVER TAUGHT YOU IN SCHOOL
          </p>
          <div className="grid-auto" style={{ marginTop: 44 }}>
            {PROLOGUE_QUESTIONS.map((q, i) => (
              <div className="q-card" key={i}>
                <div className="q-card__num">{['I', 'II', 'III'][i]}</div>
                <p className="q-card__q">{q.question}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Decode The Real band (gated by showVideos) */}
        {settings.showVideos && bandVideos.length > 0 && (
          <section className="section section--yt" aria-labelledby="yt-title">
            <div className="section__head-row">
              <div>
                <p className="eyebrow">ON YOUTUBE</p>
                <h2 className="section-title" id="yt-title" style={{ fontSize: 'clamp(26px,3vw,36px)' }}>
                  Decode The Real
                </h2>
              </div>
              <Link href="/videos" className="text-link">
                All videos →
              </Link>
            </div>
            <div className="grid-auto-sm">
              {bandVideos.map((video) => (
                <div className="video-card" key={video._id}>
                  <LiteYouTube id={video.youtubeId} title={video.title} />
                  <div className="video-card__body">
                    <div className="video-card__title">{video.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Blog preview */}
        <section className="section" aria-labelledby="blog-title">
          <div className="section__head-row">
            <div>
              <p className="eyebrow">FROM THE BLOG</p>
              <h2 className="section-title" id="blog-title" style={{ fontSize: 'clamp(26px,3vw,36px)' }}>
                Keys Left Behind
              </h2>
            </div>
            <Link href="/blog" className="text-link">
              All posts →
            </Link>
          </div>
          <div className="grid-auto-sm">
            {previewPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>

        <EmailCapture
          headline={settings.signupHeadline}
          blurb={settings.signupBlurb}
        />
      </main>

      <Footer />
    </>
  );
}
