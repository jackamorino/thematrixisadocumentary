'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

/**
 * Embedded Studio config, mounted at /studio in the Next app.
 * projectId falls back to a placeholder so the app builds before the CMS exists;
 * set NEXT_PUBLIC_SANITY_PROJECT_ID to use the real project.
 */
// Embedded in the Next app the studio lives at /studio. When deployed standalone to
// <host>.sanity.studio it must mount at root — pass SANITY_STUDIO_BASEPATH=/ for that.
const basePath = process.env.SANITY_STUDIO_BASEPATH || '/studio';

export default defineConfig({
  name: 'thematrixisadocumentary',
  title: 'The Matrix is a Documentary',
  basePath,
  projectId: projectId || 'placeholder',
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
