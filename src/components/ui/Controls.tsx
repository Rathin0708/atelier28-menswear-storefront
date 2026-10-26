import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, Star, X } from 'lucide-react'
import { useId, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { DUR, EASE_REVEAL } from '@/lib/motion'
import type { Badge as BadgeType } from '@/types'

type Variant = 'solid' | 'outline' | 'ghost' | 'oxblood' | 'light'

const base =
  'inline-flex min-h-[48px] items-center justify-center gap-2 px-7 label transition-[background,color,border-color,opacity] duration-300 disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<Variant, string> = {
  solid: 'bg-ink text-bone border border-ink hover:bg-oxblood hover:border-oxblood',
  oxblood: 'bg-oxblood text-bone border border-oxblood hover:bg-ink hover:border-ink',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-bone',
  light: 'bg-bone text-ink border border-bone hover:bg-transparent hover:text-bone',
  ghost: 'text-ink hover:text-oxblood',
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  full?: boolean
}

export function Button({ variant = 'solid', full, className = '', type = 'button', ...rest }: BtnProps) {
  return <button type={type} className={`${base} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`} {...rest} />
}

export function ButtonLink({ variant = 'solid', full, className = '', ...rest }: LinkProps & { variant?: Variant; full?: boolean }) {
  return <Link className={`${base} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`} {...rest} />
}

interface IconBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
}

/** 44×44 minimum hit area with a required accessible name. */
export function IconButton({ label, children, className = '', type = 'button', ...rest }: IconBtnProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`relative inline-grid h-11 w-11 shrink-0 place-items-center transition-colors duration-200 hover:text-oxblood ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function CloseButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <IconButton label="Close" onClick={onClick} className={className}>
      <X size={22} strokeWidth={1.5} />
    </IconButton>
  )
}

const badgeStyle: Record<BadgeType, string> = {
  New: 'bg-ink text-bone',
  Bestseller: 'bg-paper text-ink',
  Limited: 'bg-olive text-bone',
  Sale: 'bg-oxblood text-bone',
}

export function Badge({ kind, children }: { kind: BadgeType; children?: ReactNode }) {
  return <span className={`label px-2 py-1 text-[10px] ${badgeStyle[kind]}`}>{children ?? kind}</span>
}

export function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex" role="img" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={13} strokeWidth={1.5} className={n <= Math.round(rating) ? 'fill-current' : 'opacity-30'} />
        ))}
      </span>
      {count !== undefined && <span className="num text-xs text-stone">({count})</span>}
    </span>
  )
}

export function QtyStepper({ value, onChange, label = 'Quantity' }: { value: number; onChange: (n: number) => void; label?: string }) {
  return (
    <div className="inline-flex items-center border border-line" role="group" aria-label={label}>
      <button type="button" aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)} className="grid h-11 w-11 place-items-center hover:text-oxblood disabled:opacity-30">
        <Minus size={16} />
      </button>
      <output aria-live="polite" className="num w-8 text-center text-sm">{value}</output>
      <button type="button" aria-label="Increase quantity" disabled={value >= 10} onClick={() => onChange(value + 1)} className="grid h-11 w-11 place-items-center hover:text-oxblood disabled:opacity-30">
        <Plus size={16} />
      </button>
    </div>
  )
}

export function Skeleton({ className = '', ratio }: { className?: string; ratio?: string }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} style={{ aspectRatio: ratio }} />
}

export interface AccordionItem {
  title: string
  content: ReactNode
}

export function Accordion({ items, defaultOpen = 0 }: { items: AccordionItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const uid = useId()
  return (
    <div className="hairline-t">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.title} className="hairline-b">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${uid}-${i}`}
                id={`${uid}-h-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[56px] w-full items-center justify-between gap-4 py-3 text-left label"
              >
                {item.title}
                <Plus size={16} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-${i}`}
                  role="region"
                  aria-labelledby={`${uid}-h-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DUR.ui, ease: EASE_REVEAL }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-[15px] leading-relaxed text-stone">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
