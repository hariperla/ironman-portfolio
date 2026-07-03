import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { lazy, Suspense, useRef, useState } from 'react'
import { SectionHeader, Brackets } from './ui.jsx'
import { marks } from '../data.js'
import { supportsWebGL } from '../webgl.js'

const ArcReactor3D = lazy(() => import('./ArcReactor3D.jsx'))

const EASE = [0.22, 1, 0.36, 1]
const N = marks.length
const STEP = 360 / N          // angular spacing between log nodes
const CX = 200                // svg center
const NODE_R = 148            // radius of the node orbit
const VH_PER_LOG = 90         // scroll runway per log entry

/* One node on the reactor ring. Position derives from the shared ring
   rotation motion value, so nodes stay upright while the wheel turns. */
function DialNode({ i, mark, rotation, active, onClick }) {
  const rad = (deg) => (deg * Math.PI) / 180
  const x = useTransform(rotation, (r) => CX + NODE_R * Math.cos(rad(i * STEP + r)))
  const y = useTransform(rotation, (r) => CX + NODE_R * Math.sin(rad(i * STEP + r)))

  return (
    <motion.g style={{ x, y }} onClick={() => onClick(i)} className="cursor-pointer">
      {/* hit area */}
      <circle r="34" fill="transparent" />
      {active && <circle r="40" fill="rgba(232,184,75, 0.20)" />}
      <circle
        r="27"
        fill="rgba(29,20,9, 0.94)"
        stroke={active ? 'var(--gold-bright)' : 'var(--line-strong)'}
        strokeWidth={active ? 2.5 : 1.5}
        style={{ transition: 'stroke 0.3s' }}
      />
      {active && (
        <circle r="27" fill="none" stroke="var(--gold-bright)" strokeWidth="1" opacity="0.5">
          <animate attributeName="r" values="27;36" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0" dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}
      <text
        y="4"
        textAnchor="middle"
        fontSize={mark.length > 4 ? 10.5 : 12}
        fontFamily="Audiowide, sans-serif"
        fontWeight="800"
        fill={active ? 'var(--gold-bright)' : 'rgba(214,196,158,0.7)'}
        style={{ transition: 'fill 0.3s', userSelect: 'none' }}
      >
        {mark}
      </text>
    </motion.g>
  )
}

/* The arc-reactor dial: decorative spinning rings + progress arc + log nodes. */
function ReactorDial({ rotation, progress, activeIndex, goTo }) {
  const reduce = useReducedMotion()
  const ticks = Array.from({ length: 60 }, (_, i) => i * 6)
  const spin = (duration, reverse = false) =>
    reduce ? {} : { animate: { rotate: reverse ? -360 : 360 }, transition: { repeat: Infinity, ease: 'linear', duration } }
  const active = marks[activeIndex]

  return (
    <div className="relative mx-auto w-[min(62vw,260px)] lg:w-[440px] flex-shrink-0">
      {/* static ambient glow — cheap alternative to animated drop-shadow filters */}
      <div
        className="absolute -inset-6 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(185,134,15, 0.16) 30%, rgba(185,134,15, 0.05) 60%, transparent 72%)' }}
      />
      <svg viewBox="0 0 400 400" width="100%" height="100%" className="relative">
        {/* casing */}
        <circle cx={CX} cy={CX} r="196" fill="rgba(24,17,8, 0.88)" stroke="rgba(185,134,15, 0.25)" strokeWidth="1" />
        <circle cx={CX} cy={CX} r="186" fill="none" stroke="rgba(185,134,15, 0.16)" strokeWidth="6" />

        {/* progress arc — fills as you descend the log */}
        <motion.circle
          cx={CX} cy={CX} r="186"
          fill="none"
          stroke="url(#logGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />
        <defs>
          <linearGradient id="logGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--arc)" />
            <stop offset="55%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--red)" />
          </linearGradient>
        </defs>

        {/* fine tick ring — ambient spin */}
        <motion.g style={{ originX: '200px', originY: '200px' }} {...spin(80)}>
          {ticks.map((a) => (
            <line
              key={a}
              x1="200" y1="24" x2="200" y2={a % 30 === 0 ? '34' : '29'}
              stroke="rgba(34,184,196, 0.5)"
              strokeWidth={a % 30 === 0 ? 1.6 : 0.7}
              transform={`rotate(${a} 200 200)`}
            />
          ))}
        </motion.g>

        {/* node orbit track */}
        <circle cx={CX} cy={CX} r={NODE_R} fill="none" stroke="rgba(185,134,15, 0.22)" strokeWidth="1.5" strokeDasharray="3 6" />

        {/* log nodes */}
        {marks.map((m, i) => (
          <DialNode key={m.mark} i={i} mark={m.mark} rotation={rotation} active={i === activeIndex} onClick={goTo} />
        ))}
      </svg>

      {/* 3D reactor core — paints over the casing center, under the readout */}
      {supportsWebGL && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[54%] h-[54%] pointer-events-none">
          <Suspense fallback={null}>
            <ArcReactor3D core="circle" extRotation={rotation} />
          </Suspense>
        </div>
      )}

      {/* center readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.18 } }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex flex-col items-center px-5 py-3 rounded-2xl"
            style={{ background: 'rgba(18,12,5,0.45)', backdropFilter: 'blur(5px)' }}
          >
            <span
              className="text-3xl lg:text-5xl font-black"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--gold-bright)',
                letterSpacing: '0.04em',
                textShadow: '0 0 18px rgba(232,184,75,0.5), 0 0 42px rgba(232,184,75,0.2)',
              }}
            >
              {active.mark}
            </span>
            <span className="mt-2 text-xs lg:text-sm tracking-[0.22em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--arc-bright)' }}>
              {active.period}
            </span>
            <span className="mt-1 text-sm lg:text-lg font-bold tracking-wide" style={{ color: '#EFE1BE' }}>
              {active.company}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* Large-type detail card for the active log entry. */
function LogCard({ m, index }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: EASE }}
      className="brackets holo panel rounded-lg p-6 md:p-10 w-full lg:min-h-[min(540px,70vh)] max-h-[52vh] lg:max-h-[84vh] overflow-y-auto"
      style={m.current ? { borderColor: 'rgba(185,134,15, 0.35)', boxShadow: '0 0 44px rgba(138,90,12, 0.08)' } : {}}
    >
      <Brackets />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span
          className="text-[11px] md:text-xs px-2.5 py-1 rounded tracking-[0.22em] font-bold"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--arc)',
            border: '1px solid var(--line-strong)',
            background: 'rgba(107,74,26, 0.05)',
          }}
        >
          LOG {String(index + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
        </span>
        {m.current && (
          <span
            className="text-[11px] md:text-xs px-2.5 py-1 rounded tracking-[0.22em] font-bold"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--gold)',
              border: '1px solid rgba(185,134,15, 0.4)',
              background: 'rgba(138,90,12, 0.08)',
            }}
          >
            ● ACTIVE ARMOR
          </span>
        )}
      </div>

      <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-1.5" style={{ color: 'var(--text)' }}>
        {m.role}
      </h3>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-4">
        <span className="text-lg md:text-xl font-semibold" style={{ color: 'var(--text-2)' }}>{m.company}</span>
        <span className="text-sm md:text-base tracking-[0.16em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
          {m.period}
        </span>
      </div>

      <p
        className="text-sm md:text-base italic mb-6 tracking-wide"
        style={{ fontFamily: 'var(--font-mono)', color: m.current ? 'var(--gold)' : 'var(--arc)', opacity: 0.9 }}
      >
        “{m.quote}”
      </p>

      <ul className="space-y-3 mb-7">
        {m.bullets.map((b, j) => (
          <motion.li
            key={j}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + j * 0.07, ease: EASE }}
            className="flex gap-3 text-base md:text-lg leading-relaxed"
            style={{ color: 'var(--text-2)' }}
          >
            <span className="mt-[11px] flex-shrink-0 w-1.5 h-1.5 rotate-45" style={{ background: m.current ? 'var(--gold)' : 'var(--arc)' }} />
            {b}
          </motion.li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2.5">
        {m.tags.map((t) => (
          <span
            key={t}
            className="text-xs md:text-sm px-3 py-1.5 rounded"
            style={{
              fontFamily: 'var(--font-mono)',
              color: m.current ? 'var(--gold)' : 'var(--arc)',
              background: 'rgba(107,74,26, 0.04)',
              border: '1px solid var(--line)',
              letterSpacing: '0.06em',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function MarkTimeline() {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22 })

  // wheel turns as you scroll: active node parks at 3 o'clock
  const rotationRaw = useTransform(scrollYProgress, [0, 1], [0, -(N - 1) * STEP])
  const rotation = useSpring(rotationRaw, { stiffness: 60, damping: 20 })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.max(0, Math.min(N - 1, Math.round(v * (N - 1))))
    setActiveIndex((prev) => (prev === next ? prev : next))
  })

  function goTo(i) {
    const el = trackRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const scrollable = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (i / (N - 1)) * scrollable + 1, behavior: 'smooth' })
  }

  const btn =
    'px-4 py-2 rounded text-xs md:text-sm tracking-[0.2em] transition-colors border cursor-pointer disabled:opacity-30 disabled:cursor-default'

  return (
    <section id="missionlog" className="relative">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-28">
        <SectionHeader num="01" code="MISSION LOG" title="Suit Evolution" accent="var(--red)" />
      </div>

      {/* scroll runway — the dial turns while this track passes */}
      <div ref={trackRef} style={{ height: `${N * VH_PER_LOG}vh` }} className="relative">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden pt-16 lg:pt-0">
          <div className="max-w-6xl mx-auto w-full px-6 md:px-10">
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-16">
              <div className="flex flex-col items-center gap-3 lg:gap-4">
                <ReactorDial rotation={rotation} progress={progress} activeIndex={activeIndex} goTo={goTo} />

                {/* controls */}
                <div className="flex items-center gap-3" style={{ fontFamily: 'var(--font-mono)' }}>
                  <button
                    onClick={() => goTo(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className={btn}
                    style={{ color: 'var(--arc)', borderColor: 'var(--line-strong)', background: 'rgba(107,74,26, 0.04)' }}
                  >
                    ◀ PREV
                  </button>
                  <span className="text-xs md:text-sm tracking-[0.2em] tabular-nums" style={{ color: 'var(--text-3)' }}>
                    {String(activeIndex + 1).padStart(2, '0')}/{String(N).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => goTo(activeIndex + 1)}
                    disabled={activeIndex === N - 1}
                    className={btn}
                    style={{ color: 'var(--arc)', borderColor: 'var(--line-strong)', background: 'rgba(107,74,26, 0.04)' }}
                  >
                    NEXT ▶
                  </button>
                </div>
                <div className="hidden lg:block text-[11px] tracking-[0.3em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
                  [ SCROLL TO ROTATE THE REACTOR ]
                </div>
              </div>

              <div className="flex-1 w-full min-w-0">
                <AnimatePresence mode="wait">
                  <LogCard key={activeIndex} m={marks[activeIndex]} index={activeIndex} />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
