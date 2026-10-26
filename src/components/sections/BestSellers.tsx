import { AnimatePresence, motion } from 'motion/react'
import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/product/ProductCard'
import { Reveal } from '@/components/ui/Motion'
import { getProducts } from '@/data/api'
import type { CategorySlug } from '@/types'

const tabs: { key: 'all' | CategorySlug; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'shirts', label: 'Shirts' },
  { key: 'jeans', label: 'Jeans' },
  { key: 'jackets', label: 'Jackets' },
]

export function BestSellers() {
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('all')
  const uid = useId()
  const list = useMemo(() => {
    const pool = getProducts().filter((p) => (tab === 'all' ? ['shirts', 'jeans', 'jackets', 't-shirts', 'knitwear'].includes(p.category) : p.category === tab))
    return pool.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.reviewCount - a.reviewCount).slice(0, 4)
  }, [tab])

  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.key === tab)
    const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : -1
    if (next >= 0) {
      e.preventDefault()
      setTab(tabs[next].key)
      document.getElementById(`${uid}-tab-${tabs[next].key}`)?.focus()
    }
  }

  return (
    <section aria-labelledby="best-h" className="wrap section-pad">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label text-stone">05 / Best sellers</p>
          <Reveal><h2 id="best-h" className="display display-lg mt-3">What everyone<br />keeps buying</h2></Reveal>
        </div>
        <div role="tablist" aria-label="Best seller categories" onKeyDown={onKey} className="flex flex-wrap gap-1">
          {tabs.map((t) => (
            <button key={t.key} id={`${uid}-tab-${t.key}`} role="tab" type="button" aria-selected={tab === t.key} aria-controls={`${uid}-panel`} tabIndex={tab === t.key ? 0 : -1} onClick={() => setTab(t.key)} className={`label relative min-h-11 px-3 sm:px-4 ${tab === t.key ? 'text-ink' : 'text-stone hover:text-ink'}`}>
              {t.label}
              {tab === t.key && <motion.span layoutId="best-tab" className="absolute inset-x-3 bottom-1.5 sm:inset-x-4 h-px bg-ink" />}
            </button>
          ))}
        </div>
      </div>
      <motion.div layout role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${tab}`} className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} animateLayout />)}
        </AnimatePresence>
      </motion.div>
      <div className="mt-12 text-center"><Link to="/collections/best-sellers" className="label link-u inline-flex min-h-11 items-center">Shop all best sellers</Link></div>
    </section>
  )
}
