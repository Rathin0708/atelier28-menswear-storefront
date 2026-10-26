import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Motion'
import { editorial } from '@/data/images'
import { useInViewOnce } from '@/hooks'

const stats = [
  { value: 100, suffix: '%', label: 'Long-staple cotton in our tees' },
  { value: 48, suffix: 'hr', label: 'Dispatch from the atelier' },
  { value: 12, suffix: '', label: 'Partner workshops — made in India' },
]

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const seen = useInViewOnce(ref)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen || reduce) return
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [seen, to, reduce])
  return (
    <span ref={ref} className="num">
      <span className="sr-only">{to}{suffix}</span>
      <span aria-hidden="true">{reduce ? to : n}{suffix}</span>
    </span>
  )
}

export function StatsRow() {
  return (
    <dl className="grid gap-10 sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="hairline-t flex flex-col pt-5">
          <dt className="order-2 mt-3 text-[15px] opacity-75">{s.label}</dt>
          <dd className="display text-[clamp(3rem,6vw,5.5rem)] leading-none"><CountUp to={s.value} suffix={s.suffix} /></dd>
        </div>
      ))}
    </dl>
  )
}

export function BrandStory() {
  return (
    <section aria-labelledby="story-h" className="bg-paper">
      <div className="wrap section-pad grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <Reveal>
          <p className="label text-stone">06 / The atelier</p>
          <blockquote className="mt-6">
            <p id="story-h" className="display display-lg">“Clothes should get better with you, not tired of you.”</p>
            <footer className="label mt-6 text-stone">— Founder’s note</footer>
          </blockquote>
          <div className="mt-10 hidden lg:block"><Img src={editorial.story} alt="A man in a dark suit in the studio" ratio="4 / 3" sizes="40vw" className="w-full" /></div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-[56ch] text-lg leading-relaxed text-stone">ATELIER 28 started as a single pattern table in Mumbai. Today we still draft every garment ourselves and work with a handful of mills and workshops we know by name — people who would rather make fewer things properly than many things quickly.</p>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-stone">The number 28 is the number of fittings our first jacket went through. We never stopped counting.</p>
          <div className="mt-14"><StatsRow /></div>
          <Link to="/about" className="label link-u mt-12 inline-flex min-h-11 items-center">Read our story</Link>
        </Reveal>
      </div>
    </section>
  )
}
