import { products } from '@/data/products'
import { collections, categories, resolveCollection } from '@/data/collections'
import type { Product } from '@/types'

/**
 * Single data-access layer. Everything is synchronous and in-memory today;
 * replace these bodies with fetch calls when a real catalog API exists.
 */
export const getProducts = (): Product[] => products
export const getProductBySlug = (slug: string): Product | undefined => products.find((p) => p.slug === slug)
export const getProductById = (id: string): Product | undefined => products.find((p) => p.id === id)
export const getCollections = () => collections
export const getCategories = () => categories
export const getCollection = resolveCollection
export const getCategoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug
