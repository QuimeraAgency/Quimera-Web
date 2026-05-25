import { useTranslations } from 'next-intl'
import type { Service } from '@/sanity/queries'

// Fallback data (used when Sanity returns nothing)
const FALLBACK_SERVICES = [
  {
    _id: '1', order: 1, number: '01', verb: 'DEFINE', verbEs: 'DEFINIR',
    title: 'Narrative & positioning strategy',
    titleEs: 'Estrategia de narrativa y posicionamiento',
    lede: 'What gets built before visibility scales. The layer that shapes interpretation before the market defines it for you.',
    ledeEs: 'Lo que se construye antes de que la visibilidad escale. La capa que da forma a la interpretación antes de que el mercado la defina por ti.',
    body: 'We define how the company, its leadership and its ambitions should be interpreted — and build the communication architecture capable of sustaining that interpretation over time.',
    bodyEs: 'Definimos cómo la empresa, su liderazgo y sus ambiciones deben ser interpretados — y construimos la arquitectura de comunicación capaz de sostener esa interpretación a lo largo del tiempo.',
    includes: ['Corporate narrative understanding','Positioning strategy & messaging architecture','Executive positioning','Market localisation & narrative adaptation','Communication criteria & exposure frameworks','Guidance around sensitive topics','Internal communication alignment'],
    includesEs: ['Comprensión de la narrativa corporativa','Estrategia de posicionamiento y arquitectura de mensajes','Posicionamiento ejecutivo','Localización y adaptación narrativa al mercado','Criterios de comunicación y marcos de exposición','Orientación sobre temas sensibles','Alineación de comunicación interna'],
    differentiator: 'Translation of complexity into public legibility. Narrative systems designed for long-term reputational compounding.',
    differentiatorEs: 'Traducción de la complejidad en legibilidad pública. Sistemas narrativos diseñados para la composición reputacional a largo plazo.',
  },
  {
    _id: '2', order: 2, number: '02', verb: 'ACTIVATE', verbEs: 'ACTIVAR',
    title: 'Media & strategic presence',
    titleEs: 'Medios y presencia estratégica',
    lede: 'What we proactively communicate. Strategic visibility with direction, timing and criteria — even when the decision is not to participate.',
    ledeEs: 'Lo que comunicamos proactivamente. Visibilidad estratégica con dirección, timing y criterio — incluso cuando la decisión es no participar.',
    body: 'We activate visibility selectively through media, public positioning and strategic participation. Not everything has to be public, but relationships must be built.',
    bodyEs: 'Activamos la visibilidad de forma selectiva a través de los medios, el posicionamiento público y la participación estratégica. No todo tiene que ser público, pero las relaciones deben construirse.',
    includes: ['Strategic media relations','Press releases & strategic announcements','Launch, fundraising & partnership communications','Executive communications support','Interview, podcast & panel preparation','Speaking opportunity advisory & management','Research & insight amplification'],
    includesEs: ['Relaciones con medios estratégicos','Comunicados de prensa y anuncios estratégicos','Comunicaciones de lanzamiento, fundraising y alianzas','Apoyo en comunicaciones ejecutivas','Preparación para entrevistas, podcasts y paneles','Asesoría y gestión de oportunidades de conferencias','Amplificación de investigación e insights'],
    differentiator: 'Visibility calibrated around strategic timing. Selective rather than volume-driven media logic.',
    differentiatorEs: 'Visibilidad calibrada en torno al timing estratégico. Lógica mediática selectiva, no basada en volumen.',
  },
  {
    _id: '3', order: 3, number: '03', verb: 'SUSTAIN', verbEs: 'SOSTENER',
    title: 'Reputation & strategic advisory',
    titleEs: 'Reputación y asesoría estratégica',
    lede: 'What preserves coherence as visibility, scrutiny and complexity increase. Guidance for maintaining trust over time.',
    ledeEs: 'Lo que preserva la coherencia a medida que aumentan la visibilidad, el escrutinio y la complejidad. Orientación para mantener la confianza a lo largo del tiempo.',
    body: 'We help organisations navigate growth, visibility and sensitive moments without losing narrative coherence, institutional trust or strategic positioning.',
    bodyEs: 'Ayudamos a las organizaciones a navegar el crecimiento, la visibilidad y los momentos sensibles sin perder coherencia narrativa, confianza institucional ni posicionamiento estratégico.',
    includes: ['Ongoing strategic communications counsel','Reputational risk assessment','Sensitive communications advisory','Vulnerability identification','Narrative coordination during high-attention moments','Strategic response guidance','Executive counsel during complex situations'],
    includesEs: ['Asesoría continua en comunicaciones estratégicas','Evaluación del riesgo reputacional','Asesoría en comunicaciones sensibles','Identificación de vulnerabilidades','Coordinación narrativa en momentos de alta atención','Orientación de respuesta estratégica','Consejo ejecutivo en situaciones complejas'],
    differentiator: 'Reputation viewed as long-term strategic infrastructure. Narrative continuity across periods of growth and pressure.',
    differentiatorEs: 'La reputación como infraestructura estratégica a largo plazo. Continuidad narrativa a través de períodos de crecimiento y presión.',
  },
]

