import type { SchemaTypeDefinition } from 'sanity';

import { author } from './author';
import { post } from './post';
import { seo } from './seo';
import { siteSettings } from './siteSettings';
import { video } from './video';

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  video,
  author,
  siteSettings,
  seo,
];
