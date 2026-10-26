import { createContext, useContext } from 'react'

export type OverlayName = 'cart' | 'search' | 'menu' | 'quickview' | 'sizeguide' | 'filters' | 'lightbox' | 'viewer'

export interface OverlayState {
  name: OverlayName
  payload?: string
}

export interface ToastItem {
  id: number
  message: string
  action?: { label: string; onClick: () => void }
}

export interface UIContextValue {
  overlay: OverlayState | null
  /** Only one overlay is ever open: opening a new one replaces the current. */
  openOverlay: (name: OverlayName, payload?: string) => void
  closeOverlay: (name?: OverlayName) => void
  toasts: ToastItem[]
  toast: (message: string, action?: ToastItem['action']) => void
  dismissToast: (id: number) => void
}

export const UIContext = createContext<UIContextValue | null>(null)

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside UIProvider')
  return ctx
}
