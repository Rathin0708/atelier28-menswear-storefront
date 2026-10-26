import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Controls'
import { Img } from '@/components/ui/Img'
import { Reveal, SplitLines } from '@/components/ui/Motion'
import { StatsRow } from '@/components/sections/BrandStory'
import { editorial } from '@/data/images'
import { usePageMeta } from '@/hooks/usePageMeta'

const values = [
  ['Cloth first', 'We start with the fabric — long-staple cotton, washed linen, selvedge denim — and only then draw the garment.'],
  ['Cut with intent', 'Every pattern is drafted and re-drafted in Mumbai until the shoulder, the drop and the hem sit exactly right.'],
  ['Made to be kept', 'Fewer pieces, made properly, so that you wear them for years rather than seasons.'],
]

export default function About() {
  usePageMeta('About', 'The story behind ATELIER 28: tailoring, cloth and a quiet conviction that clothes should last.')
  return (
    <div>
      <section className="wrap pb-16 pt-10 md:pt-20">
        <p className="label text-stone">About the house</p>
        <SplitLines as="h1" lines={['Quiet tailoring,', 'loud type.']} className="display display-hero mt-6" immediate />
      </section>
      <section className="wrap grid grid-cols-1 items-end gap-10 pb-24 md:grid-cols-[1.2fr_1fr]">
        <Reveal><Img src={editorial.story} alt="A man in a black suit standing on a grey concrete floor" ratio="4 / 5" sizes="(min-width: 768px) 55vw, 100vw" className="w-full" /></Reveal>
        <Reveal delay={0.1}>
          <p className="display text-3xl leading-tight md:text-4xl">We founded ATELIER 28 in 2024 on a simple belief: menswear should be precise, calm and built to outlast the trend cycle.</p>
          <p className="mt-6 max-w-[52ch] text-stone">Our studio in Mumbai drafts every pattern in house and works with small mills and workshops across India — Tiruppur for jersey, Kanpur for leather, Lucknow for embroidery. The result is a wardrobe that looks best on the tenth wear.</p>
        </Reveal>
      </section>
      <section className="wrap hairline-t section-pad grid gap-12 md:grid-cols-3">
        {values.map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.08}>
            <p className="num label text-stone">0{i + 1}</p>
            <h2 className="display display-md mt-3">{t}</h2>
            <p className="mt-4 text-stone">{d}</p>
          </Reveal>
        ))}
      </section>
      <section className="bg-ink text-bone" data-dark>
        <div className="wrap section-pad"><StatsRow /></div>
      </section>
      <section className="wrap section-pad flex flex-wrap items-center justify-between gap-6">
        <p className="display display-lg">See it on the rail.</p>
        <div className="flex gap-3"><ButtonLink to="/shop">Shop the collection</ButtonLink><Link to="/lookbook" className="label link-u inline-flex min-h-12 items-center">Open the lookbook</Link></div>
      </section>
    </div>
  )
}
