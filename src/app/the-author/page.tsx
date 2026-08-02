import Image from 'next/image';

import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Nav } from '@/components/Nav';
import { getAuthor } from '@/lib/data';
import { breadcrumbJsonLd, pageMetadata, personJsonLd } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'The Author',
  path: '/the-author',
  description:
    'Jack Amorino is not just a name, but a mirror. His journey through Aya’s visions and the Keys reflects the path many walk in silence: questioning, remembering, awakening.',
  image: '/assets/book-icon.png',
});
export const revalidate = 60;

export default async function TheAuthorPage() {
  const author = await getAuthor();

  return (
    <>
      <JsonLd
        data={[
          personJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'The Author', path: '/the-author' },
          ]),
        ]}
      />
      <Nav solid />

      <main id="main">
        {/* Split hero */}
        <section className="split-hero split-hero--right" style={{ padding: 'clamp(48px,7vw,90px) clamp(20px,6vw,100px)' }}>
          {author.photo ? (
            <Image
              src={author.photo}
              alt={`${author.name}, author`}
              width={340}
              height={453}
              priority
              className="author-photo"
              sizes="(max-width: 640px) 86vw, 340px"
            />
          ) : (
            <div className="author-photo author-photo--placeholder" aria-hidden>
              <span>
                author photo
                <br />
                (drop in when ready)
              </span>
            </div>
          )}
          <div className="split-hero__copy">
            <p className="eyebrow--caps">ABOUT THE AUTHOR</p>
            <h1 className="split-hero__title" style={{ fontSize: 'clamp(32px,4.6vw,52px)' }}>
              {author.name}
            </h1>
            {author.bio.map((para, i) => (
              <p className="split-hero__para" key={i} style={{ color: 'var(--text-75)' }}>
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* In his words */}
        <section
          className="section section--panel center"
          style={{ padding: 'clamp(56px,8vw,110px) clamp(20px,10vw,180px)' }}
          aria-labelledby="words-title"
        >
          <p className="eyebrow" id="words-title">IN HIS WORDS</p>
          <p className="art-band__para" style={{ maxWidth: 720 }}>
            I have walked through shadows, through questions that cut, through
            truths that dissolve as soon as they are touched. I have seen the traps
            and the cages, the stories woven into the fabric of our world. Yet
            beneath them all, one force remained untouched, unbroken: Love.
          </p>
          <p className="art-band__para" style={{ maxWidth: 720 }}>
            Because love cannot be owned, cannot be taxed, cannot be erased. It
            multiplies in the giving, returns in the receiving, and builds a
            freedom no empire can cage.
          </p>
          <p
            className="font-heading"
            style={{
              fontSize: 'clamp(22px,2.6vw,30px)',
              lineHeight: 1.5,
              color: 'var(--gold-bright)',
              maxWidth: 640,
              margin: '40px auto 0',
            }}
          >
            &ldquo;Love is the Key.
            <br />
            All others unlock doors,
            <br />
            but this one unlocks you.&rdquo;
          </p>
        </section>

      </main>

      <Footer />
    </>
  );
}
