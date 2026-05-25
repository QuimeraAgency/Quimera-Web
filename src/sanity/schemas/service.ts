import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'order', title: 'Order', type: 'number', validation: r => r.required() }),
    defineField({ name: 'number', title: 'Number label (e.g. 01)', type: 'string' }),
    defineField({ name: 'verb', title: 'Verb (DEFINE / ACTIVATE / SUSTAIN)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'lede', title: 'Lede', type: 'text', rows: 2 }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
    defineField({ name: 'includes', title: 'Includes list', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'differentiator', title: 'Differentiator', type: 'text', rows: 2 }),
    defineField({ name: 'verbEs', title: 'Verb (ES)', type: 'string' }),
    defineField({ name: 'titleEs', title: 'Title (ES)', type: 'string' }),
    defineField({ name: 'ledeEs', title: 'Lede (ES)', type: 'text', rows: 2 }),
    defineField({ name: 'bodyEs', title: 'Body (ES)', type: 'text', rows: 4 }),
    defineField({ name: 'includesEs', title: 'Includes list (ES)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'differentiatorEs', title: 'Differentiator (ES)', type: 'text', rows: 2 }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'verb', subtitle: 'title' } },
})
