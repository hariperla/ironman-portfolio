import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Magnetic } from './ui.jsx'
import { profile } from '../data.js'
import { art } from '../art.js'
import { gsap } from '../lib/smoothScroll.js'

const EASE = [0.22, 1, 0.36, 1]
const ROLES = profile.heroRoles
const N = ROLES.length
const STEP = 360 / N
const FACE_H = 1.32                                   // em
const RADIUS = FACE_H / 2 / Math.tan(Math.PI / N)     // em: drum radius so faces meet edge to edge
const SPIN_MS = 2300

// chest-reactor position in public/art/hero.jpg (percent of art box)
const CHEST_X = 51
const CHEST_Y = 85

/* Words rise out of a mask, one after another */
function RiseWords({ text, delay = 0, className, style }) {
  return (
    <span aria-label={text} role="text" className={className} style={style}>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.08em] mr-[0.24em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.09, ease: EASE }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* "I am a ___": a 3D drum of roles that rolls upward, one face at a time.
   Rolls forever in one direction (step keeps counting; face = step % N). */
function RoleTumbler({ reduce }) {
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const active = ((step % N) + N) % N

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setStep((s) => s + 1), SPIN_MS)
    return () => clearInterval(t)
  }, [paused])

  const rot = useSpring(0, { stiffness: 90, damping: 16, mass: 0.9 })
  useEffect(() => { rot.set(step * STEP) }, [step, rot])

  const advance = () => setStep((s) => s + 1)

  if (reduce) {
    return (
      <span className="tumbler-face inline-flex" style={{ position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.span key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {ROLES[active]}
          </motion.span>
        </AnimatePresence>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-4 align-middle">
      <button
        type="button"
        onClick={advance}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        aria-label={`I am a ${ROLES[active]}. Show next role`}
        className="tumbler relative cursor-pointer"
        style={{ height: `${FACE_H}em` }}
      >
        <motion.span
          className="tumbler-drum"
          style={{ rotateX: rot, transformStyle: 'preserve-3d' }}
          aria-hidden="true"
        >
          {ROLES.map((r, i) => (
            <span
              key={r}
              className="tumbler-face"
              data-active={i === active}
              style={{ transform: `rotateX(${-i * STEP}deg) translateZ(${RADIUS}em)` }}
            >
              {r}
            </span>
          ))}
        </motion.span>
      </button>
    </span>
  )
}

export default function Hero() {
  const runway = useRef(null)
  const stage = useRef(null)
  const reduce = useReducedMotion()

  // mouse parallax on the painting
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 60, damping: 18 })
  const smy = useSpring(my, { stiffness: 60, damping: 18 })
  function onMouseMove(e) {
    if (reduce) return
    mx.set((e.clientX / window.innerWidth - 0.5) * 22)
    my.set((e.clientY / window.innerHeight - 0.5) * 22)
  }

  /* Scroll-scrubbed exit: the copy lifts away and the camera pushes into the
     suit's chest reactor until its light floods the screen, then the next
     section scrolls up out of the glow. Driven by GSAP ScrollTrigger. */
  useLayoutEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: runway.current, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
      })
      // where the chest reactor sits now, so the push-in can steer it to screen center
      const art = stage.current.querySelector('[data-hero="art"]')
      const toCenter = (axis) => () => {
        const r = art.getBoundingClientRect()
        return axis === 'x'
          ? window.innerWidth / 2 - (r.left + r.width * CHEST_X / 100)
          : window.innerHeight / 2 - (r.top + r.height * CHEST_Y / 100)
      }
      tl.to('[data-hero="copy"]', { yPercent: -14, opacity: 0, filter: 'blur(8px)', duration: 0.32 }, 0)
        .to('[data-hero="cue"]', { opacity: 0, duration: 0.08 }, 0)
        .to(art, { x: toCenter('x'), y: toCenter('y'), duration: 0.5, ease: 'power2.inOut' }, 0.05)
        .to(art, { scale: 9, duration: 0.8, ease: 'power3.in' }, 0)
        .to('[data-hero="glow"]', { opacity: 1, scale: 3.2, duration: 0.45, ease: 'power2.in' }, 0.35)
        .to(art, { autoAlpha: 0, duration: 0.18 }, 0.82)
    }, stage)
    return () => ctx.revert()
  }, [reduce])

  return (
    <section id="top" ref={runway} className="relative" style={{ height: reduce ? 'auto' : '210vh' }}>
      <div
        ref={stage}
        onMouseMove={onMouseMove}
        className="sticky top-0 h-screen min-h-[600px] flex items-center overflow-hidden px-6 md:px-10"
      >
        {/* painted armor — the camera flies into its reactor on scroll */}
        <div
          data-hero="art"
          className="absolute right-[-30%] md:right-[2%] top-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
          style={{ transformOrigin: `${CHEST_X}% ${CHEST_Y}%` }}
        >
          <motion.div style={{ x: smx, y: smy }}>
            <div
              className="relative opacity-35 md:opacity-100"
              style={{ height: 'clamp(380px, 80vh, 860px)', aspectRatio: '3 / 4', maxWidth: '92vw' }}
            >
              <motion.img
                src={art.hero}
                alt=""
                aria-hidden="true"
                fetchPriority="high"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.3, delay: 0.3, ease: EASE }}
                className="absolute inset-0 w-full h-full object-cover select-none"
                style={{
                  maskImage: 'radial-gradient(ellipse 62% 68% at 50% 52%, black 45%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 62% 68% at 50% 52%, black 45%, transparent 100%)',
                }}
              />
              {/* reactor breath, then the light that swallows the screen */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: `${CHEST_X}%`, top: `${CHEST_Y}%`, width: '22%', aspectRatio: '1',
                  x: '-50%', y: '-50%',
                  background: 'radial-gradient(circle, rgba(94,214,255,0.5), rgba(94,214,255,0.12) 48%, transparent 72%)',
                }}
                animate={reduce ? {} : { opacity: [0.7, 1, 0.7], scale: [0.94, 1.05, 0.94] }}
                transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
              />
              <div
                data-hero="glow"
                className="absolute rounded-full opacity-0"
                style={{
                  left: `${CHEST_X}%`, top: `${CHEST_Y}%`, width: '24%', aspectRatio: '1',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, #F4FDFF 0%, #9BEAFF 30%, rgba(34,184,196,0.55) 55%, transparent 72%)',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* copy */}
        <div data-hero="copy" className="relative z-10 max-w-6xl mx-auto w-full pt-20 will-change-transform">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="flex items-center gap-3 mb-7"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.3em' }}
          >
            <span className="inline-block w-8 h-px" style={{ background: 'var(--red)' }} />
            <span style={{ color: 'var(--text-3)' }}>{profile.location.toUpperCase()}</span>
          </motion.div>

          <h1
            className="font-black leading-[1.02]"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 8vw, 6.4rem)', color: 'var(--text)' }}
          >
            <RiseWords text="Hi, I'm Hari." delay={0.3} />
          </h1>

          <div
            className="mt-3 md:mt-5 flex flex-wrap items-center gap-x-[0.35em] gap-y-2 font-bold"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem, 4.4vw, 3.3rem)' }}
          >
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
              style={{ color: 'var(--text-3)' }}
            >
              I am a
            </motion.span>
            <motion.span
              initial={{ opacity: 0, rotateX: -70 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
              style={{ transformPerspective: 800 }}
            >
              <RoleTumbler reduce={reduce} />
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.8, ease: EASE }}
            className="mt-8 max-w-xl text-base md:text-lg leading-relaxed font-medium"
            style={{ color: 'var(--text-2)' }}
          >
            {profile.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.7, ease: EASE }}
            className="flex flex-wrap items-center gap-4 mt-10"
          >
            <Magnetic strength={7}>
              <motion.a
                href="#comms"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-[0.16em]"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: 'linear-gradient(135deg, var(--red), var(--red-deep))',
                  color: '#fff',
                  boxShadow: '0 10px 30px -8px rgba(156,32,32,0.55), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                LET'S TALK
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </motion.a>
            </Magnetic>
            <a
              href="#missionlog"
              className="text-sm font-bold tracking-[0.16em] underline-offset-8 hover:underline"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-2)' }}
            >
              SEE MY STORY
            </a>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          data-hero="cue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--text-3)' }}
        >
          <span>SCROLL</span>
          <span className="relative block w-px h-10 overflow-hidden" style={{ background: 'var(--line-strong)' }}>
            {!reduce && (
              <motion.span
                className="absolute left-0 top-0 w-px h-4"
                style={{ background: 'var(--red)' }}
                animate={{ y: [-16, 40] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />
            )}
          </span>
        </motion.div>

      </div>
    </section>
  )
}
