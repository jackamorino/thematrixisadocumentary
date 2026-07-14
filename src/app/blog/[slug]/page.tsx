import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Nav } from '@/components/Nav';
import { PostCard } from '@/components/PostCard';
import { Verse } from '@/components/Verse';
import { getPost, getPostSlugs, getRelatedPosts } from '@/lib/data';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  pageMetadata,
} from '@/lib/seo';
import { buyLinks, cycleLabel, siteConfig, withUtm } from '@/lib/site';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return pageMetadata({ title: 'Not found', path: `/blog/${slug}` });
  return pageMetadata({
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage?.startsWith('http') ? post.coverImage : post.coverImage || '/assets/cover.png',
    type: 'article',
    publishedTime: post.publishedAt,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug);

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(post),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <Nav solid />

      <main id="main">
        {/* Article header */}
        <header className="article-header">
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt=""
              fill
              className="article-header__bg"
              sizes="100vw"
              priority
              aria-hidden
            />
          )}
          <div className="article-header__scrim" aria-hidden />
          <div className="article-header__inner">
            <Link href="/blog" style={{ fontSize: 16, letterSpacing: '.06em' }}>
              ← All Keys
            </Link>
            <div className="article-header__cat">
              {cycleLabel(post.cycle).toUpperCase()}
            </div>
            <h1 className="article-header__title">{post.title}</h1>
            <p className="article-header__meta">
              By {siteConfig.author.name} · From <em>Keys Left Behind</em>
            </p>
          </div>
        </header>

        {/* Body */}
        <article className="article-body">
          <Verse verse={post.verse} body={post.body} />

          {/* Pull quote */}
          <div className="pull-quote">
            <p className="pull-quote__text">
              The Keys do not tell you what is true.
              <br />
              They show you the faces.
            </p>
            <p className="pull-quote__cite">— Intro to the Keys: The Coin</p>
          </div>

          {/* In-article book CTA */}
          <div className="cta-card">
            <Image
              src="/assets/cover.png"
              alt="The Matrix is a Documentary — book cover"
              width={110}
              height={165}
              className="cta-card__cover"
              sizes="110px"
            />
            <div className="cta-card__copy">
              <p className="cta-card__title">
                This Key is one of twenty-seven left behind in the book.
              </p>
              <div className="btn-row" style={{ marginTop: 18 }}>
                <a
                  href={withUtm(buyLinks.amazon, 'article-cta')}
                  className="btn btn-primary btn-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BUY ON AMAZON
                </a>
                <a
                  href={withUtm(buyLinks.apple, 'article-cta')}
                  className="btn btn-outline btn-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  APPLE BOOKS
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* More Keys */}
        {related.length > 0 && (
          <section style={{ padding: '0 clamp(20px,6vw,100px) clamp(48px,7vw,80px)' }} aria-labelledby="more-title">
            <h2 className="font-heading" id="more-title" style={{ fontSize: 24, color: 'var(--text)', margin: '0 0 26px' }}>
              More Keys
            </h2>
            <div className="grid-fill" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
              {related.map((p) => (
                <PostCard key={p._id} post={p} imageHeight={160} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
