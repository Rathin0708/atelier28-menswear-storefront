import { createContext, useContext } from 'react'

export interface WishlistContextValue {
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => boolean
  remove: (id: string) => void
}

export const WishlistContext = createContext<WishlistContextValue | null>(null)

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
