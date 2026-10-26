import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { UIContext, type OverlayName, type OverlayState, type ToastItem } from '@/store/ui'

export function UIProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<OverlayState | null>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const openOverlay = useCallback((name: OverlayName, payload?: string) => setOverlay({ name, payload }), [])
  const closeOverlay = useCallback(
    (name?: OverlayName) => setOverlay((cur) => (!name || cur?.name === name ? null : cur)),
    [],
  )

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const toast = useCallback(
    (message: string, action?: ToastItem['action']) => {
      const id = nextId.current++
      setToasts((t) => [...t.slice(-2), { id, message, action }])
      window.setTimeout(() => dismissToast(id), action ? 6500 : 3800)
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({ overlay, openOverlay, closeOverlay, toasts, toast, dismissToast }),
    [overlay, openOverlay, closeOverlay, toasts, toast, dismissToast],
  )
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}
