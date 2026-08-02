import { defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Blog Post (Key)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cycle',
      title: 'Theme',
      type: 'string',
      description: 'Shown on the site as the post category (plain theme names, no Cycle numbering).',
      options: {
        list: [
          { title: 'Cracks in the World', value: 'cycle1' },
          { title: 'Hidden Histories', value: 'cycle2' },
          { title: 'The Inner Cages', value: 'cycle3' },
          { title: 'The Key of Love', value: 'lastKey' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown in cards, previews, RSS, and search results.',
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Emphasis', value: 'em' },
              { title: 'Strong', value: 'strong' },
            ],
          },
        },
      ],
      description:
        'The Keys are verse-like — preserve line breaks. Use soft returns within a block.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'cycle', media: 'coverImage' },
  },
});
