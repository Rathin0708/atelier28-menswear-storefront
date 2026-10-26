import { lazy, Suspense } from 'react'
import { Hero } from '@/components/sections/Hero'
import { usePageMeta } from '@/hooks/usePageMeta'

const HomeBelow = lazy(() => import('@/pages/HomeBelow'))

export default function Home() {
  usePageMeta('', 'ATELIER 28 is a menswear house for the next decade: wool, raw denim, linen and ink, cut with precision. Shop the AW 2028 collection.')
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
        <HomeBelow />
      </Suspense>
    </>
  )
}
