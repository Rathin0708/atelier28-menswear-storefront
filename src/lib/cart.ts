import { brand } from '@/config/brand'
import { getProductById } from '@/data/api'
import type { CartLine, Product } from '@/types'

export interface DetailedLine {
  line: CartLine
  product: Product
  image: string
  unit: number
  total: number
}

export interface CartTotals {
  count: number
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  remainingForFreeShipping: number
  freeShippingProgress: number
}

export const lineKey = (productId: string, color: string, size: string) => `${productId}|${color}|${size}`

export function detailLines(lines: CartLine[]): DetailedLine[] {
  const out: DetailedLine[] = []
  for (const line of lines) {
    const product = getProductById(line.productId)
    if (!product) continue
    const variant = product.colors.find((c) => c.name === line.color) ?? product.colors[0]
    out.push({ line, product, image: variant.images[0], unit: product.price, total: product.price * line.qty })
  }
  return out
}

export function cartTotals(lines: DetailedLine[], promoRate: number): CartTotals {
  const count = lines.reduce((n, l) => n + l.line.qty, 0)
  const subtotal = lines.reduce((n, l) => n + l.total, 0)
  const discount = Math.round(subtotal * promoRate)
  const afterDiscount = subtotal - discount
  const qualifies = afterDiscount >= brand.freeShippingThreshold
  const shipping = count === 0 || qualifies ? 0 : brand.shippingFee
  const tax = Math.round(afterDiscount - afterDiscount / (1 + brand.taxRate))
  return {
    count,
    subtotal,
    discount,
    shipping,
    tax,
    total: afterDiscount + shipping,
    remainingForFreeShipping: Math.max(0, brand.freeShippingThreshold - afterDiscount),
    freeShippingProgress: Math.min(1, afterDiscount / brand.freeShippingThreshold),
  }
}

export function isValidCartLines(v: unknown): v is CartLine[] {
  return (
    Array.isArray(v) &&
    v.every(
      (l) =>
        l &&
        typeof l === 'object' &&
        typeof (l as CartLine).key === 'string' &&
        typeof (l as CartLine).productId === 'string' &&
        typeof (l as CartLine).color === 'string' &&
        typeof (l as CartLine).size === 'string' &&
        Number.isInteger((l as CartLine).qty) &&
        (l as CartLine).qty > 0,
    )
  )
}
