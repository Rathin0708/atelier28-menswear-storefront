import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Motion'
import { getCategories, getProducts } from '@/data/api'
import { useIsFinePointer, useMediaQuery } from '@/hooks'

export function CategoryIndex() {
  const cats = getCategories()
  const finePointer = useIsFinePointer()
  const wide = useMediaQuery('(min-width: 768px)')
  const fine = finePointer && wide
  const [hover, setHover] = useState<string | null>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 28 })
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 28 })
  const products = getProducts()
  const active = cats.find((c) => c.slug === hover)

  return (
    <section aria-labelledby="cat-h" className="wrap section-pad">
      <p className="label text-stone">03 / Shop by category</p>
      <Reveal><h2 id="cat-h" className="display display-lg mt-3">The index</h2></Reveal>

      {fine ? (
        <ul
          className="mt-12 hairline-t"
          onPointerMove={(e) => {
            x.set(e.clientX + 32)
            y.set(e.clientY - 120)
          }}
          onPointerLeave={() => setHover(null)}
        >
          {cats.map((c, i) => (
            <li key={c.slug} className="hairline-b">
              <Link
                to={`/collections/${c.slug}`}
                onPointerEnter={() => setHover(c.slug)}
                onFocus={() => setHover(c.slug)}
                onBlur={() => setHover(null)}
                className="group flex min-h-24 items-baseline justify-between gap-6 py-4 transition-[padding,color] duration-500 ease-[var(--ease-reveal)] hover:pl-6 hover:text-oxblood focus-visible:pl-6"
              >
                <span className="num label w-10 text-stone">0{i + 1}</span>
                <span className="display display-xl flex-1 uppercase">{c.name}</span>
                <span className="label hidden text-stone md:block">{products.filter((p) => p.category === c.slug).length} pieces</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-3">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link to={`/collections/${c.slug}`} className="relative block overflow-hidden">
                <Img src={c.image} alt="" ratio="4 / 5" sizes="50vw" className="w-full" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-bone"><span className="display text-xl leading-tight">{c.name}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {fine && (
        <AnimatePresence>
          {active && (
            <motion.div
              key={active.slug}
              aria-hidden="true"
              className="pointer-events-none fixed left-0 top-0 z-30 w-60 overflow-hidden"
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <Img src={active.image} alt="" ratio="4 / 5" sizes="240px" className="w-full" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  )
}
