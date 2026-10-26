import { createContext, useContext } from 'react'
import type { CartTotals, DetailedLine } from '@/lib/cart'
import type { CartLine, Product } from '@/types'

export interface CartContextValue {
  lines: DetailedLine[]
  totals: CartTotals
  promo: string | null
  promoRate: number
  /** Increments on every add so the header badge can animate. */
  bump: number
  add: (product: Product, color: string, size: string, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => CartLine | undefined
  restore: (line: CartLine, index: number) => void
  applyPromo: (code: string) => 'ok' | 'invalid'
  clearPromo: () => void
  clear: () => void
  indexOf: (key: string) => number
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
