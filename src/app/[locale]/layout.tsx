import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })

  return {
    title: {
      default: 'Quimera Agency',
      template: '%s · Quimera Agency',
    },
    description: t('body'),
    openGraph: {
      type: 'website',
      siteName: 'Quimera Agency',
      title: 'Quimera Agency',
      description: t('body'),
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Quimera Agency',
      description: t('body'),
    },
    metadataBase: new URL('https://quimera.agency'),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', es: '/es' },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
