import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useRef, type ElementType, type ReactNode } from 'react'
import { useIsFinePointer } from '@/hooks'
import { DUR, EASE_REVEAL } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

/** Fade-and-rise on first scroll into view. */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: DUR.reveal, delay, ease: EASE_REVEAL }}
    >
      {children}
    </motion.div>
  )
}

interface SplitLinesProps {
  lines: string[]
  as?: ElementType
  className?: string
  delay?: number
  /** Animate on mount instead of on scroll (hero). */
  immediate?: boolean
}

/** Display heading whose lines rise out of a mask. */
export function SplitLines({ lines, as: Tag = 'h2', className = '', delay = 0, immediate = false }: SplitLinesProps) {
  const trigger = immediate
    ? { animate: { y: '0%' } }
    : { whileInView: { y: '0%' }, viewport: { once: true, margin: '0px 0px -10% 0px' } }
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={line + i} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            {...trigger}
            transition={{ duration: DUR.hero, delay: delay + i * 0.09, ease: EASE_REVEAL }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

/** Pulls its child toward the pointer on fine-pointer devices. */
export function Magnetic({ children, strength = 0.28, className = '' }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const fine = useIsFinePointer()
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const enabled = fine && !reduce

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={
        enabled
          ? (e) => {
              const r = ref.current?.getBoundingClientRect()
              if (!r) return
              x.set((e.clientX - (r.left + r.width / 2)) * strength)
              y.set((e.clientY - (r.top + r.height / 2)) * strength)
            }
          : undefined
      }
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}
