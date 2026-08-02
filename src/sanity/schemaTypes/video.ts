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
      description: 'The id after watch?v= (e.g. dQw4w9WgXcQ).',
      validation: (r) => r.required(),
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
