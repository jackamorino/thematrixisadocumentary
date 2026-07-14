import { defineField, defineType } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      initialValue: 'Jack Amorino',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      description: 'One entry per paragraph. Verbatim from the manuscript.',
    }),
    defineField({
      name: 'quote',
      title: 'Signature Quote',
      type: 'text',
      rows: 3,
      initialValue: 'Love is the Key.\nAll others unlock doors,\nbut this one unlocks you.',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'name', media: 'photo' },
  },
});
