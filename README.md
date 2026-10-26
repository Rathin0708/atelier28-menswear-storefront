# ATELIER 28 — menswear storefront (frontend demo)

Vite + React 19 + TypeScript + Tailwind CSS 4 + Motion + React Router. Frontend only: the catalog is sample data, and the checkout is a labelled demo that processes no payment.

**Live demo:** https://atelier28-menswear-storefront.vercel.app  
**Repo:** https://github.com/Rathin0708/atelier28-menswear-storefront

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint       # oxlint
npm run build      # tsc -b && vite build
npm run preview
```

## Customize
- Brand name, currency, free-shipping threshold, promo end date, promo codes: `src/config/brand.ts`
- Products (prices, colours, sizes, images): `src/data/products.ts`; data access in `src/data/api.ts`
- Editorial imagery: `src/data/images.ts`; collections/categories: `src/data/collections.ts`
- Navigation and footer links: `src/data/site.ts`
- Colours, type scale, motion tokens: `src/styles/index.css` (`@theme`) and `src/lib/motion.ts`
