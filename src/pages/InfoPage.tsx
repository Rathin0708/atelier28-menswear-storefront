import { useState, type FormEvent, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { SizeChart } from '@/components/product/SizeGuideModal'
import { Accordion, Button, ButtonLink } from '@/components/ui/Controls'
import { SplitLines } from '@/components/ui/Motion'
import { brand } from '@/config/brand'
import { usePageMeta } from '@/hooks/usePageMeta'
import { formatPrice } from '@/lib/format'
import NotFound from '@/pages/NotFound'

interface PageDef {
  title: string
  intro: string
  body: ReactNode
}

const P = ({ children }: { children: ReactNode }) => <p className="text-[16px] leading-relaxed text-stone">{children}</p>
const H = ({ children }: { children: ReactNode }) => <h2 className="display display-md mt-12 text-ink">{children}</h2>

const faqs = [
  { q: 'How do I find my size?', a: 'Use the size guide on any product page or the Size Guide page. If you are between sizes, size up for a relaxed fit.' },
  { q: 'How long does delivery take?', a: 'Orders dispatch within 48 hours. Most metros receive within 3–5 days, the rest of India in 5–7.' },
  { q: 'Can I return or exchange an item?', a: 'Yes — within 14 days of delivery for unworn items with tags attached. Exchanges are free.' },
  { q: 'Do you ship internationally?', a: 'Not yet. This demo storefront ships within India only.' },
  { q: 'Is this a real store?', a: 'No. ATELIER 28 is a frontend demo. Products, prices and checkout are sample data and no payment is processed.' },
]

const pages: Record<string, PageDef> = {
  shipping: {
    title: 'Shipping',
    intro: 'Fast, tracked and free above a threshold.',
    body: (
      <>
        <P>Free standard shipping on orders above {formatPrice(brand.freeShippingThreshold)}. Below that, a flat {formatPrice(brand.shippingFee)}. Orders are dispatched within 48 hours and arrive in 3–7 days depending on your pincode.</P>
        <H>Delivery times</H>
        <P>Metros: 3–4 days. Tier-2 cities: 4–5 days. Remote locations: 5–7 days. You will receive a tracking link by email and SMS the moment your order leaves the atelier.</P>
        <H>Cash on delivery</H>
        <P>COD is available on orders up to ₹10,000 for a ₹49 handling fee.</P>
      </>
    ),
  },
  returns: {
    title: 'Returns & exchanges',
    intro: 'Fourteen days, no questions asked.',
    body: (
      <>
        <P>If something is not right, send it back within 14 days of delivery. Items must be unworn, unwashed and have their tags attached.</P>
        <H>How it works</H>
        <P>Start a return from your order email. We collect the parcel from your door and refund within 5 working days of it reaching us. Exchanges for a different size are always free.</P>
        <H>Exceptions</H>
        <P>Socks, caps and sunglasses are final sale for hygiene reasons unless faulty.</P>
      </>
    ),
  },
  faq: { title: 'FAQ', intro: 'Quick answers to the questions we hear most.', body: <Accordion items={faqs.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} defaultOpen={null} /> },
  'size-guide': { title: 'Size guide', intro: 'Garment measurements, in centimetres or inches.', body: <SizeChart /> },
  privacy: {
    title: 'Privacy',
    intro: 'What we collect and why.',
    body: (
      <>
        <P>This is a frontend demo. Your cart, wishlist and newsletter preference are stored only in your own browser (localStorage) and are never sent anywhere.</P>
        <H>Cookies</H>
        <P>We do not use tracking cookies. A single localStorage key remembers dismissed announcements.</P>
        <H>Your choices</H>
        <P>Clear your browser’s site data at any time to remove everything this demo has stored.</P>
      </>
    ),
  },
  terms: {
    title: 'Terms',
    intro: 'The fine print, in plain language.',
    body: (
      <>
        <P>ATELIER 28 is a design demonstration. Products, prices and availability are sample data and cannot be purchased. No contract of sale is formed and no payment is taken.</P>
        <H>Intellectual property</H>
        <P>The brand name, copy and layout are original to this demonstration. Photography is sourced from Unsplash contributors under the Unsplash licence.</P>
      </>
    ),
  },
  careers: {
    title: 'Careers',
    intro: 'Make clothes slowly, and well.',
    body: (
      <>
        <P>We are a small team of pattern-cutters, designers and engineers. There are no open roles in this demo, but we are always glad to meet people who care about craft.</P>
        <ul className="mt-6 hairline-t">
          {['Senior Pattern Cutter — Mumbai', 'Frontend Engineer — Remote (India)', 'Store Stylist — Kala Ghoda'].map((r) => (
            <li key={r} className="hairline-b flex min-h-14 items-center justify-between"><span>{r}</span><span className="label text-stone">Not hiring</span></li>
          ))}
        </ul>
      </>
    ),
  },
  stores: {
    title: 'Stores',
    intro: 'Visit the atelier.',
    body: (
      <ul className="hairline-t">
        {[['Kala Ghoda, Mumbai', '12 Rampart Row · Mon–Sat 11:00–20:00'], ['Indiranagar, Bengaluru', '100 Feet Road · Daily 11:00–21:00'], ['Khan Market, Delhi', 'Middle Lane · Daily 11:00–21:00']].map(([n, a]) => (
          <li key={n} className="hairline-b py-5"><p className="display text-3xl">{n}</p><p className="mt-1 text-stone">{a}</p></li>
        ))}
      </ul>
    ),
  },
  contact: { title: 'Contact', intro: 'We reply within one working day.', body: <ContactForm /> },
}

function ContactForm() {
  const [state, setState] = useState<'idle' | 'sent'>('idle')
  const [err, setErr] = useState<Record<string, string>>({})
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const errors: Record<string, string> = {}
    if (String(d.get('name') ?? '').trim().length < 2) errors.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(d.get('email') ?? ''))) errors.email = 'Enter a valid email address.'
    if (String(d.get('message') ?? '').trim().length < 10) errors.message = 'Tell us a little more (at least 10 characters).'
    setErr(errors)
    if (Object.keys(errors).length === 0) setState('sent')
  }
  if (state === 'sent') return <p role="status" className="display display-md">Thanks — this is a demo, so nothing was sent, but we would have replied within a day.</p>
  const cls = 'min-h-12 w-full border border-line bg-paper px-4 aria-[invalid=true]:border-oxblood'
  return (
    <form onSubmit={submit} noValidate className="grid max-w-xl gap-2">
      {[
        { id: 'name', label: 'Name', ac: 'name', type: 'text' },
        { id: 'email', label: 'Email', ac: 'email', type: 'email' },
      ].map((f) => (
        <div key={f.id}>
          <label htmlFor={`c-${f.id}`} className="label mb-2 block">{f.label}</label>
          <input id={`c-${f.id}`} name={f.id} type={f.type} autoComplete={f.ac} aria-invalid={!!err[f.id]} aria-describedby={`c-${f.id}-e`} className={cls} />
          <p id={`c-${f.id}-e`} role="alert" className="mt-1 min-h-5 text-sm text-oxblood">{err[f.id]}</p>
        </div>
      ))}
      <div>
        <label htmlFor="c-message" className="label mb-2 block">Message</label>
        <textarea id="c-message" name="message" rows={5} aria-invalid={!!err.message} aria-describedby="c-message-e" className={`${cls} py-3`} />
        <p id="c-message-e" role="alert" className="mt-1 min-h-5 text-sm text-oxblood">{err.message}</p>
      </div>
      <Button type="submit" className="self-start">Send message</Button>
    </form>
  )
}

export default function InfoPage() {
  const key = useLocation().pathname.replace(/^\//, '')
  const page = pages[key]
  usePageMeta(page?.title ?? '', page?.intro)
  if (!page) return <NotFound />
  return (
    <div className="wrap pb-24 pt-10 md:pt-16">
      <SplitLines as="h1" lines={[page.title]} className="display display-xl" immediate />
      <p className="mt-5 max-w-[56ch] text-lg text-stone">{page.intro}</p>
      <div className="mt-12 max-w-3xl">{page.body}</div>
      <div className="mt-16"><ButtonLink to="/shop" variant="outline">Continue shopping</ButtonLink></div>
    </div>
  )
}
