export const brand = {
  name: 'ATELIER 28',
  short: 'A28',
  handle: '@atelier28',
  tagline: 'Quiet tailoring, loud type.',
  season: 'AW 2028 — COLLECTION 01',
  city: 'Mumbai',
  currency: 'INR',
  locale: 'en-IN',
  freeShippingThreshold: 4999,
  shippingFee: 199,
  /** Prices include GST; this is the share of the order shown as tax. */
  taxRate: 0.05,
  /** Countdown target for the outerwear promo. Update to re-arm the timer. */
  promoEndsAt: '2026-12-31T23:59:59+05:30',
  promoCodes: { ATELIER10: 0.1 } as Record<string, number>,
  storageKeys: {
    cart: 'atelier28:cart:v1',
    wishlist: 'atelier28:wishlist:v1',
    recent: 'atelier28:recent:v1',
    subscribers: 'atelier28:subscribers:v1',
    announce: 'atelier28:announce-dismissed:v1',
    orders: 'atelier28:last-order:v1',
  },
} as const
