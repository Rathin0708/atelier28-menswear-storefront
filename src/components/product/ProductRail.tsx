import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import { useIsFinePointer } from '@/hooks'
import type { Product } from '@/types'

interface Props {
  products: Product[]
  label: string
  header?: ReactNode
}

/** Horizontal scroll-snap rail with pointer drag (mouse), swipe (touch), buttons and a progress bar. */
export function ProductRail({ products, label, header }: Props) {
  const scroller = useRef<HTMLUListElement>(null)
  const fine = useIsFinePointer()
  const [progress, setProgress] = useState(0)
  const [edges, setEdges] = useState({ start: true, end: false })
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 })

  const measure = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 1)
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 })
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure, products.length])

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-6">
        <div>{header}</div>
        <div className="hidden gap-2 md:flex">
          <button type="button" aria-label="Previous products" disabled={edges.start} onClick={() => scrollBy(-1)} className="grid h-12 w-12 place-items-center border border-current disabled:opacity-30">
            <ArrowLeft size={18} />
          </button>
          <button type="button" aria-label="Next products" disabled={edges.end} onClick={() => scrollBy(1)} className="grid h-12 w-12 place-items-center border border-current disabled:opacity-30">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <ul
        ref={scroller}
        aria-label={label}
        data-cursor={fine ? 'DRAG' : undefined}
        onScroll={measure}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || !scroller.current) return
          drag.current = { active: true, moved: false, startX: e.clientX, startScroll: scroller.current.scrollLeft }
        }}
        onPointerMove={(e) => {
          const d = drag.current
          if (!d.active || !scroller.current) return
          const dx = e.clientX - d.startX
          if (Math.abs(dx) > 5) {
            d.moved = true
            scroller.current.style.scrollSnapType = 'none'
            scroller.current.scrollLeft = d.startScroll - dx
          }
        }}
        onPointerUp={() => {
          drag.current.active = false
          if (scroller.current) scroller.current.style.scrollSnapType = ''
        }}
        onPointerLeave={() => {
          drag.current.active = false
          if (scroller.current) scroller.current.style.scrollSnapType = ''
        }}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault()
            e.stopPropagation()
            drag.current.moved = false
          }
        }}
        className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 [scroll-padding-inline:var(--gutter)]"
      >
        {products.map((p, i) => (
          <li key={p.id} className="w-[62vw] shrink-0 snap-start sm:w-[34vw] md:w-[27vw] lg:w-[21vw] xl:w-[19vw] 2xl:w-[16vw]">
            <ProductCard product={p} index={i} sizes="(min-width: 1024px) 22vw, 62vw" />
          </li>
        ))}
      </ul>
      <div className="mt-6 h-px bg-current/20" role="progressbar" aria-label={`${label} scroll position`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
        <div className="h-px origin-left bg-current transition-transform duration-200" style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
      </div>
    </div>
  )
}
