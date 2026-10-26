import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Pause, Play, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { brand } from '@/config/brand'
import { announcements } from '@/data/site'
import { readJSON, writeJSON } from '@/lib/storage'

const isBool = (v: unknown): v is boolean => typeof v === 'boolean'

export function AnnouncementBar() {
  const reduce = useReducedMotion()
  const [dismissed, setDismissed] = useState(() => readJSON(brand.storageKeys.announce, false, isBool))
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [paused, setPaused] = useState(false)

  const running = !dismissed && !hovered && !paused && !reduce
  useEffect(() => {
    if (!running) return
    const t = window.setInterval(() => setIndex((i) => (i + 1) % announcements.length), 4200)
    return () => window.clearInterval(t)
  }, [running])

  if (dismissed) return null

  return (
    <div
      className="relative z-[60] bg-ink text-bone"
      role="region"
      aria-label="Announcements"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="wrap flex h-10 items-center justify-between gap-2">
        {!reduce ? (
          <button type="button" aria-label={paused ? 'Resume announcements' : 'Pause announcements'} onClick={() => setPaused((p) => !p)} className="hidden h-11 w-11 shrink-0 place-items-center sm:grid">
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        ) : (
          <span className="hidden w-11 sm:block" />
        )}
        <div className="relative h-5 flex-1 overflow-hidden text-center" aria-live={running ? 'off' : 'polite'}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="label absolute inset-0 truncate leading-5"
            >
              {announcements[index]}
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          type="button"
          aria-label="Dismiss announcements"
          onClick={() => {
            setDismissed(true)
            writeJSON(brand.storageKeys.announce, true)
          }}
          className="grid h-11 w-11 shrink-0 place-items-center"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
