'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Tag } from '@/components/ui/Tag'
import type { CaseStudy } from '@/sanity/queries'

const FALLBACK: CaseStudy[] = [
  { _id: '1', client: 'Telefónica',        engagement: 'Telco brand positioning',         engagementEs: 'Posicionamiento de marca telco',                    lesson: 'Brand and narrative consistency from inside a major Spanish telecommunications operator',               lessonEs: 'Consistencia de marca y narrativa desde dentro de un importante operador español de telecomunicaciones',        tags: ['Telecom', 'In-house'] },
  { _id: '2', client: 'Back Market',        engagement: 'Regulation as narrative',          engagementEs: 'La regulación como narrativa',                       lesson: 'Public authority around right-to-repair and EU sustainability legislation',                                lessonEs: 'Autoridad pública en torno al derecho a reparar y la legislación de sostenibilidad de la UE',                   tags: ['Regulatory', 'EU Tech'] },
  { _id: '3', client: 'Konecta',            engagement: 'Contact-centre at scale',          engagementEs: 'Contact centre a escala',                             lesson: 'Corporate narrative and service communications for a global contact-centre operator',                         lessonEs: 'Narrativa corporativa y comunicación de servicios para un operador global de contact centre',                    tags: ['B2B', 'In-house'] },
  { _id: '4', client: 'Chiliz',             engagement: 'Reputation in high-noise markets', engagementEs: 'Reputación en mercados de alta intensidad',            lesson: 'Communications across APAC, EMEA and LATAM in a category where trust is fragile by default',                   lessonEs: 'Comunicaciones en APAC, EMEA y LATAM en una categoría donde la confianza es frágil por defecto',                tags: ['Sports Tech', 'International'] },
  { _id: '5', client: 'Critical Software',  engagement: 'Critical infrastructure',          engagementEs: 'Infraestructura crítica',                              lesson: 'Expert positioning for a complex international technology account in critical infrastructure',                   lessonEs: 'Posicionamiento experto para una cuenta tecnológica internacional compleja en infraestructuras críticas',         tags: ['B2B Tech', 'Cross-Atlantic'] },
  { _id: '6', client: 'Ironhack',           engagement: 'Localising a US-born brand',       engagementEs: 'Localización de una marca de origen estadounidense', lesson: 'Brand positioning and visibility for European expansion — adapting US narrative for local audiences',            lessonEs: 'Posicionamiento de marca y visibilidad para la expansión europea — adaptando la narrativa estadounidense para audiencias locales', tags: ['Education', 'Market Entry'] },
]

interface WorkTableProps {
  data: CaseStudy[]
  locale: string
}

export function WorkTable({ data, locale }: WorkTableProps) {
  const t = useTranslations('work')
  const [hovered, setHovered] = useState<string | null>(null)
  const es = locale === 'es'
  const rows = data.length > 0 ? data : FALLBACK

  return (
    <section id="work" className="py-[120px]" style={{ background: 'var(--bg-elev-1, #131218)' }}>
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
            {t('headlineTail')}
          </h2>
        </div>

        <div className="border-t border-[var(--rule-strong)]">
          {/* Table header */}
          <div
            className="grid gap-12 py-[18px] border-b border-[var(--rule-strong)] text-[11px] font-semibold tracking-[0.1em] uppercase text-ink-300"
            style={{ gridTemplateColumns: '180px 1.2fr 2fr 1fr', fontFamily: 'var(--font-title)' }}
          >
            <div>{t('colClient')}</div>
            <div>{t('colEngagement')}</div>
            <div>{t('colLesson')}</div>
            <div>{t('colTags')}</div>
          </div>

          {rows.map((row) => {
            const isHovered = hovered === row._id
            const engagement = es ? (row.engagementEs ?? row.engagement) : row.engagement
            const lesson = es ? (row.lessonEs ?? row.lesson) : row.lesson

            return (
              <div
                key={row._id}
                onMouseEnter={() => setHovered(row._id)}
                onMouseLeave={() => setHovered(null)}
                className="grid gap-12 py-8 items-baseline border-b border-[var(--rule)] cursor-pointer transition-all duration-200"
                style={{
                  gridTemplateColumns: '180px 1.2fr 2fr 1fr',
                  background: isHovered ? 'rgba(190,186,204,0.03)' : 'transparent',
                  paddingLeft: isHovered ? '16px' : '0',
                  marginLeft: isHovered ? '-16px' : '0',
                }}
              >
                <div
                  className="text-[14px] font-semibold tracking-[0.04em] transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-title)', color: isHovered ? '#BEBACC' : 'var(--fg-1)' }}
                >
                  {row.client}
                </div>
                <div className="text-[20px] leading-[1.25] tracking-[-0.015em] font-semibold text-bone-50" style={{ fontFamily: 'var(--font-title)' }}>
                  {engagement}
                </div>
                <div className="text-[15px] leading-[1.55] text-ink-200" style={{ fontFamily: 'var(--font-body)' }}>
                  {lesson}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {(row.tags ?? []).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
