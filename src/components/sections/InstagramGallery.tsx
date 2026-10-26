import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Motion'
import { brand } from '@/config/brand'
import { getProductBySlug } from '@/data/api'
import { gallery } from '@/data/testimonials'
import { useIsFinePointer } from '@/hooks'
import { useUI } from '@/store/ui'

const Lightbox = lazy(() => import('@/components/sections/Lightbox'))

export function InstagramGallery({ title = true }: { title?: boolean }) {
  const { overlay, openOverlay } = useUI()
  const fine = useIsFinePointer()
  const [index, setIndex] = useState(0)

  const open = (i: number) => {
    setIndex(i)
    openOverlay('lightbox')
  }

  return (
    <section aria-labelledby="gram-h" className="hairline-t">
      <div className="wrap section-pad">
        {title && (
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label text-stone">09 / Community</p>
              <Reveal><h2 id="gram-h" className="display display-lg mt-3">{brand.handle}<br />— worn by you</h2></Reveal>
            </div>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="label link-u inline-flex min-h-11 items-center">Follow on Instagram<span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        )}
        <ul className="columns-2 gap-3 md:columns-4 md:gap-4">
          {gallery.map((g, i) => {
            const product = getProductBySlug(g.productSlug)
            return (
              <li key={g.id} className="mb-3 break-inside-avoid md:mb-4">
                <button type="button" onClick={() => open(i)} className="group relative block w-full overflow-hidden text-left" data-cursor="VIEW">
                  <Img src={g.image} alt={g.caption} ratio={g.height === 'tall' ? '3 / 4' : '1 / 1'} sizes="(min-width: 768px) 25vw, 50vw" className="w-full transition-transform duration-[1200ms] ease-[var(--ease-reveal)] group-hover:scale-105" />
                  <span className={`absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-ink/85 to-transparent p-3 text-bone transition-opacity duration-300 ${fine ? 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100' : ''}`}>
                    <span className="label">{g.handle}</span>
                    {product && <span className="text-sm underline underline-offset-4">Shop the look</span>}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-6 text-sm text-stone">Gallery shows sample community posts for demonstration.</p>
        <Link to="/shop" className="sr-only">Shop the collection</Link>
      </div>
      <Suspense fallback={null}>
        {overlay?.name === 'lightbox' && <Lightbox start={index} />}
      </Suspense>
    </section>
  )
}
