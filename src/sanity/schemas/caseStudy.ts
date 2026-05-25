import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'client', title: 'Client', type: 'string', validation: r => r.required() }),
    defineField({ name: 'engagement', title: 'Engagement title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'lesson', title: 'What it taught us', type: 'text', rows: 3, validation: r => r.required() }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'order', title: 'Display order', type: 'number' }),
    defineField({ name: 'engagementEs', title: 'Engagement title (ES)', type: 'string' }),
    defineField({ name: 'lessonEs', title: 'What it taught us (ES)', type: 'text', rows: 3 }),
  ],
  orderings: [{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'client', subtitle: 'engagement' } },
})
