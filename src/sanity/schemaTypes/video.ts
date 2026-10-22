import { defineField, defineType } from 'sanity';

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description:
        'The id after watch?v= for a standard video, or after /shorts/ for a Short.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      description: 'Shorts render vertical (9:16) in their own row.',
      options: {
        list: [
          { title: 'Standard (16:9)', value: 'standard' },
          { title: 'Short (9:16)', value: 'short' },
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'cycle',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Cracks in the World', value: 'cycle1' },
          { title: 'Hidden Histories', value: 'cycle2' },
          { title: 'The Inner Cages', value: 'cycle3' },
          { title: 'The Key of Love', value: 'lastKey' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured (latest upload)',
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
  ],
  preview: {
    select: { title: 'title', subtitle: 'cycle' },
  },
});
