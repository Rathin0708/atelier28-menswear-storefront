import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { brand } from '@/config/brand'
import { cartTotals, detailLines, isValidCartLines, lineKey } from '@/lib/cart'
import { readJSON, writeJSON } from '@/lib/storage'
import { CartContext } from '@/store/cart'
import type { CartLine, Product } from '@/types'

interface CartState {
  lines: CartLine[]
  promo: string | null
}

type Action =
  | { type: 'add'; line: CartLine }
  | { type: 'qty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'restore'; line: CartLine; index: number }
  | { type: 'promo'; code: string | null }
  | { type: 'clear' }

const MAX_QTY = 10

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.lines.find((l) => l.key === action.line.key)
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.key === existing.key ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.line.qty) } : l,
          ),
        }
      }
      return { ...state, lines: [...state.lines, action.line] }
    }
    case 'qty':
      return {
        ...state,
        lines: state.lines.map((l) => (l.key === action.key ? { ...l, qty: Math.max(1, Math.min(MAX_QTY, action.qty)) } : l)),
      }
    case 'remove':
      return { ...state, lines: state.lines.filter((l) => l.key !== action.key) }
    case 'restore': {
      if (state.lines.some((l) => l.key === action.line.key)) return state
      const lines = [...state.lines]
      lines.splice(Math.min(action.index, lines.length), 0, action.line)
      return { ...state, lines }
    }
    case 'promo':
      return { ...state, promo: action.code }
    case 'clear':
      return { lines: [], promo: null }
  }
}

interface Persisted {
  lines: CartLine[]
  promo: string | null
}

const isPersisted = (v: unknown): v is Persisted =>
  !!v && typeof v === 'object' && isValidCartLines((v as Persisted).lines) &&
  (typeof (v as Persisted).promo === 'string' || (v as Persisted).promo === null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    readJSON<Persisted>(brand.storageKeys.cart, { lines: [], promo: null }, isPersisted),
  )
  const [bump, setBump] = useState(0)
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
    writeJSON(brand.storageKeys.cart, state)
  }, [state])

  const promoRate = state.promo ? (brand.promoCodes[state.promo] ?? 0) : 0
  const lines = useMemo(() => detailLines(state.lines), [state.lines])
  const totals = useMemo(() => cartTotals(lines, promoRate), [lines, promoRate])

  const add = useCallback((product: Product, color: string, size: string, qty = 1) => {
    dispatch({ type: 'add', line: { key: lineKey(product.id, color, size), productId: product.id, color, size, qty } })
    setBump((b) => b + 1)
  }, [])
  const setQty = useCallback((key: string, qty: number) => dispatch({ type: 'qty', key, qty }), [])
  const remove = useCallback((key: string) => {
    const line = stateRef.current.lines.find((l) => l.key === key)
    dispatch({ type: 'remove', key })
    return line
  }, [])
  const restore = useCallback((line: CartLine, index: number) => dispatch({ type: 'restore', line, index }), [])
  const indexOf = useCallback((key: string) => stateRef.current.lines.findIndex((l) => l.key === key), [])
  const applyPromo = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase()
    if (!(normalized in brand.promoCodes)) return 'invalid'
    dispatch({ type: 'promo', code: normalized })
    return 'ok'
  }, [])
  const clearPromo = useCallback(() => dispatch({ type: 'promo', code: null }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  const value = useMemo(
    () => ({ lines, totals, promo: state.promo, promoRate, bump, add, setQty, remove, restore, applyPromo, clearPromo, clear, indexOf }),
    [lines, totals, state.promo, promoRate, bump, add, setQty, remove, restore, applyPromo, clearPromo, clear, indexOf],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
