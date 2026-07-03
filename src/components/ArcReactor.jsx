import { motion, useReducedMotion } from 'framer-motion'

/*
 * Pure-SVG arc reactor.
 * size    — px diameter
 * core    — 'triangle' (Mark VI vibe) | 'circle' (classic palladium core)
 * intensity — glow strength 0..1
 */
export default function ArcReactor({ size = 320, core = 'circle', intensity = 1, className = '' }) {
  const reduce = useReducedMotion()
  const spin = (duration, reverse = false) =>
    reduce
      ? {}
      : {
          animate: { rotate: reverse ? -360 : 360 },
          transition: { repeat: Infinity, ease: 'linear', duration },
        }

  // 10 outer coil windings
  const coils = Array.from({ length: 10 }, (_, i) => i * 36)
  // 60 fine ticks
  const ticks = Array.from({ length: 60 }, (_, i) => i * 6)

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 0 ${18 * intensity}px rgba(34,184,196,${0.55 * intensity})) drop-shadow(0 0 ${52 * intensity}px rgba(185,134,15,${0.28 * intensity}))`,
      }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="var(--arc-bright)" />
            <stop offset="100%" stopColor="rgba(107,74,26, 0.05)" />
          </radialGradient>
        </defs>

        {/* casing */}
        <circle cx="100" cy="100" r="97" fill="rgba(29,20,9, 0.85)" stroke="rgba(107,74,26, 0.18)" strokeWidth="1" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(14,124,134, 0.3)" strokeWidth="1.5" />

        {/* fine tick ring — slow spin */}
        <motion.g style={{ originX: '100px', originY: '100px' }} {...spin(60)}>
          {ticks.map((a) => (
            <line
              key={a}
              x1="100" y1="12" x2="100" y2={a % 30 === 0 ? '20' : '16'}
              stroke="rgba(14,124,134, 0.5)"
              strokeWidth={a % 30 === 0 ? 1.6 : 0.7}
              transform={`rotate(${a} 100 100)`}
            />
          ))}
        </motion.g>

        {/* coil ring — counter-spin */}
        <motion.g style={{ originX: '100px', originY: '100px' }} {...spin(90, true)}>
          <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(107,74,26, 0.25)" strokeWidth="14" />
          {coils.map((a) => (
            <rect
              key={a}
              x="93" y="24" width="14" height="16" rx="2"
              fill="rgba(34,184,196, 0.85)"
              transform={`rotate(${a} 100 100)`}
            />
          ))}
        </motion.g>

        {/* inner dashed ring */}
        <motion.g style={{ originX: '100px', originY: '100px' }} {...spin(24)}>
          <circle
            cx="100" cy="100" r="50"
            fill="none"
            stroke="rgba(34,184,196, 0.65)"
            strokeWidth="2.5"
            strokeDasharray="10 7"
          />
        </motion.g>

        {/* struts */}
        {[0, 120, 240].map((a) => (
          <line
            key={a}
            x1="100" y1="58" x2="100" y2="42"
            stroke="rgba(14,124,134, 0.45)"
            strokeWidth="3"
            transform={`rotate(${a + 60} 100 100)`}
          />
        ))}

        {/* core */}
        {core === 'triangle' ? (
          <motion.path
            d="M100 66 L131 118 L69 118 Z"
            fill="url(#coreGrad)"
            stroke="var(--arc-bright)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            animate={reduce ? {} : { opacity: [0.85, 1, 0.85], scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            style={{ originX: '100px', originY: '100px' }}
          />
        ) : (
          <motion.circle
            cx="100" cy="100" r="27"
            fill="url(#coreGrad)"
            stroke="var(--arc-bright)"
            strokeWidth="2"
            animate={reduce ? {} : { opacity: [0.85, 1, 0.85], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            style={{ originX: '100px', originY: '100px' }}
          />
        )}
      </svg>
    </div>
  )
}
