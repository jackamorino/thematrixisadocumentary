import type { Heading } from '@/lib/toc';

/** Anchor-linked table of contents, rendered only when a post has enough headings. */
export function Toc({ headings }: { headings: Heading[] }) {
  return (
    <nav className="toc" aria-label="Table of contents">
      <p className="toc__title">In this essay</p>
      <ol className="toc__list">
        {headings.map((h) => (
          <li
            key={h.id}
            className={`toc__item${h.level === 3 ? ' toc__item--sub' : ''}`}
          >
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
