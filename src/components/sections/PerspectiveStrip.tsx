import { useTranslations } from 'next-intl'
import type { PerspectivePost } from '@/sanity/queries'

const FALLBACK: PerspectivePost[] = [
  { _id: '1', eyebrow: 'On Gravity',    eyebrowEs: 'Sobre la gravedad',    title: 'Most agencies optimise attention. We are interested in gravity.',                                             titleEs: 'La mayoría de las agencias optimizan la atención. Nosotros nos interesamos por la gravedad.',        slug: { current: 'on-gravity' },    date: '2026-04-01', readTime: 6 },
  { _id: '2', eyebrow: 'On Signals',    eyebrowEs: 'Sobre las señales',    title: 'Signals accumulate into perception long before they become analysis.',                                         titleEs: 'Las señales se acumulan en percepción mucho antes de convertirse en análisis.',                       slug: { current: 'on-signals' },    date: '2026-03-01', readTime: 7 },
  { _id: '3', eyebrow: 'On Neutrality', eyebrowEs: 'Sobre la neutralidad', title: 'Every company already communicates a worldview. The question is whether it is intentional.',                  titleEs: 'Toda empresa ya comunica una visión del mundo. La pregunta es si es intencional.',                    slug: { current: 'on-neutrality' }, date: '2026-02-01', readTime: 5 },
]

interface PerspectiveStripProps {
  data: PerspectivePost[]
  locale: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear()).slice(2)
  return `${month} / ${year}`
}

export function PerspectiveStrip({ data, locale }: PerspectiveStripProps) {
  const t = useTranslations('perspective')
  const es = locale === 'es'
  const articles = data.length > 0 ? data : FALLBACK

  return (
    <section id="perspective" className="py-[120px]" style={{ background: 'var(--bg-elev-1, #131218)' }}>
      <div className="max-w-[1400px] mx-auto px-12">
        {/* Section header */}
        <div className="grid grid-cols-[1fr_2fr] gap-20 items-baseline mb-20">
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-ink-300" style={{ fontFamily: 'var(--font-title)' }}>
              {t('sectionNum')}
            </span>
            <span className="text-[13px] font-semibold tracking-[0.08em] uppercase text-lav-300" style={{ fontFamily: 'var(--font-title)' }}>
              {t('eyebrow')}
            </span>
          </div>
          <h2
            className="text-[56px] leading-[1.08] tracking-[-0.025em] font-bold max-w-[1000px]"
            style={{ fontFamily: 'var(--font-title)', textWrap: 'balance' } as React.CSSProperties}
          >
            {t('headline')}{' '}
            <em className="not-italic text-lav-300">{t('headlineAccent')}</em>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6">
          {articles.map((article) => {
            const eyebrow = es ? (article.eyebrowEs ?? article.eyebrow) : article.eyebrow
            const title   = es ? (article.titleEs   ?? article.title)   : article.title

            return (
              <a
                key={article._id}
                href={`#perspective/${article.slug?.current}`}
                className="flex flex-col justify-between min-h-[320px] p-8 bg-ink-900 border border-[var(--rule)] rounded-md transition-all duration-200 hover:border-[var(--rule-strong)] hover:shadow-[0_24px_60px_-16px_rgba(14,13,18,0.32)] group"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-300" style={{ fontFamily: 'var(--font-title)' }}>
                      {eyebrow}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.14em] text-ink-300">
                      {formatDate(article.date)}
                    </span>
                  </div>
                  <h3
                    className="text-[22px] leading-[1.25] tracking-[-0.015em] font-semibold text-bone-50"
                    style={{ fontFamily: 'var(--font-title)' }}
                  >
                    {title}
                  </h3>
                </div>

                <div className="flex justify-between items-center border-t border-[var(--rule)] pt-4 mt-6">
                  <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-300">
                    {article.readTime} min {t('readSuffix')}
                  </span>
                  <span className="font-mono text-lav-300 transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
