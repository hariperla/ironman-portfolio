import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/* Fixed ambient layer: blueprint grid, radial glows, drifting particles, noise. */
export default function BackgroundFX() {
  const reduce = useReducedMotion()

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.2,
        dur: 14 + Math.random() * 22,
        delay: -Math.random() * 20,
        color: i % 3 === 0 ? 'var(--red)' : i % 5 === 0 ? 'var(--gold)' : 'var(--arc)',
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* blueprint grid */}
      <div className="absolute inset-0 hud-grid" />

      {/* ambient glows */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 45% at 82% 18%, rgba(185,134,15, 0.10), transparent 65%),
            radial-gradient(ellipse 50% 40% at 12% 85%, rgba(156,32,32, 0.12), transparent 65%),
            radial-gradient(ellipse 45% 38% at 88% 62%, rgba(156,32,32, 0.045), transparent 65%),
            radial-gradient(ellipse 40% 35% at 50% 50%, rgba(14,124,134, 0.045), transparent 70%)
          `,
        }}
      />

      {/* drifting particles */}
      {!reduce &&
        particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            }}
            animate={{ y: [0, -120], opacity: [0, p.opacity, 0] }}
            transition={{ repeat: Infinity, duration: p.dur, delay: p.delay, ease: 'linear' }}
          />
        ))}

      {/* scanlines + noise */}
      <div className="absolute inset-0 scanlines" style={{ opacity: 0.35 }} />
      <div className="absolute inset-0 noise" />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(64,44,16,0.22) 100%)' }}
      />
    </div>
  )
}
