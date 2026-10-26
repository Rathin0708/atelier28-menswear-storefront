import { Minus, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { CloseButton } from '@/components/ui/Controls'
import { Img } from '@/components/ui/Img'
import { Overlay } from '@/components/ui/Overlay'
import { useIsDesktop } from '@/hooks'
import { imgUrl } from '@/lib/img'
import { useUI } from '@/store/ui'

interface Props {
  images: string[]
  name: string
}

/** Desktop: vertical stack with hover-pan zoom. Mobile: swipe strip, tap opens a fullscreen viewer. */
export function ProductGallery({ images, name }: Props) {
  const desktop = useIsDesktop()
  const { openOverlay, closeOverlay, overlay } = useUI()
  const [slide, setSlide] = useState(0)
  const [viewerStart, setViewerStart] = useState(0)
  const strip = useRef<HTMLDivElement>(null)

  const open = (i: number) => {
    setViewerStart(i)
    openOverlay('viewer')
  }

  return (
    <>
      {desktop ? (
        <div className="grid gap-2">
          {images.map((src, i) => (
            <ZoomTile key={src} src={src} alt={`${name}, view ${i + 1}`} priority={i === 0} />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={strip}
            onScroll={() => strip.current && setSlide(Math.round(strip.current.scrollLeft / strip.current.clientWidth))}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
            role="group"
            aria-label={`${name} images`}
          >
            {images.map((src, i) => (
              <button key={src} type="button" onClick={() => open(i)} aria-label={`Open image ${i + 1} fullscreen`} className="block w-full shrink-0 snap-center">
                <Img src={src} alt={`${name}, view ${i + 1}`} ratio="4 / 5" sizes="100vw" priority={i === 0} className="w-full" />
              </button>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" role="presentation">
            {images.map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === slide ? 'bg-ink' : 'bg-ink/30'}`} />
            ))}
          </div>
          <p className="sr-only" aria-live="polite">Image {slide + 1} of {images.length}</p>
        </div>
      )}
      <Viewer open={overlay?.name === 'viewer'} onClose={() => closeOverlay('viewer')} images={images} name={name} start={viewerStart} />
    </>
  )
}

function ZoomTile({ src, alt, priority }: { src: string; alt: string; priority: boolean }) {
  const img = useRef<HTMLDivElement>(null)
  return (
    <div
      className="group relative overflow-hidden bg-line"
      style={{ aspectRatio: '4 / 5' }}
      data-cursor="ZOOM"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const el = img.current
        if (el) el.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`
      }}
    >
      <div ref={img} className="h-full w-full transition-transform duration-500 ease-[var(--ease-reveal)] group-hover:scale-[1.9]">
        <Img src={src} alt={alt} sizes="(min-width: 1024px) 34vw, 100vw" priority={priority} className="h-full w-full" />
      </div>
    </div>
  )
}

function Viewer({ open, onClose, images, name, start }: { open: boolean; onClose: () => void; images: string[]; name: string; start: number }) {
  return (
    <Overlay open={open} onClose={onClose} label={`${name} image viewer`} variant="fullscreen" responsive={false} dark>
      <ViewerBody onClose={onClose} images={images} name={name} start={start} />
    </Overlay>
  )
}

function ViewerBody({ onClose, images, name, start }: { onClose: () => void; images: string[]; name: string; start: number }) {
  const [zoom, setZoom] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  return (
    <>
      <div className="flex shrink-0 items-center justify-between px-3">
        <p className="label px-3">{name}</p>
        <div className="flex">
          <button type="button" aria-label={zoom ? 'Zoom out' : 'Zoom in'} onClick={() => setZoom((z) => !z)} className="grid h-11 w-11 place-items-center">
            {zoom ? <Minus size={20} /> : <Plus size={20} />}
          </button>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <div
        ref={(el) => {
          scroller.current = el
          if (el && !el.dataset.init) {
            el.dataset.init = '1'
            el.scrollLeft = start * el.clientWidth
          }
        }}
        className={`flex min-h-0 flex-1 ${zoom ? 'overflow-auto' : 'snap-x snap-mandatory overflow-x-auto'}`}
        style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
      >
        {images.map((src, i) => (
          <div key={src} className={`grid shrink-0 snap-center place-items-center ${zoom ? 'w-[220%]' : 'w-full'}`}>
            <img src={imgUrl(src, 1400)} alt={`${name}, view ${i + 1}`} className={`${zoom ? 'w-full' : 'max-h-full max-w-full'} object-contain`} style={{ maxHeight: zoom ? undefined : 'calc(100dvh - 56px)' }} onDoubleClick={() => setZoom((z) => !z)} />
          </div>
        ))}
      </div>
    </>
  )
}
