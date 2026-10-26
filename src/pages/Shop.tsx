import { AnimatePresence, motion } from 'motion/react'
import { Columns2, Columns3, Columns4, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ActiveFilterChips } from '@/components/filters/ActiveFilterChips'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard'
import { Button, CloseButton } from '@/components/ui/Controls'
import { Overlay } from '@/components/ui/Overlay'
import { SplitLines } from '@/components/ui/Motion'
import { getCollection, getProducts } from '@/data/api'
import { useIsDesktop, usePageMeta } from '@/hooks'
import { activeFilterCount, applyFilters, emptyFilters, filtersFromParams, paramsFromFilters, sortFromParams, sortOptions, sortProducts } from '@/lib/shop'
import { useUI } from '@/store/ui'
import type { ShopFilters, SortKey } from '@/types'
import NotFound from '@/pages/NotFound'

const PAGE_SIZE = 12

const DESKTOP_COLS: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-3 xl:grid-cols-4',
}
const MOBILE_COLS: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2' }

export default function Shop() {
  const { slug } = useParams()
  const collection = slug ? getCollection(slug) : undefined
  if (slug && !collection) return <NotFound />
  return <ShopInner key={slug ?? 'all'} />
}

function ShopInner() {
  const { slug } = useParams()
  const collection = slug ? getCollection(slug) : undefined
  const [sp, setSp] = useSearchParams()
  const { overlay, openOverlay, closeOverlay } = useUI()
  const desktop = useIsDesktop()

  const filters = useMemo(() => filtersFromParams(sp), [sp])
  const sort = sortFromParams(sp)
  const [density, setDensity] = useState({ desktop: 3, mobile: 2 })
  const [loading, setLoading] = useState(true)

  usePageMeta(collection?.name ?? (filters.q ? `Search: ${filters.q}` : 'Shop all'), collection?.blurb ?? 'Browse the full AW 2028 menswear collection: shirts, denim, tailoring, knitwear, outerwear and ethnic wear.')

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 380)
    return () => window.clearTimeout(t)
  }, [])

  const results = useMemo(() => sortProducts(applyFilters(getProducts(), filters, collection?.base), sort, filters.q), [filters, sort, collection])

  const update = (patch: Partial<ShopFilters>, nextSort: SortKey = sort) => setSp(paramsFromFilters({ ...filters, ...patch }, nextSort))
  const clearAll = () => setSp(paramsFromFilters(emptyFilters, sort))
  const count = activeFilterCount(filters) + (filters.q ? 1 : 0)

  const title = collection?.name ?? (filters.q ? 'Search results' : 'All products')
  const gridClass = `${MOBILE_COLS[density.mobile]} ${DESKTOP_COLS[density.desktop]}`

  return (
    <div>
      <section className="wrap pb-8 pt-10 md:pt-16">
        <nav aria-label="Breadcrumb" className="label mb-6 text-stone">
          <ol className="flex flex-wrap gap-2">
            <li><Link to="/" className="hover:text-ink">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/shop" className="hover:text-ink">Shop</Link></li>
            {collection && (<><li aria-hidden="true">/</li><li aria-current="page" className="text-ink">{collection.name}</li></>)}
          </ol>
        </nav>
        <SplitLines as="h1" lines={[title]} className="display display-xl" immediate />
        <p className="mt-5 max-w-[56ch] text-lg text-stone">{collection?.blurb ?? 'Everything from the AW 2028 collection, in one place.'}</p>
      </section>

      <div className="wrap hairline-t flex items-center justify-between gap-3 py-3">
        <p role="status" aria-live="polite" className="label num text-stone">{results.length} {results.length === 1 ? 'piece' : 'pieces'}</p>
        <div className="flex items-center gap-2">
          {!desktop && (
            <Button variant="outline" className="min-h-11 px-4" onClick={() => openOverlay('filters')}>
              <SlidersHorizontal size={16} /> Filter &amp; sort{count > 0 ? ` (${count})` : ''}
            </Button>
          )}
          {desktop && (
            <label className="flex items-center gap-2">
              <span className="label text-stone">Sort</span>
              <select value={sort} onChange={(e) => update({}, e.target.value as SortKey)} className="label min-h-11 border border-line bg-paper px-3">
                {sortOptions.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
              </select>
            </label>
          )}
          <DensityToggle desktop={desktop} value={desktop ? density.desktop : density.mobile} onChange={(n) => setDensity((d) => (desktop ? { ...d, desktop: n } : { ...d, mobile: n }))} />
        </div>
      </div>

      <div className="wrap hairline-t grid grid-cols-1 gap-10 pb-24 pt-8 lg:grid-cols-[260px_1fr]">
        {desktop && (
          <aside aria-label="Filters" className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] self-start overflow-y-auto pr-2 lg:block">
            <FilterPanel filters={filters} onChange={(p) => update(p)} categoryScope={collection?.base.categories} />
          </aside>
        )}
        <div className="min-w-0">
          <div className="mb-6 empty:hidden">
            <ActiveFilterChips filters={filters} onChange={(p) => update(p)} onClear={clearAll} />
          </div>
          {loading ? (
            <div className={`grid gap-x-4 gap-y-10 ${gridClass}`} aria-busy="true">
              {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : results.length === 0 ? (
            <div className="grid place-items-center gap-5 py-24 text-center">
              <p className="display display-md">Nothing matches those filters</p>
              <p className="max-w-[40ch] text-stone">Try removing a filter or two, or start again from the full collection.</p>
              <Button onClick={clearAll}>Reset filters</Button>
            </div>
          ) : (
            <ResultsGrid key={sp.toString()} list={results} gridClass={gridClass} />
          )}
        </div>
      </div>

      {!desktop && (
        <FilterSheet
          open={overlay?.name === 'filters'}
          onClose={() => closeOverlay('filters')}
          filters={filters}
          sort={sort}
          resultCount={(f) => applyFilters(getProducts(), f, collection?.base).length}
          onApply={(f, s) => {
            setSp(paramsFromFilters(f, s))
            closeOverlay('filters')
          }}
          categoryScope={collection?.base.categories}
        />
      )}
    </div>
  )
}

function ResultsGrid({ list, gridClass }: { list: ReturnType<typeof getProducts>; gridClass: string }) {
  const [limit, setLimit] = useState(PAGE_SIZE)
  const shown = list.slice(0, limit)
  const remaining = list.length - shown.length
  return (
    <>
      <motion.div layout className={`grid gap-x-4 gap-y-10 ${gridClass}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p, i) => <ProductCard key={p.id} product={p} index={i} animateLayout priority={i < 2} />)}
        </AnimatePresence>
      </motion.div>
      {remaining > 0 && (
        <div className="mt-14 flex flex-col items-center gap-3">
          <p className="label num text-stone">Showing {shown.length} of {list.length}</p>
          <Button variant="outline" onClick={() => setLimit((l) => l + PAGE_SIZE)}>Load {Math.min(PAGE_SIZE, remaining)} more</Button>
        </div>
      )}
    </>
  )
}

function DensityToggle({ desktop, value, onChange }: { desktop: boolean; value: number; onChange: (n: number) => void }) {
  const opts = desktop
    ? [{ n: 2, I: Columns2 }, { n: 3, I: Columns3 }, { n: 4, I: Columns4 }]
    : [{ n: 1, I: Columns2 }, { n: 2, I: Columns3 }]
  return (
    <div role="group" aria-label="Grid density" className="flex">
      {opts.map(({ n, I }) => (
        <button key={n} type="button" aria-pressed={value === n} aria-label={`${n} column${n > 1 ? 's' : ''}`} onClick={() => onChange(n)} className={`grid h-11 w-11 place-items-center ${value === n ? 'text-ink' : 'text-stone-soft hover:text-ink'}`}>
          <I size={20} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  )
}

interface SheetProps {
  open: boolean
  onClose: () => void
  filters: ShopFilters
  sort: SortKey
  resultCount: (f: ShopFilters) => number
  onApply: (f: ShopFilters, s: SortKey) => void
  categoryScope?: ShopFilters['categories']
}

function FilterSheet(props: SheetProps) {
  return (
    <Overlay open={props.open} onClose={props.onClose} label="Filter and sort" variant="sheet" responsive={false}>
      <SheetBody {...props} />
    </Overlay>
  )
}

function SheetBody({ onClose, filters, sort, resultCount, onApply, categoryScope }: SheetProps) {
  const [draft, setDraft] = useState(filters)
  const [draftSort, setDraftSort] = useState(sort)
  return (
    <>
      <div className="flex items-center justify-between pl-6">
        <h2 className="display display-md">Filter &amp; sort</h2>
        <CloseButton onClick={onClose} className="m-2" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
        <fieldset className="mb-4 border-0 p-0">
          <legend className="label mb-3">Sort by</legend>
          <div className="grid gap-1">
            {sortOptions.map((o) => (
              <label key={o.key} className="flex min-h-11 items-center gap-3">
                <input type="radio" name="sheet-sort" checked={draftSort === o.key} onChange={() => setDraftSort(o.key)} className="accent-[var(--color-ink)]" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
        <FilterPanel filters={draft} onChange={(p) => setDraft((d) => ({ ...d, ...p }))} categoryScope={categoryScope} />
      </div>
      <div className="hairline-t grid grid-cols-2 gap-3 bg-bone p-4">
        <Button variant="outline" onClick={() => { setDraft({ ...emptyFilters, q: draft.q }); setDraftSort('featured') }}>Reset</Button>
        <Button onClick={() => onApply(draft, draftSort)}>Show {resultCount(draft)} results</Button>
      </div>
    </>
  )
}
