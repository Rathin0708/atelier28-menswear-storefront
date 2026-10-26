import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Img } from '@/components/ui/Img'
import { getCategories } from '@/data/api'
import { editorial } from '@/data/images'
import { DUR, EASE_OVERLAY } from '@/lib/motion'

const quick = [
  { label: 'New Arrivals', to: '/collections/new-arrivals' },
  { label: 'Best Sellers', to: '/collections/best-sellers' },
  { label: 'The Outerwear Edit', to: '/collections/outerwear-edit' },
  { label: 'Seasonal Edit', to: '/collections/sale' },
]

export function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const cats = getCategories()
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: DUR.ui, ease: EASE_OVERLAY }}
      className="absolute inset-x-0 top-full border-t border-line bg-bone text-ink"
    >
      <div className="wrap grid grid-cols-[1fr_1fr_1fr_1.1fr] gap-10 py-10">
        <div>
          <p className="label mb-4 text-stone">Clothing</p>
          <ul>
            {cats.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link to={`/collections/${c.slug}`} onClick={onNavigate} className="display block py-1 text-3xl hover:text-oxblood">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-4 text-stone">More</p>
          <ul>
            {cats.slice(5).map((c) => (
              <li key={c.slug}>
                <Link to={`/collections/${c.slug}`} onClick={onNavigate} className="display block py-1 text-3xl hover:text-oxblood">{c.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/shop" onClick={onNavigate} className="label link-u mt-4 inline-flex min-h-11 items-center">Shop everything</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="label mb-4 text-stone">Edits</p>
          <ul>
            {quick.map((q) => (
              <li key={q.to}>
                <Link to={q.to} onClick={onNavigate} className="block py-2 hover:text-oxblood">{q.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/collections/outerwear-edit" onClick={onNavigate} className="group relative block overflow-hidden" data-cursor="VIEW">
          <Img src={editorial.mega} alt="A model in sunglasses on a bridge" ratio="4 / 3" sizes="400px" className="w-full transition-transform duration-[1200ms] group-hover:scale-105" />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 text-bone">
            <span className="label block">AW 2028</span>
            <span className="display text-2xl">The Outerwear Edit</span>
          </span>
        </Link>
      </div>
    </motion.div>
  )
}
