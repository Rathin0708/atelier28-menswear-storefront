import { X } from 'lucide-react'
import { getCategoryName } from '@/data/api'
import { formatPrice } from '@/lib/format'
import type { ShopFilters } from '@/types'

interface Chip {
  id: string
  label: string
  remove: Partial<ShopFilters>
}

export function ActiveFilterChips({ filters, onChange, onClear }: { filters: ShopFilters; onChange: (p: Partial<ShopFilters>) => void; onClear: () => void }) {
  const chips: Chip[] = []
  if (filters.q) chips.push({ id: 'q', label: `Search: “${filters.q}”`, remove: { q: '' } })
  filters.categories.forEach((c) => chips.push({ id: `c-${c}`, label: getCategoryName(c), remove: { categories: filters.categories.filter((x) => x !== c) } }))
  filters.sizes.forEach((s) => chips.push({ id: `s-${s}`, label: `Size ${s}`, remove: { sizes: filters.sizes.filter((x) => x !== s) } }))
  filters.colors.forEach((c) => chips.push({ id: `col-${c}`, label: c, remove: { colors: filters.colors.filter((x) => x !== c) } }))
  filters.fits.forEach((f) => chips.push({ id: `f-${f}`, label: `${f} fit`, remove: { fits: filters.fits.filter((x) => x !== f) } }))
  filters.fabrics.forEach((f) => chips.push({ id: `fa-${f}`, label: f, remove: { fabrics: filters.fabrics.filter((x) => x !== f) } }))
  if (filters.min !== null || filters.max !== null) {
    chips.push({ id: 'price', label: `${formatPrice(filters.min ?? 0)} – ${filters.max !== null ? formatPrice(filters.max) : 'any'}`, remove: { min: null, max: null } })
  }
  if (filters.inStock) chips.push({ id: 'stock', label: 'In stock', remove: { inStock: false } })
  if (filters.onSale) chips.push({ id: 'sale', label: 'On sale', remove: { onSale: false } })

  if (chips.length === 0) return null
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.id}>
          <button type="button" onClick={() => onChange(c.remove)} aria-label={`Remove filter: ${c.label}`} className="label inline-flex min-h-11 items-center gap-2 border border-ink px-3 hover:bg-ink hover:text-bone">
            {c.label}
            <X size={12} aria-hidden="true" />
          </button>
        </li>
      ))}
      <li>
        <button type="button" onClick={onClear} className="label link-u min-h-11 px-2">Clear all</button>
      </li>
    </ul>
  )
}
