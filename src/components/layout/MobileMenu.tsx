import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CloseButton } from '@/components/ui/Controls'
import { Img } from '@/components/ui/Img'
import { Overlay } from '@/components/ui/Overlay'
import { brand } from '@/config/brand'
import { getCategories } from '@/data/api'
import { editorial } from '@/data/images'
import { primaryNav } from '@/data/site'
import { DUR, EASE_REVEAL } from '@/lib/motion'
import { useUI } from '@/store/ui'

export function MobileMenu() {
  const { overlay, closeOverlay } = useUI()
  const close = () => closeOverlay('menu')
  return (
    <Overlay open={overlay?.name === 'menu'} onClose={close} label="Main menu" variant="fullscreen" responsive={false} dark>
      <MenuBody onClose={close} />
    </Overlay>
  )
}

function MenuBody({ onClose }: { onClose: () => void }) {
  const [shopOpen, setShopOpen] = useState(false)
  const cats = getCategories()
  const rise = (i: number) => ({
    initial: { y: '100%' },
    animate: { y: 0 },
    transition: { duration: DUR.reveal, delay: 0.1 + i * 0.06, ease: EASE_REVEAL },
  })
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="wrap flex h-16 shrink-0 items-center justify-between">
        <span className="display text-[22px]" style={{ fontWeight: 400 }}>{brand.name}</span>
        <CloseButton onClick={onClose} className="-mr-2" />
      </div>
      <nav aria-label="Mobile" className="wrap flex-1 py-6">
        <ul>
          {primaryNav.map((l, i) => (
            <li key={l.to} className="overflow-hidden">
              <motion.div {...rise(i)}>
                {l.to === '/shop' ? (
                  <>
                    <button type="button" aria-expanded={shopOpen} onClick={() => setShopOpen((o) => !o)} className="display flex min-h-16 w-full items-center justify-between text-[clamp(2.4rem,11vw,3.6rem)]">
                      {l.label}
                      <ChevronDown size={28} className={`transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {shopOpen && (
                      <ul className="grid grid-cols-2 gap-x-4 pb-4">
                        <li className="col-span-2"><Link to="/shop" onClick={onClose} className="label inline-flex min-h-11 items-center underline underline-offset-4">All products</Link></li>
                        {cats.map((c) => (
                          <li key={c.slug}><Link to={`/collections/${c.slug}`} onClick={onClose} className="flex min-h-11 items-center text-bone/80">{c.name}</Link></li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link to={l.to} onClick={onClose} className="display flex min-h-16 items-center text-[clamp(2.4rem,11vw,3.6rem)]">{l.label}</Link>
                )}
              </motion.div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="wrap pb-8">
        <Link to="/collections/outerwear-edit" onClick={onClose} className="relative block overflow-hidden">
          <Img src={editorial.menuFeature} alt="" ratio="16 / 9" sizes="100vw" className="w-full opacity-80" />
          <span className="absolute bottom-3 left-4"><span className="label block">Featured</span><span className="display text-2xl">The Outerwear Edit</span></span>
        </Link>
        <ul className="label mt-6 flex flex-wrap gap-x-6 text-bone/80">
          <li><Link to="/contact" onClick={onClose} className="inline-flex min-h-11 items-center">Help</Link></li>
          <li><Link to="/wishlist" onClick={onClose} className="inline-flex min-h-11 items-center">Wishlist</Link></li>
          <li><Link to="/stores" onClick={onClose} className="inline-flex min-h-11 items-center">Stores</Link></li>
          <li><Link to="/lookbook" onClick={onClose} className="inline-flex min-h-11 items-center">{brand.handle}</Link></li>
        </ul>
      </div>
    </div>
  )
}
