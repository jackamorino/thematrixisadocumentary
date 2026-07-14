import Image from 'next/image';
import Link from 'next/link';

import { cycleLabel } from '@/lib/site';
import type { Post } from '@/lib/types';

/** Compact post card used in the blog grid, homepage blog preview, and "More Keys". */
export function PostCard({
  post,
  showExcerpt = false,
  imageHeight = 200,
}: {
  post: Post;
  showExcerpt?: boolean;
  imageHeight?: number;
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="post-card">
      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={600}
          height={imageHeight}
          className="post-card__img"
          style={{ height: imageHeight }}
          sizes="(max-width: 700px) 100vw, 33vw"
        />
      )}
      <div className="post-card__body">
        <div className="post-card__cat">{cycleLabel(post.cycle).toUpperCase()}</div>
        <div className="post-card__title">{post.title}</div>
        {showExcerpt && <div className="post-card__excerpt">{post.excerpt}</div>}
      </div>
    </Link>
  );
}
