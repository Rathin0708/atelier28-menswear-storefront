import { useId, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Controls'
import { Reveal } from '@/components/ui/Motion'
import { brand } from '@/config/brand'
import { isStringArray, readJSON, writeJSON } from '@/lib/storage'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'duplicate' | 'invalid'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const messages: Record<Status, string> = {
  idle: '',
  loading: 'Subscribing…',
  success: 'You are in. Look out for the next drop in your inbox.',
  error: 'Something went wrong on our side. Please try again in a moment.',
  duplicate: 'That email is already subscribed.',
  invalid: '',
}

export function Newsletter() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const value = email.trim().toLowerCase()
    if (!value) {
      setError('Enter your email address.')
      setStatus('invalid')
      return
    }
    if (!EMAIL.test(value)) {
      setError('Enter a valid email address, like name@example.com.')
      setStatus('invalid')
      return
    }
    setError('')
    const list = readJSON(brand.storageKeys.subscribers, [], isStringArray)
    if (list.includes(value)) {
      setStatus('duplicate')
      return
    }
    setStatus('loading')
    window.setTimeout(() => {
      // Demo hook: addresses on the reserved ".invalid" TLD simulate a server failure.
      if (value.endsWith('.invalid')) {
        setStatus('error')
        return
      }
      writeJSON(brand.storageKeys.subscribers, [...list, value])
      setStatus('success')
      setEmail('')
    }, 900)
  }

  const message = status === 'invalid' ? error : messages[status]
  const bad = status === 'invalid' || status === 'error'

  return (
    <section aria-labelledby="news-h" className="bg-paper">
      <div className="wrap section-pad grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <Reveal>
          <p className="label text-stone">10 / The letter</p>
          <h2 id="news-h" className="display display-xl mt-4">First to know,<br />first to wear.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={submit} noValidate aria-labelledby="news-h">
            <label htmlFor={`${id}-email`} className="label mb-3 block">Email address</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input id={`${id}-email`} type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); if (status === 'invalid') setStatus('idle') }} aria-invalid={status === 'invalid'} aria-describedby={`${id}-msg ${id}-consent`} className="min-h-14 min-w-0 flex-1 border border-ink bg-transparent px-5 aria-[invalid=true]:border-oxblood" />
              <Button type="submit" disabled={status === 'loading'} className="min-h-14">{status === 'loading' ? 'Subscribing…' : 'Subscribe'}</Button>
            </div>
            <p id={`${id}-msg`} role="status" aria-live="polite" className={`mt-3 min-h-6 text-[15px] ${bad ? 'text-oxblood' : status === 'success' ? 'text-olive' : 'text-stone'}`}>{message}</p>
            <p id={`${id}-consent`} className="mt-2 text-xs text-stone">By subscribing you agree to receive occasional emails from {brand.name}. Unsubscribe any time. Demo only — your address is stored in this browser, nowhere else.</p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
