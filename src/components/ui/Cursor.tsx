import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useIsFinePointer } from '@/hooks'

/**
 * Custom follower for fine pointers. Elements opt in with `data-cursor="LABEL"`.
 * Off on touch and under reduced motion; the native cursor stays on form fields.
 */
export function Cursor() {
  const fine = useIsFinePointer()
  const reduce = useReducedMotion()
  const enabled = fine && !reduce
  const x = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.35 })
  const y = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.35 })
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    document.body.classList.add('cursor-on')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]')
      const field = (e.target as Element | null)?.closest('input, textarea, select')
      setLabel(field ? '' : (target?.dataset.cursor ?? ''))
      setVisible(!field)
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      document.body.classList.remove('cursor-on')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  const big = label !== ''
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120] grid place-items-center rounded-full bg-bone text-ink mix-blend-normal"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      animate={{ width: big ? 84 : 10, height: big ? 84 : 10, opacity: visible ? 1 : 0, backgroundColor: big ? '#F2EEE7' : '#6B1E22' }}
      transition={{ duration: 0.25 }}
    >
      {big && <span className="label text-[10px]">{label}</span>}
    </motion.div>
  )
}