interface ServicesProps {
  data: Service[]
  locale: string
}

export function Services({ data, locale }: ServicesProps) {
  const t = useTranslations('services')
  const es = locale === 'es'
  const layers = data.length > 0 ? data : FALLBACK_SERVICES

  return (
    <section id="services" className="py-[120px]">
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

        {/* Service layers */}
        <div className="flex flex-col border-t border-[var(--rule-strong)]">
          {layers.map((layer) => {
            const verb  = es ? (layer.verbEs ?? layer.verb) : layer.verb
            const title = es ? (layer.titleEs ?? layer.title) : layer.title
            const lede  = es ? (layer.ledeEs  ?? layer.lede)  : layer.lede
            const body  = es ? (layer.bodyEs  ?? layer.body)  : layer.body
            const incl  = es ? (layer.includesEs ?? layer.includes) : layer.includes
            const diff  = es ? (layer.differentiatorEs ?? layer.differentiator) : layer.differentiator

            return (
              <div
                key={layer._id}
                className="grid gap-14 py-14 border-b border-[var(--rule)] items-start"
                style={{ gridTemplateColumns: '180px 1.3fr 1fr' }}
              >
                <div className="flex flex-col gap-3.5">
                  <div className="text-[12px] font-semibold tracking-[0.12em] text-ink-300" style={{ fontFamily: 'var(--font-title)' }}>
                    {layer.number}
                  </div>
                  <div className="text-[28px] font-bold tracking-[0.04em] text-lav-300" style={{ fontFamily: 'var(--font-title)' }}>
                    {verb}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <h3 className="text-[32px] leading-[1.15] tracking-[-0.02em] font-semibold text-bone-50 m-0" style={{ fontFamily: 'var(--font-title)' }}>
                    {title}
                  </h3>
                  <div className="text-[17px] leading-[1.6] text-bone-50" style={{ fontFamily: 'var(--font-body)' }}>
                    {lede}
                  </div>
                  <div className="text-[15px] leading-[1.65] text-ink-200" style={{ fontFamily: 'var(--font-body)' }}>
                    {body}
                  </div>
                  {diff && (
                    <div
                      className="text-[14px] leading-[1.55] text-bone-50 border-l border-lav-300 pl-[18px] mt-1"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {diff}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-300 mb-3.5" style={{ fontFamily: 'var(--font-title)' }}>
                    {t('includesLabel')}
                  </div>
                  <ul className="flex flex-col gap-2 list-none m-0 p-0">
                    {(incl ?? []).map((item, i) => (
                      <li key={i} className="text-[14px] leading-[1.5] text-ink-200 pl-3.5 relative" style={{ fontFamily: 'var(--font-body)' }}>
                        <span className="absolute left-0 text-ink-300">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 flex justify-between items-baseline flex-wrap gap-6">
          <p className="text-[16px] leading-[1.55] text-ink-200 max-w-[640px]" style={{ fontFamily: 'var(--font-body)' }}>
            {t('footer')}
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2.5 px-[22px] py-3 text-[13px] font-medium bg-transparent text-bone-50 rounded-md border border-[var(--rule-strong)] transition-all duration-200 hover:border-lav-300 hover:text-lav-300"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t('cta')}
            <span className="font-mono transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
