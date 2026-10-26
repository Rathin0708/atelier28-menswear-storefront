import { BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Stars } from '@/components/ui/Controls'
import { Reveal } from '@/components/ui/Motion'
import { getProductBySlug } from '@/data/api'
import { press, testimonials } from '@/data/testimonials'

export function Testimonials() {
  return (
    <section aria-labelledby="proof-h" className="hairline-t">
      <div className="wrap section-pad">
        <p className="label text-stone">08 / In their words</p>
        <Reveal><h2 id="proof-h" className="display display-lg mt-3">Worn, washed,<br />and kept.</h2></Reveal>
        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => {
            const product = getProductBySlug(t.productSlug)
            return (
              <li key={t.id} className={i % 2 ? 'lg:mt-14' : ''}>
                <Reveal delay={i * 0.07} className="flex h-full flex-col bg-paper p-7">
                  <Stars rating={t.rating} />
                  <h3 className="display mt-5 text-2xl leading-tight">{t.title}</h3>
                  <p className="mt-4 flex-1 text-[15px] text-stone">{t.body}</p>
                  <div className="mt-6 hairline-t pt-4 text-sm">
                    <p className="flex items-center gap-1.5 font-medium">{t.name}, {t.city}</p>
                    <p className="label mt-1 flex items-center gap-1 text-olive"><BadgeCheck size={14} aria-hidden="true" /> Verified buyer</p>
                    {product && <p className="mt-2 text-stone">Bought: <Link to={`/product/${product.slug}`} className="underline underline-offset-4 hover:text-oxblood">{product.name}</Link></p>}
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ul>
        <ul className="mt-20 grid gap-8 hairline-t pt-10 sm:grid-cols-2 lg:grid-cols-4" aria-label="Press">
          {press.map((p) => (
            <li key={p.name}>
              <p className="display text-xl leading-snug">“{p.quote}”</p>
              <p className="label mt-3 text-stone">{p.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
