import type { CategorySlug } from '@/types'

export interface SizeRow {
  size: string
  /** Measurements in centimetres, in the same order as the columns. */
  cm: number[]
}

export interface SizeChartData {
  title: string
  columns: string[]
  rows: SizeRow[]
}

const tops: SizeChartData = {
  title: 'Tops, shirts, knitwear and outerwear',
  columns: ['Chest', 'Body length', 'Shoulder'],
  rows: [
    { size: 'XS', cm: [88, 66, 42] },
    { size: 'S', cm: [94, 68, 44] },
    { size: 'M', cm: [100, 70, 46] },
    { size: 'L', cm: [106, 72, 48] },
    { size: 'XL', cm: [112, 74, 50] },
    { size: 'XXL', cm: [118, 76, 52] },
  ],
}

const bottoms: SizeChartData = {
  title: 'Jeans and trousers',
  columns: ['Waist', 'Hip', 'Inseam'],
  rows: [
    { size: '28', cm: [71, 90, 80] },
    { size: '30', cm: [76, 95, 81] },
    { size: '32', cm: [81, 100, 82] },
    { size: '34', cm: [86, 105, 82] },
    { size: '36', cm: [91, 110, 83] },
    { size: '38', cm: [97, 115, 83] },
  ],
}

export const sizeChartFor = (category?: CategorySlug): SizeChartData[] => {
  if (category === 'jeans' || category === 'trousers') return [bottoms]
  if (category === 'accessories') return []
  if (category) return [tops]
  return [tops, bottoms]
}
