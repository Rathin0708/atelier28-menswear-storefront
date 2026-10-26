const params = (w: number) => `?auto=format&fit=crop&q=72&w=${w}`

export const imgUrl = (src: string, w = 800) => (src.startsWith('http') ? `${src}${params(w)}` : src)

export const imgSrcSet = (src: string, widths: number[] = [400, 640, 960, 1280]) =>
  widths.map((w) => `${imgUrl(src, w)} ${w}w`).join(', ')
