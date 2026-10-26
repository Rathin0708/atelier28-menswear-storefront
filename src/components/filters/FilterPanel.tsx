import { ChevronDown } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { getCategories, getProducts } from '@/data/api'
import { formatPrice } from '@/lib/format'
import { allColors, allFabrics, allSizes } from '@/lib/shop'
import type { CategorySlug, Fit, ShopFilters } from '@/types'

const PRICE_MIN = 0
const PRICE_MAX = 15000
const STEP = 100

interface Props {
  filters: ShopFilters
  onChange: (patch: Partial<ShopFilters>) => void
  /** Restrict category choices (collections pinned to specific categories). */
  categoryScope?: CategorySlug[]
}

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

function Group({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group hairline-b py-1">
      <summary className="label flex min-h-12 cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  )
}

function Check({ label, checked, onChange, swatch }: { label: string; checked: boolean; onChange: () => void; swatch?: string }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[var(--color-ink)]" />
      {swatch && <span aria-hidden="true" className="h-4 w-4 rounded-full border border-ink/20" style={{ background: swatch }} />}
      <span>{label}</span>
    </label>
  )
}

export function PriceRange({ min, max, onCommit }: { min: number | null; max: number | null; onCommit: (min: number | null, max: number | null) => void }) {
  const [lo, setLo] = useState(min ?? PRICE_MIN)
  const [hi, setHi] = useState(max ?? PRICE_MAX)
  const commit = (a = lo, b = hi) => {
    const x = Math.min(a, b)
    const y = Math.max(a, b)
    onCommit(x <= PRICE_MIN ? null : x, y >= PRICE_MAX ? null : y)
  }
  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  return (
    <div>
      <div className="relative mx-2.5 mb-4 mt-3 h-6">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-line" />
        <div className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-ink" style={{ left: `${pct(Math.min(lo, hi))}%`, right: `${100 - pct(Math.max(lo, hi))}%` }} />
        <input type="range" aria-label="Minimum price" className="range-thumb" min={PRICE_MIN} max={PRICE_MAX} step={STEP} value={lo} onChange={(e) => setLo(Number(e.target.value))} onPointerUp={() => commit()} onKeyUp={() => commit()} />
        <input type="range" aria-label="Maximum price" className="range-thumb" min={PRICE_MIN} max={PRICE_MAX} step={STEP} value={hi} onChange={(e) => setHi(Number(e.target.value))} onPointerUp={() => commit()} onKeyUp={() => commit()} />
      </div>
      <div className="flex items-center gap-3">
        <label className="flex-1">
          <span className="label mb-1 block text-stone">Min (₹)</span>
          <input type="number" inputMode="numeric" min={PRICE_MIN} max={PRICE_MAX} step={STEP} value={lo} onChange={(e) => setLo(Number(e.target.value))} onBlur={() => commit()} onKeyDown={(e) => e.key === 'Enter' && commit()} className="num min-h-11 w-full border border-line bg-paper px-3" />
        </label>
        <label className="flex-1">
          <span className="label mb-1 block text-stone">Max (₹)</span>
          <input type="number" inputMode="numeric" min={PRICE_MIN} max={PRICE_MAX} step={STEP} value={hi} onChange={(e) => setHi(Number(e.target.value))} onBlur={() => commit()} onKeyDown={(e) => e.key === 'Enter' && commit()} className="num min-h-11 w-full border border-line bg-paper px-3" />
        </label>
      </div>
      <p className="mt-2 text-xs text-stone">{formatPrice(Math.min(lo, hi))} – {formatPrice(Math.max(lo, hi))}{hi >= PRICE_MAX ? '+' : ''}</p>
    </div>
  )
}

export function FilterPanel({ filters, onChange, categoryScope }: Props) {
  const products = getProducts()
  const cats = getCategories().filter((c) => !categoryScope || categoryScope.includes(c.slug))
  const sizes = useMemo(() => allSizes(products), [products])
  const colors = useMemo(() => allColors(products), [products])
  const fabrics = useMemo(() => allFabrics(products), [products])
  const fits: Fit[] = ['Slim', 'Regular', 'Relaxed']

  return (
    <div className="hairline-t">
      {cats.length > 1 && (
        <Group title="Category">
          {cats.map((c) => (
            <Check key={c.slug} label={c.name} checked={filters.categories.includes(c.slug)} onChange={() => onChange({ categories: toggle(filters.categories, c.slug) })} />
          ))}
        </Group>
      )}
      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const on = filters.sizes.includes(s)
            return (
              <button key={s} type="button" aria-pressed={on} onClick={() => onChange({ sizes: toggle(filters.sizes, s) })} className={`label num min-h-11 min-w-12 border px-3 ${on ? 'border-ink bg-ink text-bone' : 'border-line hover:border-ink'}`}>
                {s}
              </button>
            )
          })}
        </div>
      </Group>
      <Group title="Colour">
        <div className="grid grid-cols-2 gap-x-3">
          {colors.map((c) => (
            <Check key={c.name} label={c.name} swatch={c.hex} checked={filters.colors.includes(c.name)} onChange={() => onChange({ colors: toggle(filters.colors, c.name) })} />
          ))}
        </div>
      </Group>
      <Group title="Price">
        <PriceRange key={`${filters.min}-${filters.max}`} min={filters.min} max={filters.max} onCommit={(min, max) => onChange({ min, max })} />
      </Group>
      <Group title="Fit" defaultOpen={false}>
        {fits.map((f) => (
          <Check key={f} label={f} checked={filters.fits.includes(f)} onChange={() => onChange({ fits: toggle(filters.fits, f) })} />
        ))}
      </Group>
      <Group title="Fabric" defaultOpen={false}>
        {fabrics.map((f) => (
          <Check key={f} label={f} checked={filters.fabrics.includes(f)} onChange={() => onChange({ fabrics: toggle(filters.fabrics, f) })} />
        ))}
      </Group>
      <Group title="Availability">
        <Check label="In stock only" checked={filters.inStock} onChange={() => onChange({ inStock: !filters.inStock })} />
        <Check label="On sale" checked={filters.onSale} onChange={() => onChange({ onSale: !filters.onSale })} />
      </Group>
    </div>
  )
}
