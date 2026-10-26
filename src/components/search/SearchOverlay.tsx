import { Search } from 'lucide-react'
import { useMemo, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CloseButton } from '@/components/ui/Controls'
import { Img } from '@/components/ui/Img'
import { Overlay } from '@/components/ui/Overlay'
import { getCategories, getCategoryName, getProducts } from '@/data/api'
import { trendingSearches } from '@/data/site'
import { useDebounced } from '@/hooks'
import { formatPrice } from '@/lib/format'
import { highlight, searchProducts } from '@/lib/shop'
import { useUI } from '@/store/ui'

export default function SearchOverlay() {
  const { overlay, closeOverlay } = useUI()
  const open = overlay?.name === 'search'
  const close = () => closeOverlay('search')
  return (
    <Overlay open={open} onClose={close} label="Search" variant="fullscreen" responsive={false} panelClassName="!bg-bone">
      <SearchBody onClose={close} />
    </Overlay>
  )
}

function SearchBody({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)
  const debounced = useDebounced(query, 150)
  const trimmed = debounced.trim()
  const results = useMemo(() => (trimmed ? searchProducts(getProducts(), trimmed, 8) : []), [trimmed])

  const seeAll = (q: string) => {
    onClose()
    navigate(`/shop?q=${encodeURIComponent(q)}`)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(results.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(-1, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (active >= 0 && results[active]) {
        onClose()
        navigate(`/product/${results[active].slug}`)
      } else if (query.trim()) seeAll(query.trim())
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="wrap flex items-center gap-3 py-4">
        <Search size={22} strokeWidth={1.5} aria-hidden="true" />
        <label htmlFor="site-search" className="sr-only">Search products</label>
        <input
          id="site-search"
          data-autofocus
          type="search"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="search-results"
          aria-activedescendant={active >= 0 ? `search-opt-${active}` : undefined}
          autoComplete="off"
          placeholder="Search shirts, denim, kurta…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(-1)
          }}
          onKeyDown={onKeyDown}
          className="display min-w-0 flex-1 bg-transparent text-[clamp(1.6rem,5vw,3.5rem)] outline-none placeholder:text-stone-soft"
        />
        <CloseButton onClick={onClose} />
      </div>
      <div className="hairline-t" />

      <div className="wrap flex-1 py-8">
        <p className="sr-only" role="status" aria-live="polite">
          {trimmed ? `${results.length} result${results.length === 1 ? '' : 's'} for ${trimmed}` : ''}
        </p>
        {!trimmed && (
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="label mb-4 text-stone">Trending</p>
              <ul className="flex flex-wrap gap-2">
                {trendingSearches.map((t) => (
                  <li key={t}>
                    <button type="button" onClick={() => setQuery(t)} className="label min-h-11 border border-line px-4 hover:border-ink">{t}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label mb-4 text-stone">Popular categories</p>
              <ul className="grid grid-cols-2 gap-x-6">
                {getCategories().map((c) => (
                  <li key={c.slug} className="hairline-b">
                    <Link to={`/collections/${c.slug}`} onClick={onClose} className="flex min-h-12 items-center justify-between hover:text-oxblood">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {trimmed && results.length > 0 && (
          <>
            <ul id="search-results" role="listbox" aria-label="Search results" className="grid gap-x-10 md:grid-cols-2">
              {results.map((p, i) => (
                <li key={p.id} id={`search-opt-${i}`} role="option" aria-selected={i === active} className={`hairline-b ${i === active ? 'bg-paper' : ''}`}>
                  <Link to={`/product/${p.slug}`} onClick={onClose} className="flex items-center gap-4 py-3">
                    <Img src={p.colors[0].images[0]} alt="" ratio="4 / 5" sizes="64px" className="w-14 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {highlight(p.name, trimmed).map((seg, k) => (
                          seg.hit ? <mark key={k} className="bg-transparent text-oxblood underline underline-offset-4">{seg.text}</mark> : <span key={k}>{seg.text}</span>
                        ))}
                      </p>
                      <p className="label text-stone">{getCategoryName(p.category)}</p>
                    </div>
                    <p className="num text-sm">{formatPrice(p.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => seeAll(trimmed)} className="label link-u mt-8 min-h-11">
              See all results for “{trimmed}”
            </button>
          </>
        )}

        {trimmed && results.length === 0 && (
          <div className="max-w-xl">
            <p className="display display-md">No results for “{trimmed}”</p>
            <p className="mt-3 text-stone">Check the spelling, or try one of these instead:</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {trendingSearches.slice(0, 4).map((t) => (
                <li key={t}>
                  <button type="button" onClick={() => setQuery(t)} className="label min-h-11 border border-line px-4 hover:border-ink">{t}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
