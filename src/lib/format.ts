import { brand } from '@/config/brand'

const inr = new Intl.NumberFormat(brand.locale, {
  style: 'currency',
  currency: brand.currency,
  maximumFractionDigits: 0,
})

export const formatPrice = (value: number) => inr.format(value)

export const percentOff = (price: number, compare?: number) =>
  compare && compare > price ? Math.round(((compare - price) / compare) * 100) : 0

/** Lowercase + strip diacritics for forgiving search. */
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

export const pad2 = (n: number) => String(n).padStart(2, '0')

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
