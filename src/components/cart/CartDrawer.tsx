import { Link } from 'react-router-dom'
import { CartLineItem, FreeShippingBar } from '@/components/cart/CartParts'
import { Button, ButtonLink, CloseButton } from '@/components/ui/Controls'
import { Img } from '@/components/ui/Img'
import { Overlay } from '@/components/ui/Overlay'
import { getProducts } from '@/data/api'
import { formatPrice } from '@/lib/format'
import { useCommerce } from '@/store/actions'
import { useCart } from '@/store/cart'
import { useUI } from '@/store/ui'

export function CartDrawer() {
  const { overlay, closeOverlay } = useUI()
  const { lines, totals } = useCart()
  const { addToCart } = useCommerce()
  const close = () => closeOverlay('cart')

  // Cheap, non-duplicate upsell: an accessory not already in the cart.
  const inCart = new Set(lines.map((l) => l.product.id))
  const upsell = getProducts().find((p) => p.category === 'accessories' && p.price < 2000 && !inCart.has(p.id) && p.sizes.some((s) => s.inStock))

  return (
    <Overlay open={overlay?.name === 'cart'} onClose={close} label="Shopping cart" variant="drawer">
      <div className="flex items-center justify-between pl-6">
        <h2 className="display display-md">Cart <span className="num text-base text-stone">({totals.count})</span></h2>
        <CloseButton onClick={close} className="m-2" />
      </div>
      <p className="px-6 pb-3 text-xs text-stone">Demo store — no payment is processed.</p>
      <div className="px-6 pb-4"><FreeShippingBar /></div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 pb-16 text-center">
          <p className="display display-md">Your cart is empty</p>
          <p className="max-w-[28ch] text-stone">Start with something that will outlast the season.</p>
          <ButtonLink to="/shop" onClick={close}>Shop the collection</ButtonLink>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-6">
            <ul>{lines.map((l) => <CartLineItem key={l.line.key} item={l} />)}</ul>
            {upsell && (
              <div className="py-5">
                <p className="label mb-3">Complete the look</p>
                <div className="flex items-center gap-4">
                  <Link to={`/product/${upsell.slug}`} onClick={close} className="w-16 shrink-0">
                    <Img src={upsell.colors[0].images[0]} alt="" ratio="4 / 5" sizes="80px" className="w-full" />
                  </Link>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate font-medium">{upsell.name}</p>
                    <p className="num text-stone">{formatPrice(upsell.price)}</p>
                  </div>
                  <Button variant="outline" className="min-h-11 px-4" onClick={() => addToCart(upsell, upsell.colors[0].name, upsell.sizes.find((s) => s.inStock)?.label ?? upsell.sizes[0].label, 1, false)}>
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="hairline-t flex flex-col gap-4 bg-bone p-6">
            <div className="flex items-baseline justify-between">
              <span className="label">Subtotal</span>
              <span className="num text-lg">{formatPrice(totals.subtotal)}</span>
            </div>
            <p className="text-xs text-stone">Shipping and taxes are calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink to="/cart" variant="outline" onClick={close}>View cart</ButtonLink>
              <ButtonLink to="/checkout" onClick={close}>Checkout</ButtonLink>
            </div>
          </div>
        </>
      )}
    </Overlay>
  )
}
