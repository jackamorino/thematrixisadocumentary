import type { PortableTextBlock } from '@portabletext/react';

export interface Heading {
  /** The Portable Text block `_key`, used to match the rendered heading's id. */
  key: string;
  /** Unique anchor id (slug of the heading text). */
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface Span {
  _type: string;
  text?: string;
}

/**
 * Pulls h2/h3 headings out of a Portable Text body and assigns each a stable, unique
 * anchor id. The returned `key -> id` mapping is what the body renderer uses, so the
 * table-of-contents links and the on-page heading ids always match.
 */
export function extractHeadings(body?: PortableTextBlock[]): Heading[] {
  if (!body) return [];
  const used = new Map<string, number>();
  const headings: Heading[] = [];

  for (const block of body) {
    if (block._type !== 'block') continue;
    const style = (block as { style?: string }).style;
    if (style !== 'h2' && style !== 'h3') continue;

    const children = (block as { children?: Span[] }).children ?? [];
    const text = children
      .filter((c) => c._type === 'span' && typeof c.text === 'string')
      .map((c) => c.text)
      .join('')
      .trim();
    if (!text) continue;

    const base = slugify(text) || 'section';
    const seen = used.get(base) ?? 0;
    used.set(base, seen + 1);
    const id = seen === 0 ? base : `${base}-${seen + 1}`;

    headings.push({
      key: (block as { _key?: string })._key ?? id,
      id,
      text,
      level: style === 'h2' ? 2 : 3,
    });
  }

  return headings;
}

/** Convenience: the `_key -> id` map the body renderer needs. */
export function headingIdMap(headings: Heading[]): Record<string, string> {
  return Object.fromEntries(headings.map((h) => [h.key, h.id]));
}
