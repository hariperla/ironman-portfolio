import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Magnetic } from './ui.jsx'
import { profile } from '../data.js'
import { art } from '../art.js'

const EASE = [0.22, 1, 0.36, 1]

// chest-reactor calibration for public/art/hero.jpg (percent of art box)
const CHEST_X = 51
const CHEST_Y = 85

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
          animate={{ y: 0, opacity: [0, 1, 0.35, 1, 0.6, 1], rotateX: 0 }}
          transition={{
            y: { duration: 0.65, delay: delay + i * 0.035, ease: EASE },
            rotateX: { duration: 0.65, delay: delay + i * 0.035, ease: EASE },
            opacity: { duration: 0.5, delay: delay + i * 0.035, times: [0, 0.35, 0.5, 0.62, 0.75, 1] },
          }}
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

/* Motes drifting left along the beam, from the painted reactor toward the text —
   sells the idea that the text is projected light, not just typography. */
function HoloMotes({ reduce }) {
  const motes = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({
      id: i,
      topPct: 32 + Math.random() * 34,
      size: 2 + Math.random() * 3,
      dur: 3 + Math.random() * 2.5,
      delay: -Math.random() * 5,
    })),
    [],
  )
  if (reduce) return null
  return (
    <>
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: `${m.topPct}%`,
            width: m.size,
            height: m.size,
            background: 'var(--arc-bright)',
            boxShadow: '0 0 6px var(--arc-bright), 0 0 12px var(--arc-bright)',
          }}
          animate={{ left: ['94%', '4%'], opacity: [0, 0.9, 0] }}
          transition={{ repeat: Infinity, duration: m.dur, delay: m.delay, ease: 'linear' }}
        />
      ))}
    </>
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

  // mouse parallax on the painting
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 60, damping: 18 })
  const smy = useSpring(my, { stiffness: 60, damping: 18 })

  function onMouseMove(e) {
    if (reduce) return
    const { innerWidth, innerHeight } = window
    mx.set(((e.clientX / innerWidth) - 0.5) * 26)
    my.set(((e.clientY / innerHeight) - 0.5) * 26)
  }

  return (
    <section id="top" ref={ref} onMouseMove={onMouseMove} className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-10">
      {/* painting — backdrop on mobile, right side on desktop. Height is clamped to
          the viewport so on short screens the box never grows taller than the
          section and gets flat-clipped by overflow-hidden. */}
      <motion.div
        className="absolute right-[-8%] md:right-[2%] top-1/2 -translate-y-1/2 opacity-40 md:opacity-90 pointer-events-none"
        style={{ y: reactorY, scale: reactorScale, opacity: reactorOpacity }}
      >
        <motion.div style={{ x: smx, y: smy }}>
          <div
            className="relative opacity-45 md:opacity-100"
            style={{ height: 'clamp(360px, 76vh, 840px)', aspectRatio: '3 / 4', maxWidth: '88vw' }}
          >
            {/* painted armor figure */}
            <motion.img
              src={art.hero}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              style={{
                maskImage: 'radial-gradient(ellipse 70% 74% at 50% 50%, black 62%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 70% 74% at 50% 50%, black 62%, transparent 100%)',
              }}
            />
            {/* soft pulsing glow over the painted chest reactor — no foreign 3D object,
                just breath on the light that's already in the artwork */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: `${CHEST_X}%`, top: `${CHEST_Y}%`, width: '22%', aspectRatio: '1',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(94,214,255,0.42), rgba(94,214,255,0.1) 48%, transparent 72%)',
              }}
              animate={reduce ? {} : { opacity: [0.75, 1, 0.75], scale: [0.94, 1.04, 0.94] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
            />
            {/* projector cone — the beam that "becomes" the text block beside it */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: 0, top: `${CHEST_Y}%`, width: `${CHEST_X}%`, height: '40%',
                transform: 'translateY(-50%)',
                clipPath: 'polygon(100% 44%, 100% 56%, 0% 100%, 0% 0%)',
                background: 'linear-gradient(to left, rgba(94,214,255,0.4), rgba(94,214,255,0.08) 65%, transparent 92%)',
                mixBlendMode: 'screen',
              }}
              animate={reduce ? {} : { opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* holographic motes drifting from the painting toward the text */}
      <div className="absolute inset-y-0 right-0 w-[62%] md:w-[56%] pointer-events-none overflow-hidden">
        <HoloMotes reduce={reduce} />
      </div>

      {/* text block — projected light, not just type */}
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
              whileHover={{ scale: 1.04, borderColor: 'var(--red)' }}
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
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"
          animate={reduce ? {} : { y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.div>
    </section>
  )
}
