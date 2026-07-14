import { PortableText, type PortableTextBlock } from '@portabletext/react';

/**
 * Renders article body. The Keys are verse-like — line breaks are meaningful and
 * must be preserved. Seed content arrives as a plain string (paragraphs split on
 * blank lines, <br> on single newlines). Sanity content arrives as Portable Text.
 */
export function Verse({
  verse,
  body,
}: {
  verse?: string;
  body?: PortableTextBlock[];
}) {
  if (body && body.length) {
    return (
      <div className="article-prose">
        <PortableText value={body} />
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
