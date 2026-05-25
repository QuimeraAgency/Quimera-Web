import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Manifesto } from '@/components/sections/Manifesto'
import { Services } from '@/components/sections/Services'
import { WorkTable } from '@/components/sections/WorkTable'
import { PerspectiveStrip } from '@/components/sections/PerspectiveStrip'
import { ContactBlock } from '@/components/sections/ContactBlock'
import {
  getPerspectivePosts,
  getCaseStudies,
  getServices,
  getManifesto,
} from '@/sanity/queries'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params

  const [perspectives, caseStudies, services, manifesto] = await Promise.allSettled([
    getPerspectivePosts(),
    getCaseStudies(),
    getServices(),
    getManifesto(),
  ])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto
          data={manifesto.status === 'fulfilled' ? manifesto.value : null}
          locale={locale}
        />
        <Services
          data={services.status === 'fulfilled' ? services.value : []}
          locale={locale}
        />
        <WorkTable
          data={caseStudies.status === 'fulfilled' ? caseStudies.value : []}
          locale={locale}
        />
        <PerspectiveStrip
          data={perspectives.status === 'fulfilled' ? perspectives.value : []}
          locale={locale}
        />
        <ContactBlock />
      </main>
      <Footer />
    </>
  )
}
