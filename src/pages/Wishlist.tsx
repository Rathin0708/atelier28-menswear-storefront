import { X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '@/components/ui/Img'
import { Button, ButtonLink } from '@/components/ui/Controls'
import { SplitLines } from '@/components/ui/Motion'
import { Price } from '@/components/product/Price'
import { SizeSelector } from '@/components/product/Selectors'
import { getCategoryName, getProductById } from '@/data/api'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useCommerce } from '@/store/actions'
import { useWishlist } from '@/store/wishlist'
import type { Product } from '@/types'

export default function Wishlist() {
  const { ids } = useWishlist()
  usePageMeta('Wishlist', 'Pieces you have saved for later.')
  const items = ids.map(getProductById).filter((p): p is Product => !!p)
  return (
    <div className="wrap pb-24 pt-10 md:pt-16">
      <SplitLines as="h1" lines={['Wishlist']} className="display display-xl" immediate />
      <p className="mt-4 text-stone num">{items.length} saved {items.length === 1 ? 'piece' : 'pieces'}</p>
      {items.length === 0 ? (
        <div className="grid place-items-center gap-5 py-24 text-center">
          <p className="display display-md">Nothing saved yet</p>
          <p className="max-w-[40ch] text-stone">Tap the heart on anything you love and it will wait for you here.</p>
          <ButtonLink to="/shop">Discover the collection</ButtonLink>
        </div>
      ) : (
        <ul className="mt-10 grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => <WishlistItem key={p.id} product={p} />)}
        </ul>
      )}
    </div>
  )
}

function WishlistItem({ product }: { product: Product }) {
  const { remove } = useWishlist()
  const { addToCart } = useCommerce()
  const [size, setSize] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const oneSize = product.sizes.length === 1
  const soldOut = product.sizes.every((s) => !s.inStock)

  const move = () => {
    const chosen = oneSize && product.sizes[0].inStock ? product.sizes[0].label : size
    if (!chosen) {
      setError(true)
      return
    }
    addToCart(product, product.colors[0].name, chosen, 1, false)
    remove(product.id)
  }

  return (
    <li className="relative flex flex-col">
      <Link to={`/product/${product.slug}`} className="block">
        <Img src={product.colors[0].images[0]} alt={product.name} ratio="4 / 5" sizes="(min-width: 1024px) 25vw, 50vw" className="w-full" />
      </Link>
      <button type="button" aria-label={`Remove ${product.name} from wishlist`} onClick={() => remove(product.id)} className="absolute right-1 top-1 grid h-11 w-11 place-items-center bg-paper/80">
        <X size={18} />
      </button>
      <p className="label mt-3 text-stone">{getCategoryName(product.category)}</p>
      <h2 className="text-[15px] font-medium"><Link to={`/product/${product.slug}`} className="hover:text-oxblood">{product.name}</Link></h2>
      <Price product={product} className="text-sm" />
      {!oneSize && !soldOut && (
        <div className="mt-3">
          <SizeSelector sizes={product.sizes} value={size} onChange={(s) => { setSize(s); setError(false) }} name={`wl-${product.id}`} invalid={error} />
          <p role="alert" className="mt-1 min-h-5 text-sm text-oxblood">{error && 'Select a size to move this to your cart.'}</p>
        </div>
      )}
      <Button variant="outline" className="mt-3" disabled={soldOut} onClick={move}>{soldOut ? 'Sold out' : 'Move to cart'}</Button>
    </li>
  )
}
