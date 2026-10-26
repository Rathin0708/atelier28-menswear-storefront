import { useEffect, useState } from 'react'
import { ButtonLink } from '@/components/ui/Controls'
import { Reveal } from '@/components/ui/Motion'
import { brand } from '@/config/brand'
import { pad2 } from '@/lib/format'

const end = new Date(brand.promoEndsAt).getTime()

function remaining(now: number) {
  const ms = Math.max(0, end - now)
  const s = Math.floor(ms / 1000)
  return { done: ms === 0, d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

export function PromoCountdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])
  const r = remaining(now)

  return (
    <section aria-labelledby="promo-h" className="overflow-hidden bg-oxblood text-bone" data-dark>
      <div className="wrap section-pad">
        <p className="label text-bone/80">07 / Limited time</p>
        <Reveal>
          <h2 id="promo-h" className="display display-hero mt-4 uppercase">The outerwear<br />edit</h2>
          <p className="display mt-4 text-[clamp(1.6rem,4vw,3.6rem)]">Up to 30% off — while it lasts.</p>
        </Reveal>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-10">
          {r.done ? (
            <p role="status" className="display display-md max-w-[22ch]">This edit has ended. Explore what is new this season.</p>
          ) : (
            <div>
              <p className="label mb-3 text-bone/80">Ends in</p>
              <p className="sr-only" role="timer">{r.d} days and {r.h} hours remaining</p>
              <ul aria-hidden="true" className="flex gap-4 sm:gap-8">
                {[['Days', r.d], ['Hrs', r.h], ['Min', r.m], ['Sec', r.s]].map(([l, v]) => (
                  <li key={l} className="text-center">
                    <span className="display num block text-[clamp(2.6rem,7vw,6rem)] leading-none">{pad2(Number(v))}</span>
                    <span className="label text-bone/80">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ButtonLink to={r.done ? '/collections/new-arrivals' : '/collections/outerwear-edit?sale=1'} variant="light">{r.done ? 'Shop new arrivals' : 'Shop the edit'}</ButtonLink>
        </div>
      </div>
    </section>
  )
}
