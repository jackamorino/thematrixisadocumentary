import Link from 'next/link';
import Image from 'next/image';

import { BlogFilter } from '@/components/BlogFilter';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Nav } from '@/components/Nav';
import { getPosts } from '@/lib/data';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { cycleLabel } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Keys Left Behind: Essays on Awakening and Hidden History',
  path: '/blog',
  description:
    'Keys Left Behind: essays from The Matrix is a Documentary and beyond. The Keys do not tell you what is true. They show you the faces. One Key at a time.',
});
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = featured ? posts.filter((p) => p._id !== featured._id) : posts;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />
      <Nav solid />

      <main id="main">
        <header className="blog-header">
          <p className="eyebrow">THE BLOG</p>
          <h1 className="section-title" style={{ fontSize: 'clamp(30px,4.4vw,48px)' }}>
            Keys Left Behind
          </h1>
          <p className="lead" style={{ fontSize: 'clamp(17px,1.8vw,20px)', maxWidth: 600, margin: '16px auto 0' }}>
            The Keys do not tell you what is true. They show you the faces. Essays
            from the book and beyond, one Key at a time.
          </p>
        </header>

        {featured && (
          <div style={{ padding: '0 clamp(20px,6vw,100px)' }}>
            <Link href={`/blog/${featured.slug}`} className="featured-card">
              {featured.coverImage && (
                <Image
                  src={featured.coverImage}
                  alt={featured.coverImageAlt ?? featured.title}
                  width={800}
                  height={420}
                  className="featured-card__img"
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              )}
              <div className="featured-card__body">
                <div className="post-card__cat">
                  FEATURED · {cycleLabel(featured.cycle).toUpperCase()}
                </div>
                <h2 className="section-title" style={{ fontSize: 'clamp(24px,2.8vw,32px)', lineHeight: 1.3, margin: '14px 0 0' }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize: 'clamp(17px,1.7vw,19px)', lineHeight: 1.65, color: 'var(--text-65)', margin: '14px 0 0' }}>
                  {featured.excerpt}
                </p>
                <span style={{ fontSize: 18, color: 'var(--gold)', margin: '22px 0 0', display: 'inline-block' }}>
                  Read the Key →
                </span>
              </div>
            </Link>
          </div>
        )}

        <BlogFilter posts={rest} />
      </main>

      <Footer />
    </>
  );
}
