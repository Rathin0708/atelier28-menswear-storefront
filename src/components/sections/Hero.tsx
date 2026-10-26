import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ButtonLink } from '@/components/ui/Controls'
import { Img } from '@/components/ui/Img'
import { Magnetic, SplitLines } from '@/components/ui/Motion'
import { brand } from '@/config/brand'
import { editorial } from '@/data/images'
import { DUR, EASE_REVEAL } from '@/lib/motion'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12])

  return (
    <section ref={ref} aria-label="AW 2028 collection" className="relative -mt-16 min-h-[calc(100svh-2.5rem)] overflow-hidden bg-ink text-bone" data-dark>
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Img src={editorial.hero} alt="A man in a blue suit standing on a city sidewalk" sizes="100vw" priority className="h-full w-full" position="50% 22%" />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-ink/80" />

      <div className="wrap relative flex min-h-[calc(100svh-2.5rem)] flex-col justify-end pb-10 pt-32 md:pb-14">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: DUR.reveal }} className="label mb-6">
          {brand.season}
        </motion.p>
        <SplitLines as="h1" lines={['Dressed for', 'what’s next']} className="display display-hero uppercase md:[&>span:nth-child(2)]:ml-[8vw]" delay={0.15} immediate />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: DUR.reveal, ease: EASE_REVEAL }} className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic><ButtonLink to="/collections/new-arrivals" variant="light">Shop new arrivals</ButtonLink></Magnetic>
          <Magnetic><ButtonLink to="/lookbook" variant="outline" className="!border-bone !text-bone hover:!bg-bone hover:!text-ink">Explore the lookbook</ButtonLink></Magnetic>
          <a href="#new" className="label ml-auto hidden items-center gap-3 md:inline-flex" aria-label="Scroll to new arrivals">
            Scroll
            <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-bone/30">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrolly_1.8s_var(--ease-reveal)_infinite] bg-bone" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
