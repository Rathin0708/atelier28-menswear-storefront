import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { brand } from '@/config/brand'
import { isStringArray, readJSON, writeJSON } from '@/lib/storage'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useIsFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

let scrollLocks = 0
let savedPadding = ''

/** Reference-counted body scroll lock; safe when several consumers overlap. */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return
    const body = document.body
    if (scrollLocks === 0) {
      const gap = window.innerWidth - document.documentElement.clientWidth
      savedPadding = body.style.paddingRight
      body.style.overflow = 'hidden'
      if (gap > 0) body.style.paddingRight = `${gap}px`
    }
    scrollLocks++
    return () => {
      scrollLocks--
      if (scrollLocks === 0) {
        body.style.overflow = ''
        body.style.paddingRight = savedPadding
      }
    }
  }, [active])
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Traps Tab inside `ref`, focuses the first control, and restores focus on unmount. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return
    const previous = document.activeElement as HTMLElement | null
    const focusables = () => [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement)

    const first = node.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0] ?? node
    first.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    node.addEventListener('keydown', onKey)
    return () => {
      node.removeEventListener('keydown', onKey)
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true })
    }
  }, [ref, active])
}

/** 'down' once the user has scrolled down past the threshold, 'up' otherwise. */
export function useScrollDirection(threshold = 8) {
  const [state, setState] = useState({ hidden: false, scrolled: false })
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false
    const update = () => {
      const y = Math.max(0, window.scrollY)
      const delta = y - lastY
      setState((prev) => {
        const scrolled = y > 24
        let hidden = prev.hidden
        if (y < 120) hidden = false
        else if (delta > threshold) hidden = true
        else if (delta < -threshold) hidden = false
        return prev.hidden === hidden && prev.scrolled === scrolled ? prev : { hidden, scrolled }
      })
      if (Math.abs(delta) > threshold) lastY = y
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return state
}

export function useRecentlyViewed(): { ids: string[]; push: (id: string) => void } {
  const [ids, setIds] = useState<string[]>(() => readJSON(brand.storageKeys.recent, [], isStringArray))
  const push = useCallback((id: string) => {
    setIds((cur) => {
      const next = [id, ...cur.filter((x) => x !== id)].slice(0, 10)
      writeJSON(brand.storageKeys.recent, next)
      return next
    })
  }, [])
  return { ids, push }
}

export function useDebounced<T>(value: T, ms = 180): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), ms)
    return () => window.clearTimeout(t)
  }, [value, ms])
  return v
}

/** Fires once when the element first enters the viewport. */
export function useInViewOnce<T extends Element>(ref: RefObject<T | null>, margin = '0px'): boolean {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, seen, margin])
  return seen
}

/** Escape-to-close helper. */
export function useEscape(handler: () => void, active = true) {
  const ref = useRef(handler)
  useEffect(() => {
    ref.current = handler
  })
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && ref.current()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active])
}
export { usePageMeta } from './usePageMeta'
