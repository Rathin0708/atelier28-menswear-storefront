import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Skeleton } from '@/components/ui/Controls'
import { Img } from '@/components/ui/Img'
import { Price } from '@/components/product/Price'
import { SwatchSelector } from '@/components/product/Selectors'
import { WishlistButton } from '@/components/product/WishlistButton'
import { getCategoryName } from '@/data/api'
import { useIsFinePointer } from '@/hooks'
import { DUR, EASE_REVEAL, STAGGER } from '@/lib/motion'
import { useCommerce } from '@/store/actions'
import { useUI } from '@/store/ui'
import type { Product } from '@/types'

interface Props {
  product: Product
  index?: number
  priority?: boolean
  sizes?: string
  /** When inside a layout-animated grid. */
  animateLayout?: boolean
}

const CARD_SIZES = '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw'

export function ProductCard({ product, index = 0, priority = false, sizes = CARD_SIZES, animateLayout = false }: Props) {
  const fine = useIsFinePointer()
  const { openOverlay } = useUI()
  const { addToCart } = useCommerce()
  const [colorIndex, setColorIndex] = useState(0)
  const [quickOpen, setQuickOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)

  const variant = product.colors[colorIndex]
  const [primary, secondary] = variant.images
  const inStock = product.sizes.filter((s) => s.inStock)
  const oneSize = product.sizes.length === 1
  const badges = product.badges.length ? product.badges : []

  const quickAdd = (size: string) => {
    addToCart(product, variant.name, size, 1, false)
    setQuickOpen(false)
  }

  const onScroll = () => {
    const el = scroller.current
    if (!el) return
    setSlide(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <motion.article
      layout={animateLayout ? 'position' : false}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: DUR.reveal, delay: (index % 4) * STAGGER, ease: EASE_REVEAL }}
      className="group relative"
    >
      <div className="relative overflow-hidden bg-line" style={{ aspectRatio: '4 / 5' }} data-cursor="VIEW">
        {fine ? (
          <Link to={`/product/${product.slug}`} aria-label={`${product.name}, view details`} className="absolute inset-0 block">
            <Img src={primary} alt={`${product.name} in ${variant.name}`} sizes={sizes} priority={priority} className="absolute inset-0 h-full w-full transition-[transform,opacity] duration-[1200ms] ease-[var(--ease-reveal)] group-hover:scale-105" />
            {secondary && (
              <Img src={secondary} alt="" sizes={sizes} className="absolute inset-0 h-full w-full scale-105 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" />
            )}
          </Link>
        ) : (
          <>
            <div ref={scroller} onScroll={onScroll} className="no-scrollbar absolute inset-0 flex snap-x snap-mandatory overflow-x-auto">
              {variant.images.slice(0, 3).map((src, i) => (
                <Link key={src} to={`/product/${product.slug}`} aria-label={i === 0 ? `${product.name}, view details` : undefined} aria-hidden={i === 0 ? undefined : true} tabIndex={i === 0 ? 0 : -1} className="block h-full w-full shrink-0 snap-center">
                  <Img src={src} alt={i === 0 ? `${product.name} in ${variant.name}` : ''} sizes={sizes} priority={priority && i === 0} className="h-full w-full" />
                </Link>
              ))}
            </div>
            <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1.5" aria-hidden="true">
              {variant.images.slice(0, 3).map((_, i) => (
                <span key={i} className={`h-1 w-1 rounded-full ${i === slide ? 'bg-ink' : 'bg-ink/30'}`} />
              ))}
            </div>
          </>
        )}

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {badges.slice(0, 2).map((b) => (
            <Badge key={b} kind={b} />
          ))}
        </div>
        <div className="absolute right-1 top-1 text-ink">
          <WishlistButton product={product} />
        </div>

        <div
          className={`absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-paper/95 p-3 transition-transform duration-300 ease-[var(--ease-overlay)] ${
            quickOpen ? 'translate-y-0' : 'translate-y-full focus-within:translate-y-0 md:group-hover:translate-y-0'
          } ${!fine ? 'pb-4' : ''}`}
          data-cursor=""
        >
          <p className="label text-stone">{oneSize ? 'Quick add' : 'Quick add — select size'}</p>
          <div className="flex flex-wrap gap-1.5">
            {oneSize ? (
              <button type="button" onClick={() => quickAdd(product.sizes[0].label)} className="label min-h-11 flex-1 bg-ink px-3 text-bone hover:bg-oxblood">
                Add to cart
              </button>
            ) : (
              inStock.map((s) => (
                <button key={s.label} type="button" aria-label={`Add size ${s.label} to cart`} onClick={() => quickAdd(s.label)} className="label num min-h-11 min-w-11 border border-line px-2 hover:border-ink hover:bg-ink hover:text-bone">
                  {s.label}
                </button>
              ))
            )}
          </div>
          <button type="button" onClick={() => openOverlay('quickview', product.slug)} className="label link-u mt-1 min-h-11 self-start">
            Quick view
          </button>
        </div>
        {!fine && (
          <button
            type="button"
            aria-expanded={quickOpen}
            aria-label={`Quick add ${product.name}`}
            onClick={() => setQuickOpen((o) => !o)}
            className="absolute bottom-8 right-2 z-10 grid h-11 w-11 place-items-center bg-paper text-ink"
          >
            <Plus size={18} className={`transition-transform ${quickOpen ? 'rotate-45' : ''}`} />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <p className="label text-stone">{getCategoryName(product.category)}</p>
        <h3 className="text-[15px] font-medium leading-snug">
          <Link to={`/product/${product.slug}`} className="hover:text-oxblood">
            {product.name}
          </Link>
        </h3>
        <Price product={product} className="text-sm" />
        {product.colors.length > 1 && (
          <div className="-ml-1">
            <SwatchSelector colors={product.colors} value={colorIndex} onChange={setColorIndex} name={`card-${product.id}`} size="sm" />
          </div>
        )}
      </div>
    </motion.article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton ratio="4 / 5" />
      <Skeleton className="mt-3 h-3 w-1/3" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/4" />
    </div>
  )
}
