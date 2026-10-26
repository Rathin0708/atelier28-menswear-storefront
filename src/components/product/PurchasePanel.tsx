import { AnimatePresence, motion } from 'motion/react'
import { Check, Ruler } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Button, QtyStepper } from '@/components/ui/Controls'
import { SizeSelector, SwatchSelector } from '@/components/product/Selectors'
import { WishlistButton } from '@/components/product/WishlistButton'
import { useCommerce } from '@/store/actions'
import { useUI } from '@/store/ui'
import type { Product } from '@/types'

interface Props {
  product: Product
  colorIndex: number
  onColorChange: (index: number) => void
  /** Used to keep radio-group names unique when two panels exist (e.g. quick view + page). */
  scope: string
  onAdded?: () => void
  /** Reports the add-to-cart button so a sticky bar can mirror its validation. */
  registerAdd?: (fn: () => boolean) => void
}

type AddState = 'idle' | 'adding' | 'added'

export function PurchasePanel({ product, colorIndex, onColorChange, scope, onAdded, registerAdd }: Props) {
  const { addToCart } = useCommerce()
  const { openOverlay } = useUI()
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const [state, setState] = useState<AddState>('idle')
  const errId = useId()
  const timers = useRef<number[]>([])

  const color = product.colors[colorIndex]
  const soldOut = product.sizes.every((s) => !s.inStock)
  const oneSize = product.sizes.length === 1 && product.sizes[0].inStock

  useEffect(() => {
    const list = timers.current
    return () => list.forEach(window.clearTimeout)
  }, [])

  const submit = (): boolean => {
    const chosen = oneSize ? product.sizes[0].label : size
    if (!chosen) {
      setError(true)
      setShakeKey((k) => k + 1)
      return false
    }
    setError(false)
    setState('adding')
    timers.current.push(
      window.setTimeout(() => {
        addToCart(product, color.name, chosen, qty)
        setState('added')
        onAdded?.()
        timers.current.push(window.setTimeout(() => setState('idle'), 1600))
      }, 450),
    )
    return true
  }

  useEffect(() => {
    registerAdd?.(submit)
  })

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="label mb-1 flex items-center gap-2">
          <span>Colour</span>
          <span className="font-normal normal-case tracking-normal text-stone">{color.name}</span>
        </p>
        <SwatchSelector colors={product.colors} value={colorIndex} onChange={onColorChange} name={`${scope}-color`} />
      </div>

      {!oneSize && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="label">Size</p>
            {product.category !== 'accessories' && (
              <button type="button" onClick={() => openOverlay('sizeguide', product.category)} className="label link-u inline-flex min-h-11 items-center gap-2">
                <Ruler size={14} /> Size guide
              </button>
            )}
          </div>
          <div key={shakeKey} className={error ? 'shake' : ''}>
            <SizeSelector
              sizes={product.sizes}
              value={size}
              onChange={(s) => {
                setSize(s)
                setError(false)
              }}
              name={`${scope}-size`}
              invalid={error}
              describedBy={error ? errId : undefined}
            />
          </div>
          <p id={errId} role="alert" className="mt-2 min-h-5 text-sm text-oxblood">
            {error && 'Please select a size to continue.'}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <QtyStepper value={qty} onChange={setQty} />
        <Button
          variant="solid"
          className="min-w-0 flex-1 basis-48"
          disabled={soldOut || state === 'adding'}
          onClick={() => submit()}
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={soldOut ? 'sold' : state} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="inline-flex items-center gap-2">
              {soldOut ? 'Sold out' : state === 'adding' ? 'Adding…' : state === 'added' ? (<><Check size={16} /> Added</>) : 'Add to cart'}
            </motion.span>
          </AnimatePresence>
        </Button>
        <WishlistButton product={product} className="border border-line hover:border-ink" />
      </div>
    </div>
  )
}
