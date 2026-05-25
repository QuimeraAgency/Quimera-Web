'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

declare global {
  interface Window {
    Tally?: {
      openPopup: (formId: string, options?: Record<string, unknown>) => void
      loadEmbeds: () => void
    }
  }
}

const TALLY_FORM_ID = process.env.NEXT_PUBLIC_TALLY_FORM_ID ?? ''

export function ContactBlock() {
  const t = useTranslations('contact')

  useEffect(() => {
    if (!TALLY_FORM_ID) return
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.async = true
    script.onload = () => window.Tally?.loadEmbeds()
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  return (
    <section id="contact" className="py-[120px] bg-bone-50 text-ink-950">
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
            {t('headline')}
            <br />
            <em className="not-italic text-lav-600">{t('headlineAccent')}</em>
          </h2>
        </div>

        <div className="grid gap-24 items-start" style={{ gridTemplateColumns: '1fr 1.2fr' }}>
          {/* Left: contact details */}
          <div className="flex flex-col gap-8">
            <div>
              <div className="text-[12px] font-semibold tracking-[0.08em] uppercase text-ink-500 mb-2" style={{ fontFamily: 'var(--font-title)' }}>
                {t('leadPartnerLabel')}
              </div>
              <div className="text-[28px] leading-[1.2] tracking-[-0.015em] font-semibold text-ink-950" style={{ fontFamily: 'var(--font-title)' }}>
                Mariola Montoya
              </div>
              <div className="text-[14px] text-ink-500 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                C.E.O. · Quimera Agency
              </div>
            </div>

            <div>
              <div className="text-[12px] font-semibold tracking-[0.08em] uppercase text-ink-500 mb-2" style={{ fontFamily: 'var(--font-title)' }}>
                {t('directLabel')}
              </div>
              <a
                href="tel:+34689006720"
                className="font-mono text-[20px] text-ink-950 hover:text-lav-600 transition-colors duration-200"
              >
                +34 689 00 67 20
              </a>
            </div>

            <div>
              <div className="text-[12px] font-semibold tracking-[0.08em] uppercase text-ink-500 mb-2" style={{ fontFamily: 'var(--font-title)' }}>
                {t('officeLabel')}
              </div>
              <div className="text-[16px] text-ink-950 leading-[1.5]" style={{ fontFamily: 'var(--font-body)' }}>
                {t('officeAddress')}<br />{t('officeCountry')}
              </div>
              <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-500 mt-1.5" style={{ fontFamily: 'var(--font-title)' }}>
                {t('byAppointment')}
              </div>
            </div>
          </div>

          {/* Right: Tally form or inline form fallback */}
          <div
            className="rounded-md p-10 flex flex-col gap-5"
            style={{ background: 'var(--bg-paper-elev)', border: '1px solid var(--rule-paper)' }}
          >
            {TALLY_FORM_ID ? (
              <iframe
                data-tally-src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
                loading="lazy"
                width="100%"
                height="500"
                frameBorder={0}
                title="Contact form"
                className="w-full min-h-[420px]"
              />
            ) : (
              <InlineForm t={t} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function InlineForm({ t }: { t: ReturnType<typeof useTranslations<'contact'>> }) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-5"
    >
      <Field label={t('nameLabel')} id="name" placeholder={t('namePlaceholder')} />
      <Field label={t('orgLabel')} id="org" placeholder={t('orgPlaceholder')} />
      <Field
        label={t('contextLabel')}
        id="context"
        placeholder={t('contextPlaceholder')}
        as="textarea"
        rows={4}
      />
      <div className="flex justify-between items-center pt-2">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-500">
          {t('disclaimer')}
        </span>
        <button
          type="submit"
          className="group inline-flex items-center gap-2.5 px-[22px] py-3 text-[13px] font-medium bg-ink-950 text-bone-50 rounded-md border border-transparent transition-all duration-200 hover:-translate-y-px"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {t('submit')}
          <span className="font-mono transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </button>
      </div>
    </form>
  )
}

function Field({
  label, id, placeholder, as = 'input', rows,
}: {
  label: string; id: string; placeholder: string; as?: 'input' | 'textarea'; rows?: number
}) {
  const base =
    'w-full text-[15px] px-3.5 py-3 bg-transparent border rounded-md text-ink-950 outline-none transition-colors duration-200 focus:border-ink-600 placeholder:text-ink-400'
  const borderStyle = { border: '1px solid var(--rule-paper-strong)' }
  const cls = `${base} font-body resize-vertical`

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[12px] font-semibold tracking-[0.08em] uppercase text-ink-500 mb-2"
        style={{ fontFamily: 'var(--font-title)' }}
      >
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea id={id} placeholder={placeholder} rows={rows} className={cls} style={{ ...borderStyle, minHeight: '120px' }} />
      ) : (
        <input id={id} type="text" placeholder={placeholder} className={cls} style={borderStyle} />
      )}
    </div>
  )
}
