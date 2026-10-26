import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Img } from '@/components/ui/Img'
import { Magnetic, Reveal } from '@/components/ui/Motion'
import { getCollections, getProducts } from '@/data/api'
import { applyFilters, emptyFilters } from '@/lib/shop'
import { DUR, EASE_REVEAL } from '@/lib/motion'

const layout = [
  { slug: 'outerwear-edit', span: 'md:col-span-7', ratio: '4 / 5', offset: '' },
  { slug: 'tailoring', span: 'md:col-span-5', ratio: '4 / 5', offset: 'md:mt-24' },
  { slug: 'everyday', span: 'md:col-span-5', ratio: '1 / 1', offset: 'md:-mt-10' },
  { slug: 'ethnic', span: 'md:col-span-7', ratio: '5 / 4', offset: 'md:mt-16' },
]

export function FeaturedCollections() {
  const cols = getCollections()
  const products = getProducts()
  return (
    <section aria-labelledby="collections-h" className="wrap section-pad">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <div>
          <p className="label text-stone">01 / Collections</p>
          <Reveal><h2 id="collections-h" className="display display-xl mt-4">Four ways<br />to dress.</h2></Reveal>
        </div>
        <p className="max-w-[40ch] text-stone">Built around the way you actually live — from the office to the wedding season.</p>
      </div>
      <div className="grid gap-x-6 gap-y-14 md:grid-cols-12">
        {layout.map((l, i) => {
          const col = cols.find((c) => c.slug === l.slug)
          if (!col) return null
          const count = applyFilters(products, emptyFilters, col.base).length
          return (
            <motion.div key={col.slug} className={`${l.span} ${l.offset}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: DUR.reveal, delay: (i % 2) * 0.1 }}>
              <Link to={`/collections/${col.slug}`} className="group block" data-cursor="VIEW">
                <motion.div
                  className="relative overflow-hidden bg-line"
                  style={{ aspectRatio: l.ratio }}
                  initial={{ clipPath: 'inset(100% 0 0 0)' }}
                  whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 1.1, ease: EASE_REVEAL }}
                >
                  <Img src={col.image} alt={`${col.name} — ${col.blurb}`} sizes="(min-width: 768px) 58vw, 100vw" className="h-full w-full transition-transform duration-[1400ms] ease-[var(--ease-reveal)] group-hover:scale-105" />
                </motion.div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="display display-md">{col.name}</h3>
                    <p className="label num mt-2 text-stone">{count} pieces</p>
                  </div>
                  <Magnetic><span className="label inline-flex min-h-11 items-center gap-2 border-b border-ink">Explore <ArrowUpRight size={14} /></span></Magnetic>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
