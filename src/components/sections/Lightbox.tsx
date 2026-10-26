import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CloseButton } from '@/components/ui/Controls'
import { Img } from '@/components/ui/Img'
import { Overlay } from '@/components/ui/Overlay'
import { getProductBySlug } from '@/data/api'
import { gallery } from '@/data/testimonials'
import { formatPrice } from '@/lib/format'
import { useUI } from '@/store/ui'

export default function Lightbox({ start }: { start: number }) {
  const { overlay, closeOverlay } = useUI()
  const close = () => closeOverlay('lightbox')
  return (
    <Overlay open={overlay?.name === 'lightbox'} onClose={close} label="Photo gallery" variant="fullscreen" responsive={false} dark>
      <LightboxBody start={start} onClose={close} />
    </Overlay>
  )
}

function LightboxBody({ start, onClose }: { start: number; onClose: () => void }) {
  const [i, setI] = useState(start)
  const n = gallery.length
  const go = (d: number) => setI((cur) => (cur + d + n) % n)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const post = gallery[i]
  const product = getProductBySlug(post.productSlug)
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between px-3">
        <p className="label px-3 num">{i + 1} / {n} · {post.handle}</p>
        <CloseButton onClick={onClose} />
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
        <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-1 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center bg-ink/60 md:left-6"><ArrowLeft /></button>
        <Img key={post.id} src={post.image} alt={post.caption} sizes="90vw" className="max-h-full w-auto max-w-full object-contain" style={{ maxHeight: 'calc(100dvh - 190px)' }} />
        <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-1 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center bg-ink/60 md:right-6"><ArrowRight /></button>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-6 py-4">
        <p aria-live="polite" className="text-bone/80">{post.caption}</p>
        {product && (
          <Link to={`/product/${product.slug}`} onClick={onClose} className="label link-u inline-flex min-h-11 items-center">Shop the look — {product.name} · {formatPrice(product.price)}</Link>
        )}
      </div>
    </div>
  )
}
