import { useState, type CSSProperties } from 'react'
import { brand } from '@/config/brand'
import { imgSrcSet, imgUrl } from '@/lib/img'

interface ImgProps {
  src: string
  alt: string
  /** CSS aspect ratio, e.g. "4 / 5". Reserves space so the layout never shifts. */
  ratio?: string
  sizes?: string
  priority?: boolean
  className?: string
  style?: CSSProperties
  position?: string
}

/** Responsive image with reserved space and a branded fallback for failed loads. */
export function Img({ src, alt, ratio, sizes = '100vw', priority = false, className = '', style, position }: ImgProps) {
  const [failed, setFailed] = useState(false)
  const box: CSSProperties = { aspectRatio: ratio, ...style }

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`grid place-items-center bg-ink text-bone ${className}`}
        style={box}
      >
        <span className="display text-4xl opacity-70" aria-hidden="true">
          {brand.short}
        </span>
      </div>
    )
  }

  return (
    <img
      src={imgUrl(src, 800)}
      srcSet={imgSrcSet(src)}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
      className={`bg-line object-cover ${className}`}
      style={{ ...box, objectPosition: position }}
    />
  )
}
