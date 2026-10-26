import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CartLineItem, FreeShippingBar } from '@/components/cart/CartParts'
import { Button, ButtonLink } from '@/components/ui/Controls'
import { SplitLines } from '@/components/ui/Motion'
import { usePageMeta } from '@/hooks/usePageMeta'
import { formatPrice } from '@/lib/format'
import { useCart } from '@/store/cart'
import { useUI } from '@/store/ui'

export function OrderSummary({ showCheckout = true }: { showCheckout?: boolean }) {
  const { totals, promo, applyPromo, clearPromo, promoRate } = useCart()
  const { toast } = useUI()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setError('Enter a promo code.')
      return
    }
    if (applyPromo(code) === 'ok') {
      setError('')
      toast(`Promo ${code.trim().toUpperCase()} applied`)
      setCode('')
    } else {
      setError('That code is not valid.')
      toast('Promo code not valid')
    }
  }

  const row = (label: string, value: string, strong = false) => (
    <div className={`flex items-baseline justify-between ${strong ? 'hairline-t pt-4 text-lg' : 'text-[15px]'}`}>
      <dt className={strong ? 'label' : 'text-stone'}>{label}</dt>
      <dd className="num">{value}</dd>
    </div>
  )

  return (
    <div className="bg-paper p-6 md:p-8">
      <h2 className="label mb-5">Order summary</h2>
      <form onSubmit={submit} noValidate className="mb-6">
        <label htmlFor="promo" className="label mb-2 block text-stone">Promo code</label>
        {promo ? (
          <p className="flex items-center justify-between border border-line px-4 py-3 text-sm">
            <span><strong className="font-medium">{promo}</strong> — {Math.round(promoRate * 100)}% off applied</span>
            <button type="button" onClick={clearPromo} className="label link-u min-h-11">Remove</button>
          </p>
        ) : (
          <>
            <div className="flex gap-2">
              <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} aria-invalid={!!error} aria-describedby="promo-msg" placeholder="Try ATELIER10" autoCapitalize="characters" className="min-h-12 min-w-0 flex-1 border border-line bg-bone px-4 uppercase placeholder:normal-case" />
              <Button type="submit" variant="outline">Apply</Button>
            </div>
            <p id="promo-msg" role="alert" className="mt-2 min-h-5 text-sm text-oxblood">{error}</p>
          </>
        )}
      </form>
      <dl className="flex flex-col gap-3">
        {row('Subtotal', formatPrice(totals.subtotal))}
        {totals.discount > 0 && row('Discount', `−${formatPrice(totals.discount)}`)}
        {row('Estimated shipping', totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping))}
        {row('Includes GST (est.)', formatPrice(totals.tax))}
        {row('Total', formatPrice(totals.total), true)}
      </dl>
      {showCheckout && (
        <ButtonLink to="/checkout" full className="mt-6">Proceed to demo checkout</ButtonLink>
      )}
      <p className="mt-4 text-xs text-stone">Demo checkout — no payment is processed.</p>
    </div>
  )
}

export default function CartPage() {
  const { lines, totals } = useCart()
  usePageMeta('Your cart', 'Review the items in your cart.')
  return (
    <div className="wrap pb-24 pt-10 md:pt-16">
      <SplitLines as="h1" lines={['Your cart']} className="display display-xl" immediate />
      {lines.length === 0 ? (
        <div className="grid place-items-center gap-5 py-24 text-center">
          <p className="display display-md">Your cart is empty</p>
          <p className="max-w-[40ch] text-stone">Nothing here yet. Start with a heavyweight tee or a selvedge jean.</p>
          <ButtonLink to="/shop">Shop the collection</ButtonLink>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
          <div>
            <div className="mb-6"><FreeShippingBar /></div>
            <ul className="hairline-t">{lines.map((l) => <CartLineItem key={l.line.key} item={l} large />)}</ul>
            <p className="label mt-6 text-stone">{totals.count} item{totals.count === 1 ? '' : 's'} · <Link to="/shop" className="link-u">Continue shopping</Link></p>
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start"><OrderSummary /></div>
        </div>
      )}
    </div>
  )
}
