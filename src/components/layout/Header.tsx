'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/navigation'
import { useParams } from 'next/navigation'

export function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const locale = (params.locale as string) ?? 'en'

  const navItems: [string, string][] = [
    ['manifesto', t('manifesto')],
    ['services', t('services')],
    ['work', t('work')],
    ['perspective', t('perspective')],
    ['contact', t('contact')],
  ]

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next })
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--rule)]"
      style={{ background: 'rgba(14,13,18,0.72)', backdropFilter: 'blur(14px) saturate(140%)' }}
    >
      <div className="flex items-center justify-between px-12 py-[18px] max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center gap-3 text-[12px] font-semibold tracking-[0.18em] uppercase text-bone-50" style={{ fontFamily: 'var(--font-title)' }}>
          <Image src="/assets/quimera-mark-bebacc.svg" alt="Quimera mark" width={22} height={22} />
          <span>Quimera Agency</span>
        </Link>

        <nav className="flex gap-8">
          {navItems.map(([id, label]) => {
            const isActive = pathname === '/' && false // single-page scrolling
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 py-1.5 relative ${
                  isActive ? 'text-lav-300' : 'text-ink-200 hover:text-bone-50'
                }`}
                style={{ fontFamily: 'var(--font-title)' }}
              >
                {label}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.08em] uppercase" style={{ fontFamily: 'var(--font-title)' }}>
          <button
            onClick={() => switchLocale('en')}
            className={`transition-colors duration-200 ${locale === 'en' ? 'text-bone-50' : 'text-ink-400 hover:text-ink-200'}`}
          >
            EN
          </button>
          <span className="opacity-40 text-ink-300">/</span>
          <button
            onClick={() => switchLocale('es')}
            className={`transition-colors duration-200 ${locale === 'es' ? 'text-bone-50' : 'text-ink-400 hover:text-ink-200'}`}
          >
            ES
          </button>
        </div>
      </div>
    </header>
  )
}
