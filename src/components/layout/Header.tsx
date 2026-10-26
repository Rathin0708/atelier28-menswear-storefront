import { AnimatePresence, motion } from 'motion/react'
import { Heart, Menu, Search, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { IconButton } from '@/components/ui/Controls'
import { brand } from '@/config/brand'
import { primaryNav } from '@/data/site'
import { useScrollDirection } from '@/hooks'
import { useCart } from '@/store/cart'
import { useUI } from '@/store/ui'
import { useWishlist } from '@/store/wishlist'

export function Header() {
  const { pathname } = useLocation()
  const { hidden, scrolled } = useScrollDirection()
  const { openOverlay, overlay } = useUI()
  const { totals, bump } = useCart()
  const { ids } = useWishlist()
  const [hovered, setHovered] = useState<string | null>(null)
  const [megaAt, setMegaAt] = useState<string | null>(null)
  // Open only for the route it was opened on, so navigating closes it without an effect.
  const mega = megaAt === pathname
  const setMega = (open: boolean) => setMegaAt(open ? pathname : null)

  const home = pathname === '/'
  const transparent = home && !scrolled && !mega && !overlay
  const activeTo = primaryNav.find((l) => pathname === l.to)?.to
  const underline = hovered ?? (mega ? '/shop' : activeTo ?? null)

  return (
    <header
      className={`sticky top-0 z-50 transition-[transform,background-color,color,border-color] duration-500 ease-[var(--ease-reveal)] ${
        transparent ? 'border-b border-transparent bg-transparent text-bone' : 'border-b border-line bg-bone text-ink'
      } ${hidden && !mega ? '-translate-y-full' : 'translate-y-0'}`}
      onMouseLeave={() => {
        setHovered(null)
        setMega(false)
      }}
      onKeyDown={(e) => e.key === 'Escape' && setMega(false)}
    >
      <div className="wrap flex h-16 items-center gap-2">
        <div className="flex flex-1 items-center lg:flex-none">
          <IconButton label="Open menu" onClick={() => openOverlay('menu')} className="-ml-2 lg:hidden">
            <Menu size={24} strokeWidth={1.5} />
          </IconButton>
          <Link to="/" aria-label={`${brand.name} — home`} className="display hidden text-[26px] tracking-[-0.03em] lg:block" style={{ fontWeight: 400 }}>
            {brand.name}
          </Link>
        </div>

        <Link to="/" aria-label={`${brand.name} — home`} className="display text-[22px] tracking-[-0.03em] lg:hidden" style={{ fontWeight: 400 }}>
          {brand.name}
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {primaryNav.map((l) => {
              const isShop = l.to === '/shop'
              return (
                <li
                  key={l.to}
                  className="relative"
                  onMouseEnter={() => {
                    setHovered(l.to)
                    setMega(isShop)
                  }}
                  onFocus={() => setMega(isShop)}
                >
                  <NavLink to={l.to} className="label relative inline-flex min-h-11 items-center px-3.5" aria-expanded={isShop ? mega : undefined} aria-haspopup={isShop ? 'true' : undefined}>
                    {l.label}
                    {underline === l.to && (
                      <motion.span layoutId="nav-underline" className="absolute inset-x-3.5 bottom-2 h-px bg-current" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex flex-1 items-center justify-end lg:flex-none">
          <IconButton label="Search (press / to open)" onClick={() => openOverlay('search')}>
            <Search size={22} strokeWidth={1.5} />
          </IconButton>
          <Link to="/wishlist" aria-label={`Wishlist, ${ids.length} item${ids.length === 1 ? '' : 's'}`} className="relative hidden h-11 w-11 place-items-center hover:text-oxblood sm:inline-grid">
            <Heart size={22} strokeWidth={1.5} />
            {ids.length > 0 && <span className="num absolute right-0.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-oxblood px-1 text-[10px] text-bone">{ids.length}</span>}
          </Link>
          <button type="button" aria-label={`Open cart, ${totals.count} item${totals.count === 1 ? '' : 's'}`} onClick={() => openOverlay('cart')} className="relative -mr-2 grid h-11 w-11 place-items-center hover:text-oxblood">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {totals.count > 0 && (
              <span key={bump} className={`num absolute right-0.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-oxblood px-1 text-[10px] text-bone ${bump > 0 ? 'bump' : ''}`}>
                {totals.count}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>{mega && <MegaMenu onNavigate={() => setMega(false)} />}</AnimatePresence>
    </header>
  )
}
