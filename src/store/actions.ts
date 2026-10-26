import { useCallback } from 'react'
import { useCart } from '@/store/cart'
import { useUI } from '@/store/ui'
import { useWishlist } from '@/store/wishlist'
import type { CartLine, Product } from '@/types'

/** Cross-store commerce actions that also raise the right feedback (toast / drawer). */
export function useCommerce() {
  const cart = useCart()
  const ui = useUI()
  const wishlist = useWishlist()

  const addToCart = useCallback(
    (product: Product, color: string, size: string, qty = 1, openDrawer = true) => {
      cart.add(product, color, size, qty)
      if (openDrawer) ui.openOverlay('cart')
      else ui.toast(`Added ${product.name} (${size}) to your cart`, { label: 'View cart', onClick: () => ui.openOverlay('cart') })
    },
    [cart, ui],
  )

  const removeWithUndo = useCallback(
    (key: string) => {
      const index = cart.indexOf(key)
      const line = cart.remove(key)
      if (!line) return
      const restore = (l: CartLine, i: number) => cart.restore(l, i)
      ui.toast('Item removed from cart', { label: 'Undo', onClick: () => restore(line, index) })
    },
    [cart, ui],
  )

  const toggleWishlist = useCallback(
    (product: Product) => {
      const added = wishlist.toggle(product.id)
      ui.toast(added ? `Saved ${product.name} to your wishlist` : `Removed ${product.name} from your wishlist`)
    },
    [wishlist, ui],
  )

  return { addToCart, removeWithUndo, toggleWishlist }
}
