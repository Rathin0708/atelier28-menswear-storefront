import { Link } from 'react-router-dom'
import { ProductRail } from '@/components/product/ProductRail'
import { Reveal } from '@/components/ui/Motion'
import { getProducts } from '@/data/api'

export function NewArrivals() {
  const items = getProducts().filter((p) => p.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10)
  return (
    <section id="new" aria-labelledby="new-h" className="hairline-t bg-paper py-[clamp(56px,8vw,120px)]">
      <div className="wrap">
        <ProductRail
          label="New arrivals"
          products={items}
          header={
            <>
              <p className="label text-stone">02 / New arrivals</p>
              <Reveal><h2 id="new-h" className="display display-lg mt-3">Just landed</h2></Reveal>
              <Link to="/collections/new-arrivals" className="label link-u mt-4 inline-flex min-h-11 items-center">View all new</Link>
            </>
          }
        />
      </div>
    </section>
  )
}
