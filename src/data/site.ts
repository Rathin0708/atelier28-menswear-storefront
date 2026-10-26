export const announcements = [
  'Free shipping on orders above ₹4,999',
  'New drop: AW 2028 — Collection 01 is live',
  'Easy 14-day returns, no questions asked',
  'Use code ATELIER10 for 10% off your first order',
]

export interface NavLink {
  label: string
  to: string
}

export const primaryNav: NavLink[] = [
  { label: 'New', to: '/collections/new-arrivals' },
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections/outerwear-edit' },
  { label: 'Ethnic', to: '/collections/ethnic-wear' },
  { label: 'Lookbook', to: '/lookbook' },
  { label: 'About', to: '/about' },
]

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', to: '/collections/new-arrivals' },
      { label: 'Best Sellers', to: '/collections/best-sellers' },
      { label: 'Jeans', to: '/collections/jeans' },
      { label: 'Jackets & Outerwear', to: '/collections/jackets' },
      { label: 'Ethnic Wear', to: '/collections/ethnic-wear' },
      { label: 'Accessories', to: '/collections/accessories' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Shipping', to: '/shipping' },
      { label: 'Returns', to: '/returns' },
      { label: 'Size Guide', to: '/size-guide' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Lookbook', to: '/lookbook' },
      { label: 'Careers', to: '/careers' },
      { label: 'Stores', to: '/stores' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
    ],
  },
]

export const trendingSearches = ['overshirt', 'selvedge', 'linen', 'kurta', 'leather', 'merino']
