import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

export const EASE = [0.22, 1, 0.36, 1]

/* HUD corner brackets — drop inside any .brackets element */
export function Brackets() {
  return (
    <>
      <span className="bk bk-tl" />
      <span className="bk bk-tr" />
      <span className="bk bk-bl" />
      <span className="bk bk-br" />
    </>
  )
}

/* Standard section header: `01 // MISSION LOG` + big Orbitron title */
export function SectionHeader({ num, code, title, accent = 'var(--arc)' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="mb-14">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex items-center gap-3 mb-5"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        <span className="text-xs tracking-widest" style={{ color: 'var(--text-3)' }}>{num}</span>
        <span className="text-xs tracking-widest" style={{ color: accent }}>{'//'} {code}</span>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="h-px flex-1 origin-left"
          style={{ background: `linear-gradient(90deg, ${accent === 'var(--arc)' ? 'rgba(14,124,134, 0.4)' : accent} , transparent)` }}
        />
      </motion.div>
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: 64, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="text-3xl md:text-5xl font-black uppercase"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
        >
          {title}
        </motion.h2>
      </div>
    </div>
  )
}

/* 3D tilt wrapper — hologram-style pointer tracking */
export function TiltCard({ children, className = '', style = {}, max = 7 }) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 180, damping: 18 })
  const sry = useSpring(ry, { stiffness: 180, damping: 18 })

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ry.set(px * max * 2)
    rx.set(-py * max * 2)
  }
  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d', perspective: 800, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Magnetic hover — element leans toward the cursor */
export function Magnetic({ children, strength = 10, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 16 })
  const sy = useSpring(y, { stiffness: 200, damping: 16 })

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect()
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * strength * 2)
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * strength * 2)
  }
  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} style={{ x: sx, y: sy }} className={className}>
      {children}
    </motion.div>
  )
}

/* Mono chip */
export function Chip({ children, color = 'var(--text-3)' }) {
  return (
    <span
      className="text-[11px] px-2.5 py-1 rounded"
      style={{
        fontFamily: 'var(--font-mono)',
        color,
        background: 'rgba(107,74,26, 0.04)',
        border: '1px solid var(--line)',
        letterSpacing: '0.06em',
      }}
    >
      {children}
    </span>
  )
}
