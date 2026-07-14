import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — see structure.ts
  fields: [
    defineField({
      name: 'showVideos',
      title: 'Show Videos',
      type: 'boolean',
      description:
        'Feature flag. When off, the homepage video band and /videos content are hidden (launch state).',
      initialValue: false,
    }),
    defineField({
      name: 'signupHeadline',
      title: 'Signup Headline',
      type: 'string',
      initialValue: 'Read the beginning free',
    }),
    defineField({
      name: 'signupBlurb',
      title: 'Signup Blurb',
      type: 'text',
      rows: 3,
      initialValue:
        "Get the Prologue and Chapter One — Love's Whisper — in your inbox, plus new Keys as they're left behind.",
    }),
    defineField({
      name: 'buyLinks',
      title: 'Buy Links',
      type: 'object',
      fields: [
        defineField({ name: 'amazon', title: 'Amazon URL', type: 'url' }),
        defineField({ name: 'apple', title: 'Apple Books URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
});
