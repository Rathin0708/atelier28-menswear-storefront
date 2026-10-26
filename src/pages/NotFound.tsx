import { ButtonLink } from '@/components/ui/Controls'
import { SplitLines } from '@/components/ui/Motion'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function NotFound() {
  usePageMeta('Page not found')
  return (
    <section className="wrap grid min-h-[70dvh] content-center gap-8 py-24">
      <p className="label text-oxblood">Error 404</p>
      <SplitLines as="h1" lines={['This page', 'is out of stock.']} className="display display-xl" immediate />
      <p className="max-w-[48ch] text-lg text-stone">The link may be broken, or the piece may have sold through. Let us get you back to the collection.</p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink to="/shop">Shop all</ButtonLink>
        <ButtonLink to="/collections/new-arrivals" variant="outline">New arrivals</ButtonLink>
        <ButtonLink to="/" variant="ghost">Back home</ButtonLink>
      </div>
    </section>
  )
}
