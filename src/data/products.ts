import { brand } from '@/config/brand'
import type { Badge, CategorySlug, Fit, Product, SizeOption } from '@/types'

const U = 'https://images.unsplash.com/photo-'

type SizeKind = 'tops' | 'waist' | 'trouser' | 'belt' | 'one' | 'sock'

const SIZE_SETS: Record<SizeKind, string[]> = {
  tops: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  waist: ['28', '30', '32', '34', '36', '38'],
  trouser: ['30', '32', '34', '36', '38'],
  belt: ['S (30–32)', 'M (34–36)', 'L (38–40)'],
  one: ['One Size'],
  sock: ['UK 6–9', 'UK 9–12'],
}

const CARE: Record<CategorySlug, string[]> = {
  't-shirts': ['Machine wash cold, inside out', 'Tumble dry low', 'Warm iron on reverse'],
  shirts: ['Machine wash cold, gentle cycle', 'Line dry in shade', 'Iron while slightly damp'],
  jeans: ['Wash inside out, cold, sparingly', 'Hang dry away from direct sun', 'Expect natural fading — that is the point'],
  trousers: ['Dry clean recommended', 'Steam to refresh between wears', 'Store on a wide hanger'],
  jackets: ['Spot clean or dry clean only', 'Brush gently to remove dust', 'Store on a shaped hanger'],
  'ethnic-wear': ['Hand wash cold or dry clean', 'Dry flat in shade', 'Iron on reverse at low heat'],
  knitwear: ['Hand wash cold with wool detergent', 'Dry flat, never hang', 'Store folded'],
  accessories: ['Wipe with a soft dry cloth', 'Keep away from moisture', 'Store in the supplied pouch'],
}

interface Look {
  /** Colour name, swatch hex and the photo that shows it. */
  color: [string, string]
  img: string
}

interface Seed {
  slug: string
  name: string
  category: CategorySlug
  sub: string
  price: number
  compare?: number
  badges?: Badge[]
  looks: Look[]
  /** Shared photos appended to every colour's gallery. */
  extra: string[]
  kind: SizeKind
  oos?: string[]
  fit: Fit
  fabric: string
  desc: string
  details: string[]
  tags: string[]
  rating: number
  reviews: number
  daysAgo: number
  best?: boolean
}

