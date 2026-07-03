import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

/* Persistent HUD: top progress bar, corner brackets, telemetry readouts. */
export default function HUDOverlay() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const [pct, setPct] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.round(v * 100)
    setPct((prev) => (prev === next ? prev : next))
  })

  const corner = 'fixed w-8 h-8 pointer-events-none z-40 hidden md:block'
  const stroke = { borderColor: 'rgba(14,124,134, 0.35)' }

  return (
    <>
      {/* scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
        style={{ scaleX: progress, background: 'linear-gradient(90deg, var(--red), var(--gold), var(--arc))' }}
      />

      {/* corner brackets */}
      <div className={`${corner} top-3 left-3 border-t-2 border-l-2`} style={stroke} />
      <div className={`${corner} top-3 right-3 border-t-2 border-r-2`} style={stroke} />
      <div className={`${corner} bottom-3 left-3 border-b-2 border-l-2`} style={stroke} />
      <div className={`${corner} bottom-3 right-3 border-b-2 border-r-2`} style={stroke} />

      {/* telemetry */}
      <div
        className="fixed bottom-5 left-6 z-40 hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em]"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}
      >
        <span className="relative inline-flex w-1.5 h-1.5 rounded-full ping" style={{ background: '#22C55E', color: '#22C55E' }} />
        <span>SYS://ONLINE</span>
      </div>
      <div
        className="fixed bottom-5 right-6 z-40 hidden md:block text-[10px] tracking-[0.2em] tabular-nums"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}
      >
        DESCENT {String(pct).padStart(3, '0')}%
      </div>
    </>
  )
}
