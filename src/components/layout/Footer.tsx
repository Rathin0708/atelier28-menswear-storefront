import { ArrowUp, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { brand } from '@/config/brand'
import { footerColumns } from '@/data/site'

const social = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'YouTube', href: 'https://www.youtube.com/' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/' },
]

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-bone" data-dark>
      <div className="wrap pt-20 md:pt-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <p className="display text-3xl">{brand.tagline}</p>
            <p className="mt-6 flex items-start gap-2 text-sm text-bone/70">
              <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>Flagship atelier — Kala Ghoda, {brand.city}. <Link to="/stores" className="underline underline-offset-4">Find a store</Link></span>
            </p>
          </div>
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="label mb-4 text-bone/60">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="inline-flex min-h-10 items-center text-[15px] hover:text-bone/70">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-bone/15 py-6 text-sm text-bone/70">
          <ul className="flex flex-wrap gap-x-6">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center hover:text-bone">{s.label}<span className="sr-only"> (opens in a new tab)</span></a>
              </li>
            ))}
          </ul>
          <ul className="label flex flex-wrap items-center gap-2 text-bone/80" aria-label="Payment methods (demo only)">
            {['UPI', 'Visa', 'Mastercard', 'COD'].map((p) => (
              <li key={p} className="border border-bone/25 px-2 py-1">{p} · Demo</li>
            ))}
          </ul>
          <p className="label">IN · {brand.currency} ₹</p>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }) }} className="label inline-flex min-h-11 items-center gap-2 hover:text-bone/70">
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </div>
      <div aria-hidden="true" className="display overflow-hidden whitespace-nowrap px-[var(--gutter)] pb-6 text-center text-[clamp(3rem,15.5vw,17rem)] leading-[0.8] text-bone/95" style={{ fontWeight: 300 }}>
        {brand.name}
      </div>
      <p className="wrap pb-8 text-xs text-bone/50">© {YEAR} {brand.name}. A frontend demo — products, prices and checkout are sample data; no payment is processed.</p>
    </footer>
  )
}
