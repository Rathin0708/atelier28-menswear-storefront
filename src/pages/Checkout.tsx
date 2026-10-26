import { Check, Info } from 'lucide-react'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonLink } from '@/components/ui/Controls'
import { Img } from '@/components/ui/Img'
import { SplitLines } from '@/components/ui/Motion'
import { OrderSummary } from '@/pages/CartPage'
import { usePageMeta } from '@/hooks/usePageMeta'
import { formatPrice } from '@/lib/format'
import { useCart } from '@/store/cart'

const STEPS = ['Contact', 'Shipping', 'Payment', 'Review'] as const

interface Form {
  email: string
  phone: string
  name: string
  address: string
  city: string
  state: string
  pincode: string
  method: 'upi' | 'card' | 'cod'
}

const empty: Form = { email: '', phone: '', name: '', address: '', city: '', state: '', pincode: '', method: 'upi' }

type Errors = Partial<Record<keyof Form, string>>

function validate(step: number, f: Form): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (!f.email.trim()) e.email = 'Enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'Enter a valid email address, like name@example.com.'
    if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number.'
  }
  if (step === 1) {
    if (f.name.trim().length < 2) e.name = 'Enter the recipient’s full name.'
    if (f.address.trim().length < 6) e.address = 'Enter the street address.'
    if (!f.city.trim()) e.city = 'Enter the city.'
    if (!f.state.trim()) e.state = 'Enter the state.'
    if (!/^[1-9]\d{5}$/.test(f.pincode)) e.pincode = 'Enter a valid 6-digit pincode.'
  }
  return e
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block">{label}</label>
      {children}
      <p id={`${id}-err`} role="alert" className="mt-1 min-h-5 text-sm text-oxblood">{error}</p>
    </div>
  )
}

const inputCls = 'min-h-12 w-full border border-line bg-paper px-4 aria-[invalid=true]:border-oxblood'

