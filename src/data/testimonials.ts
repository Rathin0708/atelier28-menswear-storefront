import type { GalleryPost, Testimonial } from '@/types'
import { galleryImages } from '@/data/images'

export const testimonials: Testimonial[] = [
  { id: 't1', name: 'Arjun M.', city: 'Bengaluru', rating: 5, title: 'The best-fitting jean I own', body: 'The selvedge has already started to take my shape. Three weeks in, I get compliments weekly.', productSlug: 'selvedge-straight-jean-indigo-rinse' },
  { id: 't2', name: 'Kabir S.', city: 'Delhi', rating: 5, title: 'Oxford shirt, perfected', body: 'Weight and collar roll are exactly right. I bought four colours the same week.', productSlug: 'oxford-button-down-sky' },
  { id: 't3', name: 'Rohan P.', city: 'Mumbai', rating: 4, title: 'Wore the kurta to a wedding', body: 'Cool in the heat and the embroidery photographed beautifully. Runs a touch roomy, size down if between.', productSlug: 'chikankari-band-collar-kurta-mint' },
  { id: 't4', name: 'Vikram N.', city: 'Hyderabad', rating: 5, title: 'Serious leather for the money', body: 'Proper full-grain, proper hardware. The biker jacket feels like it will outlast me.', productSlug: 'leather-biker-jacket-black' },
]

export const press = [
  { name: 'The Quarterly Cut', quote: 'The most confident menswear debut in a decade.' },
  { name: 'Loom & Ledger', quote: 'Tailoring with a pulse.' },
  { name: 'Mode Meridian', quote: 'Quiet clothes, loud conviction.' },
  { name: 'The Selvedge Review', quote: 'Denim worth growing old in.' },
]

export const gallery: GalleryPost[] = [
  { id: 'g1', image: galleryImages[0], handle: '@dev.wears', caption: 'Floral kurta in the tall grass.', productSlug: 'chikankari-band-collar-kurta-mint', height: 'tall' },
  { id: 'g2', image: galleryImages[1], handle: '@kabir.studio', caption: 'White tee, black frames.', productSlug: 'acetate-wayfarer-sunglasses', height: 'short' },
  { id: 'g3', image: galleryImages[2], handle: '@the.sunday.fit', caption: 'Wedding-season blues.', productSlug: 'pathani-kurta-set-cobalt', height: 'short' },
  { id: 'g4', image: galleryImages[3], handle: '@rohan.in.wool', caption: 'Soft tees, slow Sundays.', productSlug: 'pima-crew-tee', height: 'tall' },
  { id: 'g5', image: galleryImages[4], handle: '@ahaan.maps', caption: 'Festive layers.', productSlug: 'nehru-waistcoat-kurta-onyx', height: 'tall' },
  { id: 'g6', image: galleryImages[5], handle: '@mihir.makes', caption: 'Weekend shirting.', productSlug: 'poplin-stripe-shirt-blue', height: 'short' },
  { id: 'g7', image: galleryImages[6], handle: '@nikhil.rack', caption: 'Chambray, dotted.', productSlug: 'chambray-work-shirt', height: 'short' },
  { id: 'g8', image: galleryImages[7], handle: '@sid.sundays', caption: 'Crisp collars.', productSlug: 'oxford-button-down-sky', height: 'tall' },
]
