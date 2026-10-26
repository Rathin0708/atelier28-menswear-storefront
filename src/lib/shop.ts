import { getCategoryName } from '@/data/api'
import { normalize } from '@/lib/format'
import type { CategorySlug, CollectionDef, Fit, Product, ShopFilters, SortKey } from '@/types'

export const emptyFilters: ShopFilters = {
  q: '',
  categories: [],
  sizes: [],
  colors: [],
  min: null,
  max: null,
  fits: [],
  fabrics: [],
  inStock: false,
  onSale: false,
}

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
  { key: 'best', label: 'Best selling' },
]

const isOnSale = (p: Product) => Boolean(p.compareAtPrice && p.compareAtPrice > p.price)

/** Rank products by how well they match the query; 0 means no match. */
export function searchScore(p: Product, query: string): number {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return 1
  const name = normalize(p.name)
  const cat = normalize(getCategoryName(p.category))
  const sub = normalize(p.subcategory)
  const colors = p.colors.map((c) => normalize(c.name)).join(' ')
  const tags = p.tags.map(normalize).join(' ')
  const fabric = normalize(p.fabric)
  let total = 0
  for (const t of terms) {
    let s = 0
    if (name.includes(t)) s += name.startsWith(t) ? 6 : 5
    if (tags.includes(t)) s += 3
    if (sub.includes(t) || cat.includes(t)) s += 3
    if (colors.includes(t)) s += 2
    if (fabric.includes(t)) s += 2
    if (s === 0) return 0
    total += s
  }
  return total
}

export function applyFilters(list: Product[], f: ShopFilters, base?: CollectionDef['base']): Product[] {
  return list.filter((p) => {
    if (base) {
      if (base.categories && !base.categories.includes(p.category)) return false
      if (base.isNew && !p.isNew) return false
      if (base.bestseller && !p.isBestseller) return false
      if (base.onSale && !isOnSale(p)) return false
    }
    if (f.q && searchScore(p, f.q) === 0) return false
    if (f.categories.length && !f.categories.includes(p.category)) return false
    if (f.sizes.length && !p.sizes.some((s) => s.inStock && f.sizes.includes(s.label))) return false
    if (f.colors.length && !p.colors.some((c) => f.colors.includes(c.name))) return false
    if (f.min !== null && p.price < f.min) return false
    if (f.max !== null && p.price > f.max) return false
    if (f.fits.length && !f.fits.includes(p.fit)) return false
    if (f.fabrics.length && !f.fabrics.includes(p.fabric)) return false
    if (f.inStock && !p.sizes.some((s) => s.inStock)) return false
    if (f.onSale && !isOnSale(p)) return false
    return true
  })
}

export function sortProducts(list: Product[], sort: SortKey, q = ''): Product[] {
  const out = [...list]
  switch (sort) {
    case 'newest':
      return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case 'price-asc':
      return out.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return out.sort((a, b) => b.price - a.price)
    case 'best':
      return out.sort((a, b) => b.reviewCount - a.reviewCount)
    default:
      if (q) return out.sort((a, b) => searchScore(b, q) - searchScore(a, q))
      return out.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.rating - a.rating)
  }
}

export function searchProducts(list: Product[], query: string, limit = 8): Product[] {
  return list
    .map((p) => ({ p, s: searchScore(p, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p)
}

/** Split text into highlighted / plain segments for a query. */
export function highlight(text: string, query: string): { text: string; hit: boolean }[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return [{ text, hit: false }]
  // normalize() can change string length only for combining marks; match on a per-char basis.
  const flat = [...text].map((ch) => normalize(ch) || ch)
  const marks = new Array<boolean>(flat.length).fill(false)
  const hay = flat.join('')
  if (hay.length !== flat.length) return [{ text, hit: false }]
  for (const t of terms) {
    let i = hay.indexOf(t)
    while (i !== -1) {
      for (let k = i; k < i + t.length; k++) marks[k] = true
      i = hay.indexOf(t, i + 1)
    }
  }
  const out: { text: string; hit: boolean }[] = []
  const chars = [...text]
  chars.forEach((ch, idx) => {
    const last = out[out.length - 1]
    if (last && last.hit === marks[idx]) last.text += ch
    else out.push({ text: ch, hit: marks[idx] })
  })
  return out
}

export const allSizes = (list: Product[]): string[] => {
  const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38']
  const set = new Set<string>()
  list.forEach((p) => p.sizes.forEach((s) => order.includes(s.label) && set.add(s.label)))
  return order.filter((s) => set.has(s))
}

export const allColors = (list: Product[]): { name: string; hex: string }[] => {
  const map = new Map<string, string>()
  list.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)))
  return [...map].map(([name, hex]) => ({ name, hex })).sort((a, b) => a.name.localeCompare(b.name))
}

export const allFabrics = (list: Product[]): string[] => [...new Set(list.map((p) => p.fabric))].sort()

/* ---------- URL <-> filters ---------- */

const csv = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])
const num = (v: string | null) => {
  if (v === null || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export function filtersFromParams(sp: URLSearchParams): ShopFilters {
  return {
    q: sp.get('q') ?? '',
    categories: csv(sp.get('cat')) as CategorySlug[],
    sizes: csv(sp.get('size')),
    colors: csv(sp.get('color')),
    min: num(sp.get('min')),
    max: num(sp.get('max')),
    fits: csv(sp.get('fit')) as Fit[],
    fabrics: csv(sp.get('fabric')),
    inStock: sp.get('stock') === '1',
    onSale: sp.get('sale') === '1',
  }
}

export function sortFromParams(sp: URLSearchParams): SortKey {
  const v = sp.get('sort')
  return sortOptions.some((o) => o.key === v) ? (v as SortKey) : 'featured'
}

export function paramsFromFilters(f: ShopFilters, sort: SortKey): URLSearchParams {
  const sp = new URLSearchParams()
  if (f.q) sp.set('q', f.q)
  if (f.categories.length) sp.set('cat', f.categories.join(','))
  if (f.sizes.length) sp.set('size', f.sizes.join(','))
  if (f.colors.length) sp.set('color', f.colors.join(','))
  if (f.min !== null) sp.set('min', String(f.min))
  if (f.max !== null) sp.set('max', String(f.max))
  if (f.fits.length) sp.set('fit', f.fits.join(','))
  if (f.fabrics.length) sp.set('fabric', f.fabrics.join(','))
  if (f.inStock) sp.set('stock', '1')
  if (f.onSale) sp.set('sale', '1')
  if (sort !== 'featured') sp.set('sort', sort)
  return sp
}

export const activeFilterCount = (f: ShopFilters) =>
  f.categories.length + f.sizes.length + f.colors.length + f.fits.length + f.fabrics.length +
  (f.min !== null || f.max !== null ? 1 : 0) + Number(f.inStock) + Number(f.onSale)
