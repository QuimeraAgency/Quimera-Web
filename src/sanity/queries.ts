import { sanityClient } from './client'

export type PerspectivePost = {
  _id: string
  eyebrow: string | null
  eyebrowEs: string | null
  title: string
  titleEs: string | null
  slug: { current: string }
  date: string
  readTime: number | null
}

export type CaseStudy = {
  _id: string
  client: string
  engagement: string
  engagementEs: string | null
  lesson: string
  lessonEs: string | null
  tags: string[]
}

export type Service = {
  _id: string
  order: number
  number: string
  verb: string
  verbEs: string | null
  title: string
  titleEs: string | null
  lede: string
  ledeEs: string | null
  body: string
  bodyEs: string | null
  includes: string[]
  includesEs: string[] | null
  differentiator: string
  differentiatorEs: string | null
}

export type ManifestoDoc = {
  _id: string
  headline: string
  headlineAccent: string
  col1Title: string; col1Lead: string; col1Body: string
  col2Title: string; col2Lead: string; col2Body: string
  col3Title: string; col3Lead: string; col3Body: string
  pullQuote: string
  pullQuoteAttrib: string
  headlineEs: string | null; headlineAccentEs: string | null
  col1TitleEs: string | null; col1LeadEs: string | null; col1BodyEs: string | null
  col2TitleEs: string | null; col2LeadEs: string | null; col2BodyEs: string | null
  col3TitleEs: string | null; col3LeadEs: string | null; col3BodyEs: string | null
  pullQuoteEs: string | null
  pullQuoteAttribEs: string | null
}

export async function getPerspectivePosts(): Promise<PerspectivePost[]> {
  return sanityClient.fetch(
    `*[_type == "perspective"] | order(date desc) { _id, eyebrow, eyebrowEs, title, titleEs, slug, date, readTime }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return sanityClient.fetch(
    `*[_type == "caseStudy"] | order(order asc) { _id, client, engagement, engagementEs, lesson, lessonEs, tags }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getServices(): Promise<Service[]> {
  return sanityClient.fetch(
    `*[_type == "service"] | order(order asc) { _id, order, number, verb, verbEs, title, titleEs, lede, ledeEs, body, bodyEs, includes, includesEs, differentiator, differentiatorEs }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getManifesto(): Promise<ManifestoDoc | null> {
  const results = await sanityClient.fetch(
    `*[_type == "manifesto"][0] { ... }`,
    {},
    { next: { revalidate: 60 } }
  )
  return results ?? null
}
