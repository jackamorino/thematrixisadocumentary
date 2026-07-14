import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { client } from './client';

const builder = imageUrlBuilder(client);

export function urlForImage(source: SanityImageSource | undefined | null) {
  return source ? builder.image(source) : null;
}

/** Convenience: a plain string URL at a target width, or null when there's no image. */
export function imageUrl(
  source: SanityImageSource | undefined | null,
  width = 1200
): string | null {
  const u = urlForImage(source);
  return u ? u.width(width).auto('format').fit('max').url() : null;
}
