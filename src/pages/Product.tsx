import { Truck } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Accordion, Button, Stars, Badge } from '@/components/ui/Controls'
import { Price } from '@/components/product/Price'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductRail } from '@/components/product/ProductRail'
import { PurchasePanel } from '@/components/product/PurchasePanel'
import { getCategoryName, getProductBySlug, getProducts } from '@/data/api'
import { useRecentlyViewed } from '@/hooks'
import { usePageMeta } from '@/hooks/usePageMeta'
import { formatPrice } from '@/lib/format'
import NotFound from '@/pages/NotFound'
import type { CategorySlug, Product as ProductType } from '@/types'

const COMPLEMENTS: Record<CategorySlug, CategorySlug[]> = {
  't-shirts': ['jeans', 'jackets', 'accessories'],
  shirts: ['trousers', 'jeans', 'accessories'],
  jeans: ['t-shirts', 'shirts', 'jackets'],
  trousers: ['shirts', 'knitwear', 'accessories'],
  jackets: ['t-shirts', 'jeans', 'knitwear'],
  'ethnic-wear': ['accessories', 'trousers'],
  knitwear: ['trousers', 'jeans', 'shirts'],
  accessories: ['t-shirts', 'jeans', 'shirts'],
}

export default function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)
  if (!product) return <NotFound />
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }: { product: ProductType }) {
  const [colorIndex, setColorIndex] = useState(0)
  const { ids, push } = useRecentlyViewed()
  const panelRef = useRef<HTMLDivElement>(null)
  const addRef = useRef<() => boolean>(() => false)
  const [barVisible, setBarVisible] = useState(false)

  usePageMeta(product.name, product.description)
  useEffect(() => push(product.id), [push, product.id])

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setBarVisible(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const color = product.colors[colorIndex]
  const all = getProducts()
  const completeLook = useMemo(
    () => COMPLEMENTS[product.category].flatMap((c) => all.filter((p) => p.category === c).slice(0, 2)).slice(0, 6),
    [all, product.category],
  )
  const similar = useMemo(
    () => all.filter((p) => p.id !== product.id && (p.category === product.category || p.tags.some((t) => product.tags.includes(t)))).sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category)).slice(0, 8),
    [all, product],
  )
  const recent = ids.filter((id) => id !== product.id).map((id) => all.find((p) => p.id === id)).filter((p): p is ProductType => !!p).slice(0, 6)

  return (
    <article>
      <div className="wrap pt-6 lg:pt-10">
        <nav aria-label="Breadcrumb" className="label mb-6 text-stone">
          <ol className="flex flex-wrap gap-2">
            <li><Link to="/" className="hover:text-ink">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to={`/collections/${product.category}`} className="hover:text-ink">{getCategoryName(product.category)}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{product.name}</li>
          </ol>
        </nav>
      </div>

      <div className="wrap grid grid-cols-1 gap-8 pb-16 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <ProductGalleryColumn product={product} colorIndex={colorIndex} />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            {product.badges.map((b) => <Badge key={b} kind={b} />)}
          </div>
          <p className="label mt-4 text-stone">{getCategoryName(product.category)} · {product.subcategory}</p>
          <h1 className="display display-lg mt-2">{product.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Price product={product} className="text-xl" />
            <Stars rating={product.rating} count={product.reviewCount} />
          </div>
          <p className="mt-6 max-w-[56ch] text-[16px] leading-relaxed text-stone">{product.description}</p>

          <div ref={panelRef} className="mt-8">
            <PurchasePanel product={product} colorIndex={colorIndex} onColorChange={setColorIndex} scope={`pdp-${product.id}`} registerAdd={(fn) => {
                addRef.current = fn
              }} />
          </div>

          <PincodeCheck />

          <div className="mt-10">
            <Accordion
              items={[
                {
                  title: 'Details',
                  content: <ul className="list-disc space-y-1 pl-5">{product.details.map((d) => <li key={d}>{d}</li>)}</ul>,
                },
                {
                  title: 'Fabric & care',
                  content: (
                    <>
                      <p className="mb-3">Fabric: <strong className="font-medium text-ink">{product.fabric}</strong></p>
                      <ul className="list-disc space-y-1 pl-5">{product.care.map((c) => <li key={c}>{c}</li>)}</ul>
                    </>
                  ),
                },
                { title: 'Fit', content: <p>{fitCopy(product.fit)} The model is 6′0″ (183 cm) and wears size {product.category === 'jeans' || product.category === 'trousers' ? '32' : 'M'}.</p> },
                { title: 'Shipping & returns', content: <p>Free shipping above {formatPrice(4999)}; otherwise {formatPrice(199)}. Dispatched within 48 hours. Free 14-day returns on unworn items with tags. <Link to="/returns" className="underline underline-offset-4">Read the policy</Link>.</p> },
              ]}
              defaultOpen={0}
            />
          </div>
        </div>
      </div>

      <section className="wrap hairline-t section-pad">
        <ProductRail products={completeLook} label="Complete the look" header={<h2 className="display display-lg">Complete the look</h2>} />
      </section>
      <section className="wrap hairline-t section-pad">
        <ProductRail products={similar} label="You may also like" header={<h2 className="display display-lg">You may also like</h2>} />
      </section>
      {recent.length > 0 && (
        <section className="wrap hairline-t section-pad">
          <ProductRail products={recent} label="Recently viewed" header={<h2 className="display display-md">Recently viewed</h2>} />
        </section>
      )}

      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-line bg-bone px-4 py-3 transition-transform duration-300 lg:hidden ${barVisible ? 'translate-y-0' : 'translate-y-full'}`}
        aria-hidden={!barVisible}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{product.name}</p>
          <Price product={product} className="text-sm" />
        </div>
        <Button
          tabIndex={barVisible ? 0 : -1}
          className="shrink-0"
          onClick={() => {
            if (!addRef.current()) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }}
        >
          Add to cart
        </Button>
      </div>
      <span className="sr-only">{color.name} selected</span>
    </article>
  )
}

function ProductGalleryColumn({ product, colorIndex }: { product: ProductType; colorIndex: number }) {
  return <ProductGallery images={product.colors[colorIndex].images} name={`${product.name} in ${product.colors[colorIndex].name}`} />
}

const fitCopy = (fit: ProductType['fit']) =>
  ({
    Slim: 'A close, tailored cut through the body. Size up if you are between sizes or prefer room.',
    Regular: 'A classic, comfortable cut that sits true to size.',
    Relaxed: 'A roomier, easy cut with a dropped shoulder. True to size for the intended look; size down for a closer fit.',
  })[fit]

function PincodeCheck() {
  const [pin, setPin] = useState('')
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      setResult({ ok: false, text: 'Enter a valid 6-digit pincode.' })
      return
    }
    const first = Number(pin[0])
    const days = first <= 4 ? '3–4' : first <= 7 ? '4–5' : '5–7'
    setResult({ ok: true, text: `Delivers in ${days} days to ${pin}.` })
  }

  return (
    <form onSubmit={submit} noValidate className="mt-8 border border-line p-4" aria-label="Check delivery">
      <label htmlFor="pincode" className="label mb-2 flex items-center gap-2"><Truck size={16} /> Check delivery</label>
      <div className="flex gap-2">
        <input
          id="pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          aria-invalid={result?.ok === false}
          aria-describedby="pincode-msg"
          placeholder="Enter pincode"
          className="num min-h-12 min-w-0 flex-1 border border-line bg-paper px-4"
        />
        <Button type="submit" variant="outline">Check</Button>
      </div>
      <p id="pincode-msg" role="status" className={`mt-2 min-h-5 text-sm ${result?.ok === false ? 'text-oxblood' : 'text-olive'}`}>{result?.text}</p>
    </form>
  )
}
