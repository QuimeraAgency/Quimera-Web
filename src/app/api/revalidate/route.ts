import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const docType: string = body?._type ?? ''

  const tagMap: Record<string, string> = {
    perspective: 'perspective',
    caseStudy: 'caseStudy',
    service: 'service',
    manifesto: 'manifesto',
  }

  const tag = tagMap[docType]
  if (tag) revalidateTag(tag, 'max')

  return NextResponse.json({ revalidated: true, tag })
}
