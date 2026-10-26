import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { useCommerce } from '@/store/actions'
import { useWishlist } from '@/store/wishlist'
import type { Product } from '@/types'

export function WishlistButton({ product, className = '', showLabel = false }: { product: Product; className?: string; showLabel?: boolean }) {
  const { has } = useWishlist()
  const { toggleWishlist } = useCommerce()
  const active = has(product.id)
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`${active ? 'Remove' : 'Add'} ${product.name} ${active ? 'from' : 'to'} wishlist`}
      onClick={() => toggleWishlist(product)}
      className={`inline-flex h-11 items-center justify-center gap-2 hover:text-oxblood ${showLabel ? 'border border-line px-4 label hover:border-ink' : 'w-11'} ${className}`}
    >
      <motion.span key={String(active)} initial={{ scale: active ? 0.6 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }} className="inline-grid">
        <Heart size={20} strokeWidth={1.5} className={active ? 'fill-oxblood text-oxblood' : ''} />
      </motion.span>
      {showLabel && <span>{active ? 'Saved' : 'Wishlist'}</span>}
    </button>
  )
}
