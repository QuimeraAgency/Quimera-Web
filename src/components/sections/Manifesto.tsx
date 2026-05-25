import { useTranslations } from 'next-intl'
import type { ManifestoDoc } from '@/sanity/queries'

interface ManifestoProps {
  data: ManifestoDoc | null
  locale: string
}

export function Manifesto({ data, locale }: ManifestoProps) {
  const t = useTranslations('manifesto')
  const es = locale === 'es'

  const cols = [
    {
      title: es ? (data?.col1TitleEs ?? t('col1Title')) : t('col1Title'),
      lead:  es ? (data?.col1LeadEs ?? t('col1Lead'))  : t('col1Lead'),
      body:  es ? (data?.col1BodyEs ?? t('col1Body'))  : t('col1Body'),
    },
    {
      title: es ? (data?.col2TitleEs ?? t('col2Title')) : t('col2Title'),
      lead:  es ? (data?.col2LeadEs ?? t('col2Lead'))  : t('col2Lead'),
      body:  es ? (data?.col2BodyEs ?? t('col2Body'))  : t('col2Body'),
    },
    {
      title: es ? (data?.col3TitleEs ?? t('col3Title')) : t('col3Title'),
      lead:  es ? (data?.col3LeadEs ?? t('col3Lead'))  : t('col3Lead'),
      body:  es ? (data?.col3BodyEs ?? t('col3Body'))  : t('col3Body'),
    },
  ]

  const pullQuote = es ? (data?.pullQuoteEs ?? t('pullQuote')) : t('pullQuote')
  const pullAttrib = es ? (data?.pullQuoteAttribEs ?? t('pullQuoteAttrib')) : t('pullQuoteAttrib')
  const headline = es ? (data?.headlineEs ?? t('headline')) : t('headline')
  const headlineAccent = es ? (data?.headlineAccentEs ?? t('headlineAccent')) : t('headlineAccent')

  return (
    <section id="manifesto" className="py-[120px] relative bg-bone-50 text-ink-950">
      <div className="max-w-[1400px] mx-auto px-12">
        {/* Section header */}
        <div className="grid grid-cols-[1fr_2fr] gap-20 items-baseline mb-20">
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-ink-500" style={{ fontFamily: 'var(--font-title)' }}>
              {t('sectionNum')}
            </span>
            <span className="text-[13px] font-semibold tracking-[0.08em] uppercase text-lav-600" style={{ fontFamily: 'var(--font-title)' }}>
              {t('eyebrow')}
            </span>
          </div>
          <h2
            className="text-[56px] leading-[1.08] tracking-[-0.025em] font-bold max-w-[1000px]"
            style={{ fontFamily: 'var(--font-title)', textWrap: 'balance' } as React.CSSProperties}
          >
            {headline}{' '}
            <em className="not-italic text-lav-600">{headlineAccent}</em>
            {t('headlineTail')}
          </h2>
        </div>

        {/* Three columns */}
        <div
          className="grid grid-cols-3 gap-12 border-t pt-14"
          style={{ borderColor: 'var(--rule-paper-strong)' }}
        >
          {cols.map((col, i) => (
            <div key={i} className="flex flex-col gap-5">
              <div className="text-[12px] font-semibold tracking-[0.12em] uppercase text-lav-600" style={{ fontFamily: 'var(--font-title)' }}>
                {col.title}
              </div>
              <div className="text-[22px] leading-[1.3] tracking-[-0.015em] font-semibold text-ink-950" style={{ fontFamily: 'var(--font-title)' }}>
                {col.lead}
              </div>
              <div className="text-[15px] leading-[1.65] text-ink-600" style={{ fontFamily: 'var(--font-body)' }}>
                {col.body}
              </div>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <div
          className="mt-24 pt-12 border-t flex justify-between items-baseline gap-16"
          style={{ borderColor: 'var(--rule-paper)' }}
        >
          <div
            className="text-[32px] leading-[1.2] tracking-[-0.02em] font-semibold text-ink-950 max-w-[760px]"
            style={{ fontFamily: 'var(--font-title)' }}
          >
            {pullQuote}
          </div>
          <div
            className="text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-500 whitespace-nowrap"
            style={{ fontFamily: 'var(--font-title)' }}
          >
            {pullAttrib}
          </div>
        </div>
      </div>
    </section>
  )
}
