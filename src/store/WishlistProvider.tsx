import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { brand } from '@/config/brand'
import { isStringArray, readJSON, writeJSON } from '@/lib/storage'
import { WishlistContext } from '@/store/wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => readJSON(brand.storageKeys.wishlist, [], isStringArray))

  useEffect(() => writeJSON(brand.storageKeys.wishlist, ids), [ids])

  const has = useCallback((id: string) => ids.includes(id), [ids])
  /** Returns true when the product is now in the wishlist. */
  const toggle = useCallback(
    (id: string) => {
      const added = !ids.includes(id)
      setIds(added ? [...ids, id] : ids.filter((x) => x !== id))
      return added
    },
    [ids],
  )
  const remove = useCallback((id: string) => setIds((cur) => cur.filter((x) => x !== id)), [])

  const value = useMemo(() => ({ ids, has, toggle, remove }), [ids, has, toggle, remove])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
