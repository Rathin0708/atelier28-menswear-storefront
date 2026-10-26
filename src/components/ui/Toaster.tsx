import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { DUR, EASE_REVEAL } from '@/lib/motion'
import { useUI } from '@/store/ui'

export function Toaster() {
  const { toasts, dismissToast } = useUI()
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(16px+env(safe-area-inset-bottom))] z-[95] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: DUR.ui, ease: EASE_REVEAL }}
            className="pointer-events-auto flex w-full max-w-[460px] items-center gap-4 bg-ink py-1 pl-5 pr-1 text-bone"
          >
            <p className="flex-1 py-3 text-sm">{t.message}</p>
            {t.action && (
              <button
                type="button"
                className="label min-h-11 px-3 underline underline-offset-4"
                onClick={() => {
                  t.action?.onClick()
                  dismissToast(t.id)
                }}
              >
                {t.action.label}
              </button>
            )}
            <button type="button" aria-label="Dismiss notification" onClick={() => dismissToast(t.id)} className="grid h-11 w-11 place-items-center">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