const seeds: Seed[] = [
  // T-SHIRTS
  {
    slug: 'heavyweight-boxy-tee', name: 'Heavyweight Boxy Tee', category: 't-shirts', sub: 'Boxy tee', price: 1899,
    badges: ['Bestseller'], looks: [{ color: ['Ecru', '#EDE8DD'], img: '1581655353564-df123a1eb820' }],
    extra: ['1521572163474-6864f9cf17ab', '1622445275463-afa2ab738c34'], kind: 'tops', oos: ['XXL'], fit: 'Relaxed', fabric: 'Cotton',
    desc: 'A 260 GSM jersey cut square through the shoulder and finished with a ribbed, double-stitched collar that holds its shape wash after wash.',
    details: ['260 GSM combed cotton jersey', 'Dropped shoulder, boxy body', 'Double-needle collar and hem', 'Made in Tiruppur, India'],
    tags: ['tee', 'basics', 'oversized', 'heavyweight'], rating: 4.8, reviews: 412, daysAgo: 220, best: true,
  },
  {
    slug: 'pima-crew-tee', name: 'Pima Crew Tee', category: 't-shirts', sub: 'Crew neck', price: 1499,
    badges: ['New'], looks: [{ color: ['Mustard', '#C9A227'], img: '1605949405965-d49ada3f9189' }, { color: ['Slate', '#6B6F73'], img: '1552642986-ccb41e7059e7' }],
    extra: ['1584865288642-42078afe6942'], kind: 'tops', fit: 'Regular', fabric: 'Cotton',
    desc: 'Long-staple pima cotton, garment-dyed for a soft, lived-in colour from the first wear. The everyday tee, done properly.',
    details: ['100% long-staple pima cotton', 'Garment dyed and enzyme washed', 'Straight hem, regular fit', 'Pre-shrunk'],
    tags: ['tee', 'basics', 'pima'], rating: 4.6, reviews: 188, daysAgo: 12,
  },
  {
    slug: 'garment-dyed-pocket-tee', name: 'Garment-Dyed Pocket Tee', category: 't-shirts', sub: 'Pocket tee', price: 1699,
    looks: [{ color: ['Soot', '#1B1B1A'], img: '1624970415682-3f99fae61a94' }], extra: ['1574180566232-aaad1b5b8450'], kind: 'tops', fit: 'Regular', fabric: 'Cotton',
    desc: 'A single chest pocket, a washed soot black and a slightly longer body. Wears well on its own or under an overshirt.',
    details: ['220 GSM cotton jersey', 'Chest patch pocket', 'Garment dyed', 'Regular fit'], tags: ['tee', 'pocket', 'black'], rating: 4.5, reviews: 96, daysAgo: 95,
  },
  {
    slug: 'moss-slub-tee', name: 'Slub Cotton Tee — Moss', category: 't-shirts', sub: 'Slub tee', price: 1599,
    compare: 1999, badges: ['Sale'], looks: [{ color: ['Moss', '#5B6046'], img: '1523381294911-8d3cead13475' }], extra: ['1562157873-818bc0726f68'], kind: 'tops', fit: 'Slim', fabric: 'Cotton',
    desc: 'Textured slub jersey in a deep moss green. Slim through the body with a clean, low crew neck.',
    details: ['180 GSM slub cotton', 'Slim fit, low crew neck', 'Tubular body, no side seams', 'Garment dyed'], tags: ['tee', 'slub', 'green'], rating: 4.3, reviews: 64, daysAgo: 160,
  },

  // SHIRTS
  {
    slug: 'oxford-button-down-sky', name: 'Oxford Button-Down — Sky', category: 'shirts', sub: 'Oxford shirt', price: 2999,
    badges: ['Bestseller'], looks: [{ color: ['Sky', '#A9C3DA'], img: '1602810316693-3667c854239a' }], extra: ['1624835567150-0c530a20d8cc'], kind: 'tops', oos: ['XS'], fit: 'Regular', fabric: 'Cotton',
    desc: 'The staple shirt: heavy oxford weave, soft roll collar, mother-of-pearl buttons. It improves every time it is washed.',
    details: ['Brushed cotton oxford', 'Mother-of-pearl buttons', 'Soft unlined button-down collar', 'Back box pleat'], tags: ['shirt', 'oxford', 'workwear', 'blue'], rating: 4.9, reviews: 530, daysAgo: 300, best: true,
  },
  {
    slug: 'linen-cuban-collar-shirt', name: 'Linen Cuban Collar Shirt', category: 'shirts', sub: 'Camp collar', price: 3499,
    badges: ['New'], looks: [{ color: ['Chalk', '#F0EDE4'], img: '1602810318383-e386cc2a3ccf' }], extra: ['1621072156002-e2fccdc0b176'], kind: 'tops', fit: 'Relaxed', fabric: 'Linen',
    desc: 'Washed European linen with an open camp collar. Breathes in the heat, drapes like silk after a steam.',
    details: ['100% washed linen', 'Open camp collar', 'Coconut-shell buttons', 'Relaxed fit, straight hem'], tags: ['shirt', 'linen', 'summer', 'camp collar'], rating: 4.7, reviews: 143, daysAgo: 9,
  },
  {
    slug: 'brushed-check-shirt-charcoal', name: 'Brushed Check Shirt — Charcoal', category: 'shirts', sub: 'Flannel shirt', price: 3299,
    compare: 4299, badges: ['Sale'], looks: [{ color: ['Charcoal Check', '#3A3A3A'], img: '1611312449412-6cefac5dc3e4' }], extra: ['1626557981101-aae6f84aa6ff'], kind: 'tops', fit: 'Regular', fabric: 'Cotton',
    desc: 'Double-brushed cotton flannel in a tonal charcoal check. Soft enough to sleep in, sharp enough to meet clients.',
    details: ['Double-brushed cotton flannel', 'Tonal check, pattern-matched pocket', 'Single-needle stitching', 'Regular fit'], tags: ['shirt', 'check', 'flannel', 'winter'], rating: 4.4, reviews: 77, daysAgo: 70,
  },
  {
    slug: 'poplin-stripe-shirt-blue', name: 'Poplin Stripe Shirt — Blue', category: 'shirts', sub: 'Dress shirt', price: 2799,
    looks: [{ color: ['Blue Stripe', '#7C9CC0'], img: '1594938291221-94f18cbb5660' }], extra: ['1622450180332-3da1126f10a4'], kind: 'tops', fit: 'Slim', fabric: 'Cotton',
    desc: 'Crisp two-ply poplin with a fine blue bengal stripe, cut slim and finished with a semi-spread collar.',
    details: ['Two-ply cotton poplin', 'Semi-spread collar', 'Slim fit', 'Curved hem'], tags: ['shirt', 'stripe', 'formal', 'poplin'], rating: 4.5, reviews: 102, daysAgo: 130,
  },
  {
    slug: 'chambray-work-shirt', name: 'Chambray Work Shirt', category: 'shirts', sub: 'Work shirt', price: 3199,
    badges: ['Limited'], looks: [{ color: ['Chambray', '#4F6C8F'], img: '1620012253295-c15cc3e65df4' }], extra: ['1589234217365-08d3e0e5cf42'], kind: 'tops', oos: ['S', 'XXL'], fit: 'Regular', fabric: 'Cotton',
    desc: 'Indigo-dyed chambray with a soft hand and a two-pocket front. Limited run of 400 pieces.',
    details: ['Indigo-dyed cotton chambray', 'Two chest pockets', 'Contrast triple stitching', 'Limited run of 400'], tags: ['shirt', 'chambray', 'denim', 'workwear'], rating: 4.6, reviews: 58, daysAgo: 25,
  },

  // JEANS
  {
    slug: 'selvedge-straight-jean-indigo-rinse', name: 'Selvedge Straight Jean — Indigo Rinse', category: 'jeans', sub: 'Straight', price: 5999,
    badges: ['Bestseller'], looks: [{ color: ['Indigo Rinse', '#1F2A3D'], img: '1714143164072-7646ef5cb24d' }], extra: ['1714143136367-7bb68f3f0669'], kind: 'waist', oos: ['28', '38'], fit: 'Regular', fabric: 'Denim',
    desc: 'Raw 13.5 oz Japanese-loom selvedge, rinsed once for a softer break-in. A straight leg that sits just above the hip.',
    details: ['13.5 oz selvedge denim', 'Rinsed, no distressing', 'Button fly, copper rivets', 'Mid rise, straight leg'], tags: ['jeans', 'selvedge', 'raw denim', 'indigo'], rating: 4.9, reviews: 381, daysAgo: 280, best: true,
  },
  {
    slug: 'tapered-jean-washed-blue', name: 'Tapered Jean — Washed Blue', category: 'jeans', sub: 'Tapered', price: 4499,
    badges: ['New'], looks: [{ color: ['Washed Blue', '#4C6A8E'], img: '1714143136372-ddaf8b606da7' }], extra: ['1715758890151-2c15d5d482aa'], kind: 'waist', fit: 'Slim', fabric: 'Denim',
    desc: 'A slim taper with a touch of stretch for easy movement, washed down to a clean mid blue.',
    details: ['12 oz stretch denim (2% elastane)', 'Slim taper from the knee', 'Mid rise', 'Zip fly'], tags: ['jeans', 'tapered', 'stretch'], rating: 4.5, reviews: 214, daysAgo: 14,
  },
  {
    slug: 'relaxed-jean-stone', name: 'Relaxed Jean — Stone', category: 'jeans', sub: 'Relaxed', price: 4799,
    compare: 5999, badges: ['Sale'], looks: [{ color: ['Stone Wash', '#8FA3B8'], img: '1542272604-787c3835535d' }], extra: ['1605518216938-7c31b7b14ad0'], kind: 'waist', fit: 'Relaxed', fabric: 'Denim',
    desc: 'More room through the seat and thigh, a lighter stone wash, and a slightly cropped hem that shows off the shoe.',
    details: ['11 oz rigid cotton denim', 'Relaxed through seat and thigh', 'Stone-washed', 'Slightly cropped'], tags: ['jeans', 'relaxed', 'light wash'], rating: 4.4, reviews: 109, daysAgo: 60,
  },
  {
    slug: 'slim-jean-onyx', name: 'Slim Jean — Onyx', category: 'jeans', sub: 'Slim', price: 4299,
    looks: [{ color: ['Onyx', '#1A1A1A'], img: '1718252540511-e958742e4165' }], extra: ['1721637245920-4073818252b2'], kind: 'waist', fit: 'Slim', fabric: 'Denim',
    desc: 'Black on black: sulphur-dyed denim that fades to a soft graphite over time. Slim, with a clean unbroken line.',
    details: ['Sulphur-dyed stretch denim', 'Slim fit, mid rise', 'Tonal hardware', 'Clean hem'], tags: ['jeans', 'black', 'slim'], rating: 4.3, reviews: 88, daysAgo: 150,
  },

  // TROUSERS
  {
    slug: 'pleated-wool-trouser-charcoal', name: 'Pleated Wool Trouser — Charcoal', category: 'trousers', sub: 'Tailored', price: 6499,
    badges: ['New'], looks: [{ color: ['Charcoal', '#33353A'], img: '1693474865997-e1bd835a7414' }], extra: ['1667744565777-fa2eb22adeeb'], kind: 'trouser', fit: 'Relaxed', fabric: 'Wool',
    desc: 'A single forward pleat, a high rise and a wide leg in mid-weight wool twill. Tailoring that moves like sportswear.',
    details: ['Wool-blend twill (70/30)', 'Single forward pleat', 'High rise, wide leg', 'Side adjusters'], tags: ['trousers', 'wool', 'pleated', 'tailoring'], rating: 4.7, reviews: 71, daysAgo: 6,
  },
  {
    slug: 'cotton-chino-sand', name: 'Cotton Chino — Sand', category: 'trousers', sub: 'Chino', price: 3499,
    badges: ['Bestseller'], looks: [{ color: ['Sand', '#B79F7C'], img: '1623200693945-ec1e9991039a' }], extra: ['1548883354-7622d03aca27'], kind: 'trouser', fit: 'Regular', fabric: 'Cotton',
    desc: 'Garment-washed cotton twill in a warm sand. Regular through the thigh with a clean taper — equally good with sneakers or loafers.',
    details: ['Washed cotton twill', 'Regular fit, light taper', 'Slant pockets', 'Unfinished hem option on request'], tags: ['trousers', 'chino', 'sand'], rating: 4.6, reviews: 267, daysAgo: 240, best: true,
  },
  {
    slug: 'suspender-trouser-black', name: 'Suspender Trouser — Black', category: 'trousers', sub: 'Dress trouser', price: 5499,
    compare: 6999, badges: ['Sale'], looks: [{ color: ['Black', '#141414'], img: '1618001789159-ffffe6f96ef2' }], extra: ['1552903905-5e39e774e375'], kind: 'trouser', fit: 'Regular', fabric: 'Wool',
    desc: 'Button-tab waist for braces, a straight leg and a sharp crease. Wear them high.',
    details: ['Tropical-weight wool blend', 'Button tabs for braces', 'Straight leg', 'Pressed crease'], tags: ['trousers', 'black', 'formal'], rating: 4.4, reviews: 49, daysAgo: 110,
  },
  {
    slug: 'tailored-trouser-ink', name: 'Tailored Trouser — Ink', category: 'trousers', sub: 'Suit trouser', price: 5999,
    looks: [{ color: ['Ink', '#15161A'], img: '1617113930975-f9c7243ae527' }], extra: ['1602331970455-e96bd5da0f0e'], kind: 'trouser', oos: ['38'], fit: 'Slim', fabric: 'Wool',
    desc: 'The trouser half of the Ink suit, sold separately so you can wear it with a knit on Friday and the jacket on Monday.',
    details: ['Wool-blend suiting', 'Slim, flat front', 'Half-lined', 'Pairs with the Ink jacket'], tags: ['trousers', 'suit', 'tailoring'], rating: 4.5, reviews: 33, daysAgo: 45,
  },

  // JACKETS
  {
    slug: 'suede-trucker-jacket', name: 'Suede Trucker Jacket', category: 'jackets', sub: 'Trucker', price: 12999,
    badges: ['Limited'], looks: [{ color: ['Tobacco', '#8A6540'], img: '1776843370483-4f793bc14739' }], extra: ['1620228922597-cca58f177310'], kind: 'tops', oos: ['XS', 'XXL'], fit: 'Regular', fabric: 'Leather',
    desc: 'Buttery goat suede in a tobacco brown, cut like the classic trucker with a softer shoulder. Gets better with every wear.',
    details: ['Goat suede, cotton-twill lined', 'Chest flap pockets', 'Brass shank buttons', 'Made in Kanpur, India'], tags: ['jacket', 'suede', 'trucker', 'outerwear'], rating: 4.9, reviews: 54, daysAgo: 20,
  },
  {
    slug: 'denim-trucker-jacket-indigo', name: 'Denim Trucker — Indigo', category: 'jackets', sub: 'Denim jacket', price: 6999,
    compare: 8999, badges: ['Sale'], looks: [{ color: ['Indigo', '#2E4468'], img: '1611312449408-fcece27cdbb7' }], extra: ['1725106028906-695e57afb682'], kind: 'tops', fit: 'Regular', fabric: 'Denim',
    desc: 'Rigid 12 oz denim with a pleated back and a hem that sits at the waist. A jacket that ages with you.',
    details: ['12 oz rigid denim', 'Pleated chest and back', 'Copper buttons', 'Regular fit'], tags: ['jacket', 'denim', 'outerwear'], rating: 4.6, reviews: 201, daysAgo: 190, best: true,
  },
  {
    slug: 'leather-biker-jacket-black', name: 'Leather Biker Jacket — Black', category: 'jackets', sub: 'Leather jacket', price: 14999,
    badges: ['Bestseller'], looks: [{ color: ['Black', '#0F0F0F'], img: '1675877879221-871aa9f7c314' }], extra: ['1654719796836-62b889d4598d'], kind: 'tops', oos: ['XS'], fit: 'Slim', fabric: 'Leather',
    desc: 'Full-grain lambskin, asymmetric zip, a quilted shoulder. Cut slim and unlined at the sleeve so it breaks in fast.',
    details: ['Full-grain lambskin', 'Asymmetric YKK zip', 'Quilted shoulder panels', 'Satin-lined body'], tags: ['jacket', 'leather', 'biker', 'outerwear'], rating: 4.8, reviews: 119, daysAgo: 260, best: true,
  },
  {
    slug: 'heavy-zip-shell-brown', name: 'Heavy Zip Shell — Brown', category: 'jackets', sub: 'Zip jacket', price: 5499,
    badges: ['New'], looks: [{ color: ['Brown', '#5B4636'], img: '1548883354-94bcfe321cbb' }], extra: ['1548883354-a3fb8460973f'], kind: 'tops', fit: 'Relaxed', fabric: 'Cotton',
    desc: 'A brushed-back loopwheel fleece with a full zip and a high collar. Warm, dense and slightly oversized.',
    details: ['Brushed loopback cotton fleece', 'High funnel collar', 'Full YKK zip', 'Relaxed fit'], tags: ['jacket', 'fleece', 'zip', 'outerwear'], rating: 4.5, reviews: 67, daysAgo: 8,
  },
  {
    slug: 'quilted-liner-jacket-graphite', name: 'Quilted Liner Jacket — Graphite', category: 'jackets', sub: 'Liner jacket', price: 7499,
    looks: [{ color: ['Graphite', '#3B3D40'], img: '1547483124-085f1a47b7d1' }], extra: ['1629405420109-20caf398fd7d'], kind: 'tops', fit: 'Regular', fabric: 'Nylon',
    desc: 'A light, packable quilted liner that works under a coat or alone. Recycled-poly fill, matte shell.',
    details: ['Matte recycled-nylon shell', 'Recycled-poly insulation', 'Stand collar', 'Zip pockets'], tags: ['jacket', 'quilted', 'liner', 'winter'], rating: 4.4, reviews: 81, daysAgo: 85,
  },

  // ETHNIC
  {
    slug: 'pathani-kurta-set-cobalt', name: 'Pathani Kurta Set — Cobalt', category: 'ethnic-wear', sub: 'Kurta set', price: 4999,
    badges: ['Bestseller'], looks: [{ color: ['Cobalt', '#1F4E9C'], img: '1770359993283-a2c2f386584e' }], extra: ['1785613590746-f57d638c7d38'], kind: 'tops', fit: 'Regular', fabric: 'Cotton',
    desc: 'A collared pathani kurta with a half-placket and matching salwar, in a woven cotton with a tonal micro-check.',
    details: ['Woven cotton, tonal micro-check', 'Collared half-placket', 'Matching salwar included', 'Side slits for movement'], tags: ['kurta', 'ethnic', 'pathani', 'wedding'], rating: 4.7, reviews: 156, daysAgo: 100, best: true,
  },
  {
    slug: 'chikankari-band-collar-kurta-mint', name: 'Linen Band-Collar Kurta — Mint', category: 'ethnic-wear', sub: 'Kurta', price: 3999,
    badges: ['New'], looks: [{ color: ['Mint', '#B7D1B1'], img: '1727835523545-70ee992b5763' }], extra: ['1701365676249-9d7ab5022dec'], kind: 'tops', oos: ['XXL'], fit: 'Regular', fabric: 'Linen',
    desc: 'Hand-finished chikankari embroidery on a cool linen-cotton blend, with a band collar and mother-of-pearl buttons.',
    details: ['Linen-cotton blend', 'Hand-finished chikankari', 'Band collar', 'Knee length'], tags: ['kurta', 'ethnic', 'linen', 'chikankari', 'band collar'], rating: 4.8, reviews: 92, daysAgo: 11,
  },
  {
    slug: 'nehru-waistcoat-kurta-onyx', name: 'Nehru Waistcoat Kurta Set — Onyx', category: 'ethnic-wear', sub: 'Nehru jacket set', price: 8999,
    compare: 10999, badges: ['Sale'], looks: [{ color: ['Onyx', '#0E0E0F'], img: '1744551358303-46edae8b374b' }], extra: ['1629405552413-f8f92d2a05cd'], kind: 'tops', fit: 'Slim', fabric: 'Cotton',
    desc: 'A black cotton-silk kurta with a bandhgala-inspired waistcoat, cut slim for evenings and festive days.',
    details: ['Cotton-silk blend', 'Bandhgala-inspired waistcoat', 'Concealed button placket', 'Churidar included'], tags: ['kurta', 'ethnic', 'nehru', 'bandhgala', 'festive'], rating: 4.6, reviews: 38, daysAgo: 50,
  },

  // KNITWEAR
  {
    slug: 'merino-crew-knit-rust', name: 'Merino Crew Knit — Rust', category: 'knitwear', sub: 'Crew knit', price: 5499,
    badges: ['New'], looks: [{ color: ['Rust', '#9B4A2C'], img: '1642886512785-b5fee9faad7f' }, { color: ['Oxblood', '#6B1E22'], img: '1608975321561-176c1b187d24' }], extra: ['1628250521470-28c1fc54616c'], kind: 'tops', fit: 'Regular', fabric: 'Wool',
    desc: 'Extra-fine merino knitted on a 12-gauge machine: warm without bulk, soft against the skin, naturally odour-resistant.',
    details: ['100% extra-fine merino wool', '12-gauge knit', 'Ribbed neck, cuffs and hem', 'Mulesing-free wool'], tags: ['knit', 'merino', 'sweater', 'winter'], rating: 4.8, reviews: 143, daysAgo: 7, best: true,
  },
  {
    slug: 'cable-knit-pullover-heather', name: 'Cable Knit Pullover — Heather', category: 'knitwear', sub: 'Cable knit', price: 6999,
    compare: 8499, badges: ['Sale'], looks: [{ color: ['Heather Grey', '#9A9C9E'], img: '1599032909736-0155c1d43a6c' }], extra: ['1614495039268-aa9a80429b66'], kind: 'tops', fit: 'Relaxed', fabric: 'Wool',
    desc: 'A chunky cable in lambswool-cashmere. Relaxed and deep, made for cold mornings and long train rides.',
    details: ['Lambswool-cashmere blend', 'Traditional cable pattern', 'Relaxed fit', 'Ribbed trims'], tags: ['knit', 'cable', 'sweater', 'winter'], rating: 4.6, reviews: 90, daysAgo: 200,
  },
  {
    slug: 'fine-gauge-crew-navy', name: 'Fine-Gauge Crew — Navy', category: 'knitwear', sub: 'Fine knit', price: 4499,
    looks: [{ color: ['Navy', '#22304A'], img: '1714023498660-e4c470b285b7' }], extra: ['1642886513133-cdbee2639272'], kind: 'tops', fit: 'Slim', fabric: 'Cotton',
    desc: 'A fine cotton-cashmere knit in navy that layers under a jacket or over a shirt without adding bulk.',
    details: ['Cotton-cashmere blend', '14-gauge fine knit', 'Slim fit', 'Linked collar'], tags: ['knit', 'navy', 'layering'], rating: 4.4, reviews: 61, daysAgo: 120,
  },
  {
    slug: 'terry-hoodie-bone', name: 'Heavy Terry Hoodie — Bone', category: 'knitwear', sub: 'Hoodie', price: 3999,
    badges: ['Bestseller'], looks: [{ color: ['Bone', '#E8E2D5'], img: '1688111421205-a0a85415b224' }], extra: ['1597143720583-bbbf44a6677d'], kind: 'tops', fit: 'Relaxed', fabric: 'Cotton',
    desc: '420 GSM French terry with a double-layered hood and a soft brushed interior. Heavy, warm and built to last.',
    details: ['420 GSM French terry', 'Double-layered hood', 'Kangaroo pocket', 'Relaxed fit'], tags: ['hoodie', 'terry', 'loungewear'], rating: 4.7, reviews: 224, daysAgo: 175, best: true,
  },

  // ACCESSORIES
  {
    slug: 'bridle-leather-belt-tan', name: 'Bridle Leather Belt — Tan', category: 'accessories', sub: 'Belt', price: 2499,
    badges: ['Bestseller'], looks: [{ color: ['Tan', '#9C6B3F'], img: '1624222247344-550fb60583dc' }], extra: ['1705493655920-20c572928501'], kind: 'belt', fit: 'Regular', fabric: 'Leather',
    desc: 'Vegetable-tanned bridle leather with a solid brass buckle. Stiff at first, then yours forever.',
    details: ['Vegetable-tanned bridle leather', 'Solid brass buckle', '35mm width', 'Handmade in Chennai'], tags: ['belt', 'leather', 'accessory', 'brown'], rating: 4.7, reviews: 312, daysAgo: 210, best: true,
  },
  {
    slug: 'smooth-leather-belt-black', name: 'Smooth Leather Belt — Black', category: 'accessories', sub: 'Belt', price: 2299,
    looks: [{ color: ['Black', '#111111'], img: '1664286074176-5206ee5dc878' }], extra: ['1711443982852-b3df5c563448'], kind: 'belt', oos: ['S (30–32)'], fit: 'Regular', fabric: 'Leather',
    desc: 'A clean black calf belt with a matte nickel buckle. The one that goes with everything.',
    details: ['Calf leather', 'Matte nickel buckle', '30mm width', 'Edge-painted'], tags: ['belt', 'leather', 'black', 'formal'], rating: 4.5, reviews: 140, daysAgo: 140,
  },
  {
    slug: 'slim-bifold-wallet-black', name: 'Slim Bifold Wallet — Black', category: 'accessories', sub: 'Wallet', price: 2799,
    badges: ['New'], looks: [{ color: ['Black', '#101010'], img: '1629139033414-76f3c0eacf84' }], extra: ['1775379557015-938546264440', '1637868796504-32f45a96d5a0'], kind: 'one', fit: 'Regular', fabric: 'Leather',
    desc: 'Six card slots, a cash sleeve and nothing else. Full-grain leather that is thin enough for a front pocket.',
    details: ['Full-grain leather', '6 card slots + cash sleeve', 'Hand-burnished edges', 'Comes with a dust bag'], tags: ['wallet', 'leather', 'accessory'], rating: 4.6, reviews: 98, daysAgo: 5,
  },
  {
    slug: 'acetate-wayfarer-sunglasses', name: 'Acetate Wayfarer Sunglasses', category: 'accessories', sub: 'Sunglasses', price: 3499,
    compare: 4499, badges: ['Sale'], looks: [{ color: ['Gloss Black', '#0C0C0C'], img: '1572635196237-14b3f281503f' }], extra: ['1584036553516-bf83210aa16c'], kind: 'one', fit: 'Regular', fabric: 'Acetate',
    desc: 'Hand-polished acetate in the classic wayfarer shape with polarised mineral lenses and UV400 protection.',
    details: ['Italian acetate frame', 'Polarised mineral lenses, UV400', '5-barrel hinges', 'Hard case included'], tags: ['sunglasses', 'wayfarer', 'accessory'], rating: 4.4, reviews: 77, daysAgo: 90,
  },
  {
    slug: 'steel-aviator-sunglasses', name: 'Steel Aviator Sunglasses', category: 'accessories', sub: 'Sunglasses', price: 3999,
    looks: [{ color: ['Silver', '#C0C2C4'], img: '1589642380614-4a8c2147b857' }, { color: ['Black', '#151515'], img: '1599705709640-9f9eb5964485' }], extra: ['1610136649349-0f646f318053'], kind: 'one', fit: 'Regular', fabric: 'Steel',
    desc: 'Lightweight stainless-steel aviators with adjustable silicone nose pads and polarised lenses.',
    details: ['Stainless-steel frame', 'Polarised lenses, UV400', 'Adjustable nose pads', 'Hard case included'], tags: ['sunglasses', 'aviator', 'accessory'], rating: 4.5, reviews: 63, daysAgo: 55,
  },
  {
    slug: 'ripstop-six-panel-cap-stone', name: 'Ripstop Six-Panel Cap — Stone', category: 'accessories', sub: 'Cap', price: 1499,
    badges: ['New'], looks: [{ color: ['Stone', '#D8D3C8'], img: '1588850561407-ed78c282e89b' }], extra: ['1521369909029-2afed882baee'], kind: 'one', fit: 'Regular', fabric: 'Nylon',
    desc: 'Unstructured six-panel cap in washed ripstop with a tonal embroidered A28 and an adjustable strap.',
    details: ['Washed nylon ripstop', 'Unstructured crown', 'Brass-clip adjuster', 'Tonal embroidery'], tags: ['cap', 'hat', 'accessory'], rating: 4.3, reviews: 45, daysAgo: 4,
  },
  {
    slug: 'ribbed-cotton-socks-3-pack', name: 'Ribbed Cotton Socks — 3 Pack', category: 'accessories', sub: 'Socks', price: 1499,
    looks: [{ color: ['Assorted', '#3D4A5C'], img: '1615486364462-ef6363adbc18' }], extra: ['1585499583264-491df5142e83', '1613151848917-80e67f421fff'], kind: 'sock', fit: 'Regular', fabric: 'Cotton',
    desc: 'Three pairs of combed-cotton rib socks with reinforced heels and toes. Mid-calf length.',
    details: ['Combed cotton, 2% elastane', 'Reinforced heel and toe', 'Mid-calf', '3 pairs per pack'], tags: ['socks', 'accessory', 'basics'], rating: 4.6, reviews: 205, daysAgo: 250,
  },
]

