import { editorial } from '@/data/images'
import type { Category, CollectionDef } from '@/types'

const U = 'https://images.unsplash.com/photo-'

export const categories: Category[] = [
  { slug: 't-shirts', name: 'T-Shirts', blurb: 'Heavy cotton basics', image: U + '1581655353564-df123a1eb820' },
  { slug: 'shirts', name: 'Shirts', blurb: 'Oxford, linen, check', image: U + '1602810316693-3667c854239a' },
  { slug: 'jeans', name: 'Jeans', blurb: 'Selvedge and washed', image: U + '1714143164072-7646ef5cb24d' },
  { slug: 'trousers', name: 'Trousers', blurb: 'Pleated and pressed', image: U + '1693474865997-e1bd835a7414' },
  { slug: 'jackets', name: 'Jackets & Outerwear', blurb: 'Leather, suede, denim', image: U + '1675877879221-871aa9f7c314' },
  { slug: 'ethnic-wear', name: 'Ethnic Wear', blurb: 'Kurtas and Nehru sets', image: U + '1770359993283-a2c2f386584e' },
  { slug: 'knitwear', name: 'Knitwear', blurb: 'Merino, cable, terry', image: U + '1642886512785-b5fee9faad7f' },
  { slug: 'accessories', name: 'Accessories', blurb: 'Belts, wallets, eyewear', image: U + '1624222247344-550fb60583dc' },
]

export const collections: CollectionDef[] = [
  { slug: 'outerwear-edit', name: 'The Outerwear Edit', blurb: 'Leather, suede, denim and wool for the cold months.', image: editorial.collectionOuterwear, base: { categories: ['jackets', 'knitwear'] } },
  { slug: 'tailoring', name: 'Tailoring', blurb: 'Pleated trousers, crisp shirts and quiet wool.', image: editorial.collectionTailoring, base: { categories: ['trousers', 'shirts'] } },
  { slug: 'everyday', name: 'Everyday Uniform', blurb: 'The tees, jeans and knits we reach for first.', image: editorial.collectionEveryday, base: { categories: ['t-shirts', 'jeans', 'knitwear'] } },
  { slug: 'ethnic', name: 'The Ethnic Edit', blurb: 'Kurtas and Nehru sets, cut for today.', image: editorial.collectionEthnic, base: { categories: ['ethnic-wear'] } },
  { slug: 'new-arrivals', name: 'New Arrivals', blurb: 'The latest drop from the atelier.', image: editorial.hero, base: { isNew: true } },
  { slug: 'best-sellers', name: 'Best Sellers', blurb: 'What our customers keep coming back for.', image: editorial.story, base: { bestseller: true } },
  { slug: 'sale', name: 'Seasonal Edit', blurb: 'Select pieces, reduced.', image: editorial.promo, base: { onSale: true } },
]

export const resolveCollection = (slug: string): CollectionDef | undefined => {
  const col = collections.find((c) => c.slug === slug)
  if (col) return col
  const cat = categories.find((c) => c.slug === slug)
  if (!cat) return undefined
  return { slug: cat.slug, name: cat.name, blurb: cat.blurb, image: cat.image, base: { categories: [cat.slug] } }
}
