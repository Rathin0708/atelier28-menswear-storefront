export type CategorySlug =
  | 't-shirts'
  | 'shirts'
  | 'jeans'
  | 'trousers'
  | 'jackets'
  | 'ethnic-wear'
  | 'knitwear'
  | 'accessories'

export type Badge = 'New' | 'Bestseller' | 'Limited' | 'Sale'
export type Fit = 'Slim' | 'Regular' | 'Relaxed'

export interface ColorVariant {
  name: string
  hex: string
  images: string[]
}

export interface SizeOption {
  label: string
  inStock: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  category: CategorySlug
  subcategory: string
  price: number
  compareAtPrice?: number
  currency: string
  badges: Badge[]
  colors: ColorVariant[]
  sizes: SizeOption[]
  fit: Fit
  fabric: string
  description: string
  details: string[]
  care: string[]
  tags: string[]
  rating: number
  reviewCount: number
  isNew: boolean
  isBestseller: boolean
  createdAt: string
}

export interface Category {
  slug: CategorySlug
  name: string
  blurb: string
  image: string
}

export interface CollectionDef {
  slug: string
  name: string
  blurb: string
  image: string
  /** Base filter applied before user filters. */
  base: {
    categories?: CategorySlug[]
    isNew?: boolean
    bestseller?: boolean
    onSale?: boolean
  }
}

export interface Testimonial {
  id: string
  name: string
  city: string
  rating: number
  title: string
  body: string
  productSlug: string
}

export interface GalleryPost {
  id: string
  image: string
  handle: string
  caption: string
  productSlug: string
  height: 'tall' | 'short'
}

export interface CartLine {
  key: string
  productId: string
  color: string
  size: string
  qty: number
}

export interface ShopFilters {
  q: string
  categories: CategorySlug[]
  sizes: string[]
  colors: string[]
  min: number | null
  max: number | null
  fits: Fit[]
  fabrics: string[]
  inStock: boolean
  onSale: boolean
}

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'best'