const sizesFor = (kind: SizeKind, oos: string[] = []): SizeOption[] =>
  SIZE_SETS[kind].map((label) => ({ label, inStock: !oos.includes(label) }))

function build(seed: Seed, index: number): Product {
  const looks = seed.looks
  const created = new Date('2028-10-26T00:00:00Z').getTime() - seed.daysAgo * 86_400_000
  const badges: Badge[] = [...(seed.badges ?? [])]
  return {
    id: `p${String(index + 1).padStart(3, '0')}`,
    slug: seed.slug,
    name: seed.name,
    category: seed.category,
    subcategory: seed.sub,
    price: seed.price,
    compareAtPrice: seed.compare,
    currency: brand.currency,
    badges,
    colors: looks.map((l) => ({
      name: l.color[0],
      hex: l.color[1],
      images: [U + l.img, ...seed.extra.map((e) => U + e)],
    })),
    sizes: sizesFor(seed.kind, seed.oos),
    fit: seed.fit,
    fabric: seed.fabric,
    description: seed.desc,
    details: seed.details,
    care: CARE[seed.category],
    tags: seed.tags,
    rating: seed.rating,
    reviewCount: seed.reviews,
    isNew: badges.includes('New'),
    isBestseller: badges.includes('Bestseller') || Boolean(seed.best),
    createdAt: new Date(created).toISOString(),
  }
}

export const products: Product[] = seeds.map(build)
