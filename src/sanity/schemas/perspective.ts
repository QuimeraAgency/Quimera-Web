import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'perspective',
  title: 'Perspective',
  type: 'document',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'date', validation: r => r.required() }),
    defineField({ name: 'readTime', title: 'Read time (minutes)', type: 'number' }),
    defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'eyebrowEs', title: 'Eyebrow (ES)', type: 'string' }),
    defineField({ name: 'titleEs', title: 'Title (ES)', type: 'string' }),
    defineField({ name: 'bodyEs', title: 'Body (ES)', type: 'array', of: [{ type: 'block' }] }),
  ],
  orderings: [{ title: 'Newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'date' } },
})