export default function Checkout() {
  usePageMeta('Demo checkout', 'A demo checkout. No payment is processed.')
  const { lines, totals, clear } = useCart()
  const uid = useId()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Form>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [orderId, setOrderId] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)

  const set = (k: keyof Form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const go = (n: number) => {
    setStep(n)
    window.setTimeout(() => heading.current?.focus(), 0)
  }

  const next = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(step, form)
    setErrors(errs)
    if (Object.keys(errs).length === 0) go(step + 1)
  }

  const simulate = () => {
    setPlacing(true)
    window.setTimeout(() => {
      setOrderId(`A28-${Date.now().toString(36).toUpperCase().slice(-6)}`)
      clear()
      setPlacing(false)
    }, 900)
  }

  if (orderId) {
    return (
      <section className="wrap grid min-h-[60dvh] content-center gap-6 py-24">
        <span className="grid h-14 w-14 place-items-center bg-olive text-bone"><Check /></span>
        <h1 className="display display-xl" tabIndex={-1} ref={heading}>Thank you.</h1>
        <p className="max-w-[52ch] text-lg text-stone">This was a demo — no order was placed and nothing was charged. Your simulated order ID is <strong className="num text-ink">{orderId}</strong>.</p>
        <div className="flex flex-wrap gap-3"><ButtonLink to="/shop">Keep browsing</ButtonLink><ButtonLink to="/" variant="outline">Back home</ButtonLink></div>
      </section>
    )
  }

  if (lines.length === 0) {
    return (
      <section className="wrap grid place-items-center gap-5 py-32 text-center">
        <p className="display display-md">Your cart is empty</p>
        <ButtonLink to="/shop">Shop the collection</ButtonLink>
      </section>
    )
  }

  return (
    <div className="wrap pb-24 pt-10 md:pt-16">
      <SplitLines as="h1" lines={['Checkout']} className="display display-xl" immediate />
      <div role="note" className="mt-6 flex items-start gap-3 border border-oxblood bg-paper p-4 text-sm">
        <Info size={18} className="mt-0.5 shrink-0 text-oxblood" aria-hidden="true" />
        <p><strong className="font-medium">This is a demo checkout.</strong> No payment is processed and no order is placed. Please do not enter real card details.</p>
      </div>

      <ol className="mt-10 flex flex-wrap gap-x-8 gap-y-2" aria-label="Checkout steps">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? 'step' : undefined} className={`label flex items-center gap-2 ${i === step ? 'text-ink' : i < step ? 'text-olive' : 'text-stone-soft'}`}>
            <span className={`num grid h-6 w-6 place-items-center border ${i === step ? 'border-ink bg-ink text-bone' : 'border-current'}`}>{i < step ? <Check size={12} /> : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div>
          <h2 ref={heading} tabIndex={-1} className="display display-md mb-6 outline-none">{STEPS[step]}</h2>

          {step < 2 && (
            <form onSubmit={next} noValidate className="grid max-w-xl gap-1">
              {step === 0 && (
                <>
                  <Field id={`${uid}-email`} label="Email" error={errors.email}>
                    <input id={`${uid}-email`} type="email" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={`${uid}-email-err`} className={inputCls} />
                  </Field>
                  <Field id={`${uid}-phone`} label="Mobile number" error={errors.phone}>
                    <input id={`${uid}-phone`} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} value={form.phone} onChange={(e) => set('phone')({ target: { value: e.target.value.replace(/\D/g, '') } })} aria-invalid={!!errors.phone} aria-describedby={`${uid}-phone-err`} className={inputCls} />
                  </Field>
                </>
              )}
              {step === 1 && (
                <>
                  <Field id={`${uid}-name`} label="Full name" error={errors.name}>
                    <input id={`${uid}-name`} autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={`${uid}-name-err`} className={inputCls} />
                  </Field>
                  <Field id={`${uid}-address`} label="Address" error={errors.address}>
                    <input id={`${uid}-address`} autoComplete="street-address" value={form.address} onChange={set('address')} aria-invalid={!!errors.address} aria-describedby={`${uid}-address-err`} className={inputCls} />
                  </Field>
                  <div className="grid gap-x-4 sm:grid-cols-2">
                    <Field id={`${uid}-city`} label="City" error={errors.city}>
                      <input id={`${uid}-city`} autoComplete="address-level2" value={form.city} onChange={set('city')} aria-invalid={!!errors.city} aria-describedby={`${uid}-city-err`} className={inputCls} />
                    </Field>
                    <Field id={`${uid}-state`} label="State" error={errors.state}>
                      <input id={`${uid}-state`} autoComplete="address-level1" value={form.state} onChange={set('state')} aria-invalid={!!errors.state} aria-describedby={`${uid}-state-err`} className={inputCls} />
                    </Field>
                  </div>
                  <Field id={`${uid}-pin`} label="Pincode" error={errors.pincode}>
                    <input id={`${uid}-pin`} inputMode="numeric" autoComplete="postal-code" maxLength={6} value={form.pincode} onChange={(e) => set('pincode')({ target: { value: e.target.value.replace(/\D/g, '') } })} aria-invalid={!!errors.pincode} aria-describedby={`${uid}-pin-err`} className={inputCls} />
                  </Field>
                </>
              )}
              <div className="mt-4 flex gap-3">
                {step > 0 && <Button variant="outline" onClick={() => go(step - 1)}>Back</Button>}
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="max-w-xl">
              <fieldset className="grid gap-2 border-0 p-0">
                <legend className="label mb-3">Payment method (demo)</legend>
                {([['upi', 'UPI'], ['card', 'Credit / debit card'], ['cod', 'Cash on delivery']] as const).map(([v, l]) => (
                  <label key={v} className="flex min-h-14 cursor-pointer items-center gap-3 border border-line px-4 has-[:checked]:border-ink">
                    <input type="radio" name="method" checked={form.method === v} onChange={() => setForm((f) => ({ ...f, method: v }))} className="accent-[var(--color-ink)]" />
                    {l} <span className="label ml-auto text-stone">Demo</span>
                  </label>
                ))}
              </fieldset>
              {form.method === 'card' && (
                <div className="mt-4 grid gap-3 opacity-60" aria-label="Sample card fields (disabled)">
                  <input disabled value="4242 4242 4242 4242" aria-label="Sample card number (disabled)" readOnly className={inputCls} />
                  <div className="grid grid-cols-2 gap-3">
                    <input disabled value="12 / 30" aria-label="Sample expiry (disabled)" readOnly className={inputCls} />
                    <input disabled value="•••" aria-label="Sample CVV (disabled)" readOnly className={inputCls} />
                  </div>
                  <p className="text-xs text-stone">Sample values only. This demo never collects card details.</p>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => go(1)}>Back</Button>
                <Button onClick={() => go(3)}>Review order</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-xl">
              <dl className="grid gap-4 text-[15px]">
                <div><dt className="label text-stone">Contact</dt><dd>{form.email} · {form.phone}</dd></div>
                <div><dt className="label text-stone">Ship to</dt><dd>{form.name}, {form.address}, {form.city}, {form.state} {form.pincode}</dd></div>
                <div><dt className="label text-stone">Payment</dt><dd className="uppercase">{form.method} (demo)</dd></div>
              </dl>
              <ul className="mt-6 hairline-t">
                {lines.map((l) => (
                  <li key={l.line.key} className="hairline-b flex items-center gap-4 py-3">
                    <Img src={l.image} alt="" ratio="4 / 5" sizes="64px" className="w-14" />
                    <div className="min-w-0 flex-1 text-sm"><p className="truncate font-medium">{l.product.name}</p><p className="text-stone">{l.line.color} · {l.line.size} · Qty {l.line.qty}</p></div>
                    <p className="num text-sm">{formatPrice(l.total)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => go(2)}>Back</Button>
                <Button variant="oxblood" disabled={placing} onClick={simulate}>{placing ? 'Simulating…' : `Simulate order · ${formatPrice(totals.total)}`}</Button>
              </div>
              <p className="mt-3 text-xs text-stone">No payment is processed. <Link to="/cart" className="underline underline-offset-4">Edit cart</Link></p>
            </div>
          )}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start"><OrderSummary showCheckout={false} /></div>
      </div>
    </div>
  )
}
