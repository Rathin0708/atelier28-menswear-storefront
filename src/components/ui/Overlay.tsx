import { AnimatePresence, motion, useDragControls } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useEscape, useFocusTrap, useLockBodyScroll, useMediaQuery } from '@/hooks'
import { DUR, EASE_OVERLAY } from '@/lib/motion'

export type OverlayVariant = 'modal' | 'drawer' | 'sheet' | 'fullscreen'

interface OverlayProps {
  open: boolean
  onClose: () => void
  /** Accessible name when no visible title is wired up. */
  label: string
  variant: OverlayVariant
  /** `modal` becomes a bottom sheet below 768px; `drawer` below 640px. */
  responsive?: boolean
  maxWidth?: string
  panelClassName?: string
  dark?: boolean
  children: ReactNode
}

export function Overlay(props: OverlayProps) {
  return createPortal(
    <AnimatePresence>{props.open && <OverlayPanel key="panel" {...props} />}</AnimatePresence>,
    document.body,
  )
}

function OverlayPanel({
  onClose,
  label,
  variant,
  responsive = true,
  maxWidth = '960px',
  panelClassName = '',
  dark = false,
  children,
}: OverlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()
  const wide = useMediaQuery('(min-width: 768px)')
  const mid = useMediaQuery('(min-width: 640px)')

  const mode: OverlayVariant =
    responsive && ((variant === 'modal' && !wide) || (variant === 'drawer' && !mid)) ? 'sheet' : variant

  useLockBodyScroll(true)
  useFocusTrap(ref, true)
  useEscape(onClose)

  const t = { duration: DUR.ui + 0.05, ease: EASE_OVERLAY }

  const panelMotion = {
    modal: { initial: { opacity: 0, y: 16, scale: 0.985 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 8 } },
    drawer: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    sheet: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
    fullscreen: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  }[mode]

  const position = {
    modal: 'left-1/2 top-1/2 w-[calc(100%-32px)] max-h-[90dvh] -translate-x-1/2 -translate-y-1/2',
    drawer: 'right-0 top-0 h-dvh w-[min(480px,100vw)]',
    sheet: 'bottom-0 left-0 right-0 max-h-[92dvh] rounded-t-[2px]',
    fullscreen: 'inset-0 h-dvh w-full',
  }[mode]

  return (
    <div className="fixed inset-0 z-[80]" data-overlay>
      <motion.div
        className="absolute inset-0 bg-ink/55"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: DUR.ui }}
        onClick={mode === 'fullscreen' ? undefined : onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        data-dark={dark ? '' : undefined}
        className={`absolute flex flex-col overflow-hidden outline-none ${dark ? 'bg-ink text-bone' : 'bg-paper text-ink'} ${position} ${panelClassName}`}
        style={mode === 'modal' ? { maxWidth } : undefined}
        {...panelMotion}
        transition={t}
        drag={mode === 'sheet' ? 'y' : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 600) onClose()
        }}
      >
        {mode === 'sheet' && (
          <div
            className="flex shrink-0 cursor-grab touch-none justify-center py-3 active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
            aria-hidden="true"
          >
            <span className="h-1 w-10 rounded-full bg-line" />
          </div>
        )}
        {children}
      </motion.div>
    </div>
  )
}
