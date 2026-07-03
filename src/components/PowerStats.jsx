import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { stats } from '../data.js'

function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const ctrl = animate(count, to, { duration: 2, ease: [0.16, 1, 0.3, 1] })
      return ctrl.stop
    }
  }, [isInView, to, count])

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

/* Radial power gauge behind each number */
function Gauge({ pct, color, delay, inView }) {
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 110 110" className="absolute inset-0 w-full h-full -rotate-90">
      <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(107,74,26, 0.08)" strokeWidth="3" />
      <motion.circle
        cx="55" cy="55" r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={inView ? { strokeDashoffset: c * (1 - pct) } : {}}
        transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  )
}

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const item = {
  hidden: { opacity: 0, y: 34, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function PowerStats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative py-20 px-6" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'rgba(210,184,121, 0.6)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-center mb-12 text-[11px] tracking-[0.4em]"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}
        >
          [ SYSTEM OUTPUT — VERIFIED FIELD DATA ]
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4"
        >
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={item} className="flex flex-col items-center text-center group cursor-default">
              <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center mb-5">
                <Gauge pct={Math.min(s.value / 100, 1)} color={s.color} delay={0.3 + i * 0.12} inView={isInView} />
                <span
                  className="text-3xl md:text-4xl font-black"
                  style={{ fontFamily: 'var(--font-display)', color: s.color, textShadow: `0 0 22px ${s.color}55` }}
                >
                  <Counter to={s.value} suffix={s.suffix} />
                </span>
              </div>
              <span className="text-sm md:text-base font-bold tracking-wide uppercase" style={{ color: 'var(--text)' }}>
                {s.label}
              </span>
              <span className="text-xs mt-1.5 tracking-wide" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
                {s.sub}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
