import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  return (
    <footer className="bg-ink-950 border-t border-[var(--rule)] pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-12">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-16 mb-16">
          <div>
            <div className="flex items-center gap-3 text-[12px] font-semibold tracking-[0.18em] uppercase text-bone-50 mb-6" style={{ fontFamily: 'var(--font-title)' }}>
              <Image src="/assets/quimera-mark-bebacc.svg" alt="Quimera mark" width={22} height={22} />
              <span>Quimera Agency</span>
            </div>
            <p className="text-[17px] leading-[1.6] text-bone-50 max-w-[420px]">
              {t('tagline')}
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold tracking-[0.08em] uppercase text-ink-300 mb-[18px]" style={{ fontFamily: 'var(--font-title)' }}>
              {t('architectureTitle')}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[t('defineLink'), t('activateLink'), t('sustainLink')].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-[14px] text-bone-50 border-b border-transparent hover:border-lav-300 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold tracking-[0.08em] uppercase text-ink-300 mb-[18px]" style={{ fontFamily: 'var(--font-title)' }}>
              {t('agencyTitle')}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {([
                ['#manifesto', nav('manifesto')],
                ['#work', nav('work')],
                ['#perspective', nav('perspective')],
                ['#contact', nav('contact')],
              ] as [string, string][]).map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-[14px] text-bone-50 border-b border-transparent hover:border-lav-300 transition-colors duration-200">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold tracking-[0.08em] uppercase text-ink-300 mb-[18px]" style={{ fontFamily: 'var(--font-title)' }}>
              {t('contactTitle')}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                ['mailto:hola@quimera.agency', 'hola@quimera.agency'],
                ['#contact', 'Madrid · España'],
                ['#contact', 'LinkedIn'],
              ].map(([href, label]) => (
                <li key={label}>
                  <a href={href} className="text-[14px] text-bone-50 border-b border-transparent hover:border-lav-300 transition-colors duration-200">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-end pt-8 border-t border-[var(--rule)] font-mono text-[11px] tracking-[0.16em] uppercase text-ink-300">
          <div className="flex gap-4 items-center">
            <Image src="/assets/quimera-mark-bebacc.svg" alt="" width={18} height={18} />
            <span>{t('copyright')}</span>
            <span>·</span>
            <span>{t('cif')}</span>
            <span>·</span>
            <span>{t('location')}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-bone-50 transition-colors duration-200">{t('imprint')}</a>
            <a href="#" className="hover:text-bone-50 transition-colors duration-200">{t('privacy')}</a>
            <a href="#" className="hover:text-bone-50 transition-colors duration-200">{t('confidentiality')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
