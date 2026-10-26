import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Motion'
import { getProductBySlug } from '@/data/api'
import { editorial } from '@/data/images'
import { useIsDesktop } from '@/hooks'
import { formatPrice } from '@/lib/format'
import { useCommerce } from '@/store/actions'

interface Hotspot {
  slug: string
  x: number
  y: number
}

interface Chapter {
  title: string
  kicker: string
  body: string
  image: string
  alt: string
  hotspots: Hotspot[]
}

const chapters: Chapter[] = [
  {
    kicker: 'Chapter I',
    title: 'The Fabric',
    body: 'It begins at the mill. Brushed oxford, washed linen and slub jersey — chosen for how they feel on the fifth wear, not the first.',
    image: editorial.campaignFabric,
    alt: 'Shirts hanging on a rack',
    hotspots: [{ slug: 'oxford-button-down-sky', x: 38, y: 46 }],
  },
  {
    kicker: 'Chapter II',
    title: 'The Cut',
    body: 'Patterns are drafted in Mumbai and re-cut until the shoulder falls and the hem rests. Nothing leaves the studio until it moves with you.',
    image: editorial.campaignCut,
    alt: 'A man in a checked shirt beside a black car',
    hotspots: [
      { slug: 'brushed-check-shirt-charcoal', x: 48, y: 34 },
      { slug: 'tailored-trouser-ink', x: 61, y: 56 },
    ],
  },
  {
    kicker: 'Chapter III',
    title: 'The Finish',
    body: 'Brass hardware, mother-of-pearl buttons, hand-burnished edges. The small things that make a garment feel finished.',
    image: editorial.campaignFinish,
    alt: 'Brown leather dress shoes beside their box',
    hotspots: [{ slug: 'bridle-leather-belt-tan', x: 52, y: 52 }],
  },
]

export function EditorialCampaign() {
  const desktop = useIsDesktop()
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (!desktop) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [desktop])

  return (
    <section aria-labelledby="campaign-h" className="bg-indigo text-bone" data-dark>
      <div className="wrap pb-10 pt-[clamp(56px,9vw,150px)]">
        <p className="label text-bone/70">04 / The campaign</p>
        <Reveal><h2 id="campaign-h" className="display display-xl mt-4">Made slowly,<br />worn for years.</h2></Reveal>
      </div>

      {desktop ? (
        <div className="wrap grid grid-cols-[1.1fr_1fr] gap-16 pb-[clamp(56px,9vw,150px)]">
          <div className="sticky top-0 h-dvh self-start py-10">
            <div className="relative h-full w-full overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                  <Img src={chapters[active].image} alt={chapters[active].alt} sizes="55vw" className="h-full w-full" />
                  {chapters[active].hotspots.map((h) => <HotspotDot key={h.slug} hotspot={h} />)}
                </motion.div>
              </AnimatePresence>
              <p className="label absolute bottom-4 left-4 bg-ink/70 px-3 py-2">{chapters[active].kicker} — {chapters[active].title}</p>
            </div>
          </div>
          <div>
            {chapters.map((c, i) => (
              <article key={c.title} data-i={i} ref={(el) => { refs.current[i] = el }} className="flex min-h-dvh flex-col justify-center py-24" aria-label={c.title}>
                <p className="label text-bone/70">{c.kicker}</p>
                <h3 className="display display-lg mt-4">{c.title}</h3>
                <p className="mt-6 max-w-[44ch] text-lg text-bone/80">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="wrap grid gap-16 pb-16">
          {chapters.map((c) => (
            <article key={c.title} aria-label={c.title}>
              <div className="relative overflow-hidden">
                <Img src={c.image} alt={c.alt} ratio="4 / 5" sizes="100vw" className="w-full" />
                {c.hotspots.map((h) => <HotspotDot key={h.slug} hotspot={h} />)}
              </div>
              <p className="label mt-6 text-bone/70">{c.kicker}</p>
              <h3 className="display display-lg mt-2">{c.title}</h3>
              <p className="mt-4 text-bone/80">{c.body}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function HotspotDot({ hotspot }: { hotspot: Hotspot }) {
  const product = getProductBySlug(hotspot.slug)
  const { addToCart } = useCommerce()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!product) return null
  const left = hotspot.x > 55
  const up = hotspot.y > 55
  const sizes = product.sizes.filter((s) => s.inStock)
  return (
    <div ref={wrap} className="absolute" style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}>
      <button type="button" aria-expanded={open} aria-label={`Shop ${product.name}`} onClick={() => setOpen((o) => !o)} className="relative -ml-5 -mt-5 grid h-11 w-11 place-items-center">
        <span aria-hidden="true" className="pulse-ring absolute h-4 w-4 rounded-full bg-bone" />
        <span aria-hidden="true" className="relative h-4 w-4 rounded-full border-2 border-ink bg-bone" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={product.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute z-20 w-60 bg-paper p-4 text-ink ${left ? 'right-3' : 'left-3'} ${up ? 'bottom-3' : 'top-3'}`}
          >
            <Link to={`/product/${product.slug}`} className="block">
              <p className="text-[15px] font-medium leading-snug hover:text-oxblood">{product.name}</p>
              <p className="num text-sm text-stone">{formatPrice(product.price)}</p>
            </Link>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {sizes.map((s) => (
                <button key={s.label} type="button" aria-label={`Add size ${s.label} to cart`} onClick={() => { addToCart(product, product.colors[0].name, s.label, 1, false); setOpen(false) }} className="label num min-h-11 min-w-11 border border-line px-2 hover:bg-ink hover:text-bone">
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
