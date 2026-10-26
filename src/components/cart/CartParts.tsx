import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Img } from '@/components/ui/Img'
import { QtyStepper } from '@/components/ui/Controls'
import { brand } from '@/config/brand'
import type { DetailedLine } from '@/lib/cart'
import { formatPrice } from '@/lib/format'
import { useCommerce } from '@/store/actions'
import { useCart } from '@/store/cart'
import { useUI } from '@/store/ui'

export function FreeShippingBar() {
  const { totals } = useCart()
  const done = totals.remainingForFreeShipping === 0 && totals.count > 0
  return (
    <div>
      <p className="mb-2 text-sm" aria-live="polite">
        {totals.count === 0
          ? `Free shipping on orders above ${formatPrice(brand.freeShippingThreshold)}`
          : done
            ? 'You have unlocked free shipping.'
            : <>Add <strong className="num">{formatPrice(totals.remainingForFreeShipping)}</strong> more for free shipping.</>}
      </p>
      <div className="h-[3px] bg-line" role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(totals.freeShippingProgress * 100)}>
        <div className="h-full bg-oxblood transition-[width] duration-500 ease-[var(--ease-reveal)]" style={{ width: `${totals.freeShippingProgress * 100}%` }} />
      </div>
    </div>
  )
}

export function CartLineItem({ item, large = false }: { item: DetailedLine; large?: boolean }) {
  const { setQty } = useCart()
  const { removeWithUndo } = useCommerce()
  const { closeOverlay } = useUI()
  const { line, product } = item
  return (
    <li className={`flex gap-4 ${large ? 'py-6' : 'py-5'} hairline-b`}>
      <Link to={`/product/${product.slug}`} onClick={() => closeOverlay('cart')} className={`shrink-0 ${large ? 'w-28 sm:w-36' : 'w-24'}`}>
        <Img src={item.image} alt={product.name} ratio="4 / 5" sizes="150px" className="w-full" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[15px] font-medium leading-snug">
              <Link to={`/product/${product.slug}`} onClick={() => closeOverlay('cart')} className="hover:text-oxblood">{product.name}</Link>
            </h3>
            <p className="mt-1 text-sm text-stone">{line.color} · Size {line.size}</p>
          </div>
          <p className="num text-sm">{formatPrice(item.total)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QtyStepper value={line.qty} onChange={(n) => setQty(line.key, n)} label={`Quantity for ${product.name}`} />
          <button type="button" aria-label={`Remove ${product.name} (${line.color}, ${line.size}) from cart`} onClick={() => removeWithUndo(line.key)} className="grid h-11 w-11 place-items-center text-stone hover:text-oxblood">
            <Trash2 size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </li>
  )
}
