import { formatPrice, percentOff } from '@/lib/format'
import type { Product } from '@/types'

export function Price({ product, className = '' }: { product: Product; className?: string }) {
  const off = percentOff(product.price, product.compareAtPrice)
  return (
    <p className={`num flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className={off ? 'text-oxblood' : ''}>{formatPrice(product.price)}</span>
      {off > 0 && product.compareAtPrice && (
        <>
          <s className="text-stone">
            <span className="sr-only">Was </span>
            {formatPrice(product.compareAtPrice)}
          </s>
          <span className="label text-oxblood">−{off}%</span>
        </>
      )}
    </p>
  )
}
