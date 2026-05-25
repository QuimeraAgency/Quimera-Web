import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { CoordRibbon } from '@/components/ui/CoordRibbon'

export function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="pt-[140px] pb-[120px] relative">
      <div className="max-w-[1400px] mx-auto px-12">
        <div className="grid grid-cols-[1.7fr_1fr] gap-16 items-end">
          <div>
            <div
              className="text-[13px] font-semibold tracking-[0.08em] uppercase text-lav-300 mb-8"
              style={{ fontFamily: 'var(--font-title)' }}
            >
              {t('eyebrow')}
            </div>
            <h1
              className="text-[96px] leading-[1.02] tracking-[-0.03em] font-bold max-w-[960px] m-0"
              style={{ fontFamily: 'var(--font-title)', textWrap: 'balance' } as React.CSSProperties}
            >
              {t('headline')}{' '}
              <em className="not-italic text-lav-300">{t('headlineAccent')}</em>
            </h1>
            <p
              className="mt-10 max-w-[620px] text-[19px] leading-[1.55] text-ink-200"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t('body')}
            </p>
            <div className="mt-14 flex gap-3.5">
              <a
                href="#services"
                className="group inline-flex items-center gap-2.5 px-[22px] py-3 text-[13px] font-medium bg-bone-50 text-ink-950 rounded-md border border-transparent transition-all duration-200 hover:-translate-y-px hover:bg-white"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t('ctaPrimary')}
                <span className="font-mono transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 px-[22px] py-3 text-[13px] font-medium bg-transparent text-bone-50 rounded-md border border-[var(--rule-strong)] transition-all duration-200 hover:border-lav-300 hover:text-lav-300"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t('ctaSecondary')}
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6 items-end">
            <Image
              src="/assets/quimera-mark-outline-white.svg"
              alt=""
              width={300}
              height={300}
              className="opacity-65"
            />
            <div
              className="text-right text-[11px] font-semibold tracking-[0.1em] uppercase text-ink-300"
              style={{ fontFamily: 'var(--font-title)' }}
            >
              <div>{t('location')}</div>
              <div className="mt-2">{t('year')}</div>
            </div>
          </div>
        </div>

        <div className="mt-[120px]">
          <CoordRibbon
            left={[t('ribbonCeo'), t('ribbonFounded'), t('ribbonAppt')]}
            right={[t('ribbonIndex')]}
          />
        </div>
      </div>
    </section>
  )
}
