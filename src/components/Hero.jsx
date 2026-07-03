import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import ArcReactor from './ArcReactor.jsx'
import { Magnetic } from './ui.jsx'
import { profile } from '../data.js'
import { supportsWebGL } from '../webgl.js'

const ArcReactor3D = lazy(() => import('./ArcReactor3D.jsx'))

const EASE = [0.22, 1, 0.36, 1]

/* Per-letter staggered title */
function StaggerTitle({ text, delay = 0, className, style }) {
  return (
    <span aria-label={text} role="text" className={className} style={style}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          initial={{ y: '110%', opacity: 0, rotateX: -50 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.65, delay: delay + i * 0.035, ease: EASE }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}

/* Cycling typewriter for roles */
function RoleCycler() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % profile.roles.length), 3200)
    return () => clearInterval(t)
  }, [])
  const role = profile.roles[idx]

  return (
    <div className="h-7 flex items-center" style={{ fontFamily: 'var(--font-mono)' }}>
      <span className="mr-2 text-sm" style={{ color: 'var(--red)' }}>{'>'}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="text-sm md:text-base tracking-[0.18em]"
          style={{ color: 'var(--arc)' }}
        >
          {role.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.028, duration: 0.01 }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
      <span className="caret ml-1" style={{ color: 'var(--arc)' }}>▍</span>
    </div>
  )
}

function HudChip({ label, value, dot }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded panel"
      style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em' }}
    >
      {dot && <span className="relative inline-flex w-1.5 h-1.5 rounded-full ping" style={{ background: '#22C55E', color: '#22C55E' }} />}
      <span style={{ color: 'var(--text-3)' }}>{label}</span>
      <span style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  // scroll parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, 110])
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const reactorY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const reactorScale = useTransform(scrollYProgress, [0, 1], [1, 1.25])
  const reactorOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.15])

  // mouse parallax on reactor
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 60, damping: 18 })
  const smy = useSpring(my, { stiffness: 60, damping: 18 })
  // normalized pointer (-1..1, y-up) feeds the 3D reactor's tilt
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)

  function onMouseMove(e) {
    if (reduce) return
    const { innerWidth, innerHeight } = window
    mx.set(((e.clientX / innerWidth) - 0.5) * 26)
    my.set(((e.clientY / innerHeight) - 0.5) * 26)
    tiltX.set((e.clientX / innerWidth - 0.5) * 2)
    tiltY.set(-(e.clientY / innerHeight - 0.5) * 2)
  }

  return (
    <section id="top" ref={ref} onMouseMove={onMouseMove} className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-10">
      {/* reactor — backdrop on mobile, right side on desktop */}
      <motion.div
        className="absolute right-[-8%] md:right-[4%] top-1/2 -translate-y-1/2 opacity-40 md:opacity-90 pointer-events-none"
        style={{ y: reactorY, scale: reactorScale, opacity: reactorOpacity }}
      >
        <motion.div style={{ x: smx, y: smy }}>
          <div className="w-[340px] h-[340px] md:w-[460px] md:h-[460px] lg:w-[520px] lg:h-[520px] opacity-45 md:opacity-100">
            {supportsWebGL ? (
              <Suspense fallback={<ArcReactor size="100%" core="triangle" intensity={1} />}>
                <ArcReactor3D core="triangle" tiltX={tiltX} tiltY={tiltY} />
              </Suspense>
            ) : (
              <ArcReactor size="100%" core="triangle" intensity={1} />
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* text block */}
      <motion.div className="relative z-10 max-w-6xl mx-auto w-full pt-24 pb-16" style={{ y: textY, opacity: textOpacity }}>
        {/* kicker */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          className="flex items-center gap-3 mb-6"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.3em' }}
        >
          <span style={{ color: 'var(--red)' }}>{'//'}</span>
          <span style={{ color: 'var(--gold)' }}>MARK XII</span>
          <span style={{ color: 'var(--text-3)' }}>—</span>
          <span style={{ color: 'var(--arc)' }}>TRIAGE PROTOCOL</span>
        </motion.div>

        {/* name */}
        <h1
          className="font-black leading-[0.95] mb-6"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 7.2vw, 5.4rem)', letterSpacing: '0.01em' }}
        >
          <StaggerTitle text={profile.firstName} delay={0.35} className="block" style={{ color: 'var(--text)' }} />
          <StaggerTitle
            text={profile.lastName}
            delay={0.75}
            className="block glow-red"
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px var(--red)',
            }}
          />
        </h1>

        {/* role cycler */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15, duration: 0.6 }}>
          <RoleCycler />
        </motion.div>

        {/* summary */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7, ease: EASE }}
          className="mt-6 max-w-xl text-base md:text-lg leading-relaxed font-medium"
          style={{ color: 'var(--text-2)' }}
        >
          {profile.summary}
        </motion.p>

        {/* chips */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.6, ease: EASE }}
          className="flex flex-wrap gap-3 mt-7"
        >
          <HudChip label="UNIT:" value={`${profile.company.toUpperCase()} AUTONOMY`} />
          <HudChip label="BASE:" value={profile.location.toUpperCase()} />
          <HudChip label="STATUS:" value="ONLINE" dot />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6, ease: EASE }}
          className="flex flex-wrap items-center gap-4 mt-10"
        >
          <Magnetic strength={7}>
            <motion.a
              href="#comms"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded font-bold text-sm tracking-[0.18em]"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(135deg, var(--red), var(--red-deep))',
                color: '#fff',
                boxShadow: '0 0 26px rgba(156,32,32, 0.4), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              OPEN COMMS
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </motion.a>
          </Magnetic>
          <Magnetic strength={7}>
            <motion.a
              href="#missionlog"
              whileHover={{ scale: 1.04, borderColor: 'var(--arc)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded font-bold text-sm tracking-[0.18em]"
              style={{
                fontFamily: 'var(--font-display)',
                border: '1px solid var(--line-strong)',
                color: 'var(--arc)',
                background: 'rgba(107,74,26, 0.04)',
              }}
            >
              MISSION LOG
            </motion.a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--text-3)' }}
      >
        <span>SCROLL TO ENGAGE</span>
        <motion.svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--arc)" strokeWidth="2" strokeLinecap="round"
          animate={reduce ? {} : { y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.div>
    </section>
  )
}
