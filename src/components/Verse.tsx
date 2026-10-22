import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react';
import Link from 'next/link';

/**
 * Renders article body. The Keys are verse-like — line breaks are meaningful and
 * must be preserved. Seed content arrives as a plain string (paragraphs split on
 * blank lines, <br> on single newlines). Sanity content arrives as Portable Text.
 *
 * `headingIds` maps each heading block's `_key` to its anchor id so the table of
 * contents links line up with the rendered h2/h3 (see src/lib/toc.ts).
 */
export function Verse({
  verse,
  body,
  headingIds = {},
}: {
  verse?: string;
  body?: PortableTextBlock[];
  headingIds?: Record<string, string>;
}) {
  if (body && body.length) {
    const components: PortableTextComponents = {
      block: {
        h2: ({ value, children }) => (
          <h2 className="article-h2" id={value._key ? headingIds[value._key] : undefined}>
            {children}
          </h2>
        ),
        h3: ({ value, children }) => (
          <h3 className="article-h3" id={value._key ? headingIds[value._key] : undefined}>
            {children}
          </h3>
        ),
      },
      marks: {
        link: ({ value, children }) => {
          const href: string = value?.href ?? '#';
          const external = /^https?:\/\//.test(href);
          return external ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ) : (
            <Link href={href}>{children}</Link>
          );
        },
      },
    };

    return (
      <div className="article-prose">
        <PortableText value={body} components={components} />
      </div>
    );
  }

  if (!verse) return null;

  const paragraphs = verse.trim().split(/\n\s*\n/);
  const lastIndex = paragraphs.length - 1;

  return (
    <div className="article-prose">
      {paragraphs.map((para, pi) => {
        const lines = para.split('\n');
        // The final paragraph in a Key is often the italic closing question.
        const isClosing = pi === lastIndex && lines.length === 1;
        return (
          <p key={pi} style={isClosing ? { fontStyle: 'italic', color: 'var(--gold-bright)' } : undefined}>
            {lines.map((line, li) => (
              <span key={li}>
                {line}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
