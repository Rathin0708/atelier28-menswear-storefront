import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CloseButton, Stars } from '@/components/ui/Controls'
import { Img } from '@/components/ui/Img'
import { Overlay } from '@/components/ui/Overlay'
import { Price } from '@/components/product/Price'
import { PurchasePanel } from '@/components/product/PurchasePanel'
import { getProductBySlug } from '@/data/api'
import { useUI } from '@/store/ui'
import type { Product } from '@/types'

export default function QuickViewModal() {
  const { overlay, closeOverlay } = useUI()
  const open = overlay?.name === 'quickview'
  const product = overlay?.payload ? getProductBySlug(overlay.payload) : undefined
  return (
    <Overlay open={open && !!product} onClose={() => closeOverlay('quickview')} label={product ? `Quick view: ${product.name}` : 'Quick view'} variant="modal" maxWidth="1040px">
      {product && <QuickViewBody key={product.id} product={product} onClose={() => closeOverlay('quickview')} />}
    </Overlay>
  )
}

function QuickViewBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const [colorIndex, setColorIndex] = useState(0)
  const [active, setActive] = useState(0)
  const images = product.colors[colorIndex].images
  return (
    <div className="relative grid grid-cols-1 min-h-0 flex-1 overflow-y-auto md:grid-cols-[1.05fr_1fr]">
      <CloseButton onClick={onClose} className="absolute right-1 top-1 z-10 bg-paper/80 md:bg-transparent" />
      <div className="flex flex-col gap-2 bg-bone p-0 md:p-4">
        <Img src={images[active] ?? images[0]} alt={`${product.name}, view ${active + 1}`} ratio="4 / 5" sizes="(min-width: 768px) 480px, 100vw" className="w-full max-h-[52dvh] md:max-h-none" />
        <div className="flex gap-2 overflow-x-auto p-2 md:p-0" role="group" aria-label="Product images">
          {images.map((src, i) => (
            <button key={src} type="button" aria-label={`Show image ${i + 1}`} aria-pressed={i === active} onClick={() => setActive(i)} className={`h-16 w-14 shrink-0 border ${i === active ? 'border-ink' : 'border-transparent opacity-70'}`}>
              <Img src={src} alt="" sizes="60px" className="h-full w-full" />
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 p-6 md:p-10">
        <div>
          <h2 className="display display-md pr-10">{product.name}</h2>
          <div className="mt-3 flex items-center gap-4">
            <Price product={product} className="text-lg" />
            <Stars rating={product.rating} count={product.reviewCount} />
          </div>
        </div>
        <p className="text-[15px] text-stone">{product.description}</p>
        <PurchasePanel
          product={product}
          colorIndex={colorIndex}
          onColorChange={(i) => {
            setColorIndex(i)
            setActive(0)
          }}
          scope={`qv-${product.id}`}
        />
        <Link to={`/product/${product.slug}`} onClick={onClose} className="label link-u inline-flex min-h-11 items-center self-start">
          View full details
        </Link>
      </div>
    </div>
  )
}
