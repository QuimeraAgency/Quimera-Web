import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'manifesto',
  title: 'Manifesto',
  type: 'document',
  // singleton — only one document
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'headlineAccent', title: 'Headline accent (lavender)', type: 'string' }),
    defineField({ name: 'col1Title', title: 'Column 1 — Title', type: 'string' }),
    defineField({ name: 'col1Lead', title: 'Column 1 — Lead sentence', type: 'text', rows: 2 }),
    defineField({ name: 'col1Body', title: 'Column 1 — Body', type: 'text', rows: 4 }),
    defineField({ name: 'col2Title', title: 'Column 2 — Title', type: 'string' }),
    defineField({ name: 'col2Lead', title: 'Column 2 — Lead sentence', type: 'text', rows: 2 }),
    defineField({ name: 'col2Body', title: 'Column 2 — Body', type: 'text', rows: 4 }),
    defineField({ name: 'col3Title', title: 'Column 3 — Title', type: 'string' }),
    defineField({ name: 'col3Lead', title: 'Column 3 — Lead sentence', type: 'text', rows: 2 }),
    defineField({ name: 'col3Body', title: 'Column 3 — Body', type: 'text', rows: 4 }),
    defineField({ name: 'pullQuote', title: 'Pull quote', type: 'text', rows: 3 }),
    defineField({ name: 'pullQuoteAttrib', title: 'Pull quote attribution', type: 'string' }),
    // Spanish
    defineField({ name: 'headlineEs', title: 'Headline (ES)', type: 'string' }),
    defineField({ name: 'headlineAccentEs', title: 'Headline accent (ES)', type: 'string' }),
    defineField({ name: 'col1TitleEs', title: 'Column 1 Title (ES)', type: 'string' }),
    defineField({ name: 'col1LeadEs', title: 'Column 1 Lead (ES)', type: 'text', rows: 2 }),
    defineField({ name: 'col1BodyEs', title: 'Column 1 Body (ES)', type: 'text', rows: 4 }),
    defineField({ name: 'col2TitleEs', title: 'Column 2 Title (ES)', type: 'string' }),
    defineField({ name: 'col2LeadEs', title: 'Column 2 Lead (ES)', type: 'text', rows: 2 }),
    defineField({ name: 'col2BodyEs', title: 'Column 2 Body (ES)', type: 'text', rows: 4 }),
    defineField({ name: 'col3TitleEs', title: 'Column 3 Title (ES)', type: 'string' }),
    defineField({ name: 'col3LeadEs', title: 'Column 3 Lead (ES)', type: 'text', rows: 2 }),
    defineField({ name: 'col3BodyEs', title: 'Column 3 Body (ES)', type: 'text', rows: 4 }),
    defineField({ name: 'pullQuoteEs', title: 'Pull quote (ES)', type: 'text', rows: 3 }),
    defineField({ name: 'pullQuoteAttribEs', title: 'Pull quote attribution (ES)', type: 'string' }),
  ],
  preview: { select: { title: 'headline' } },
})
