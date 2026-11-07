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

/* The Higgsfield-animated reveal: helmet eyes flash, faceplate splits apart,
   Hari grins out. Plays once when the boot overlay clears; hover or tap to
   suit up again. Reduced motion shows the final face as a still. */
function MaskReveal({ play, reduce }) {
  const vid = useRef(null)
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    const v = vid.current
    if (!v || reduce || !play) return
    const t = setTimeout(() => { v.currentTime = 0; v.play().catch(() => setEnded(true)) }, 650)
    return () => clearTimeout(t)
  }, [play, reduce])

  const replay = () => {
    const v = vid.current
    if (!v || reduce || !ended) return
    setEnded(false)
    v.currentTime = 0
    v.play().catch(() => setEnded(true))
  }

  const size = 'clamp(220px, min(62vw, 56vh), 580px)'
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
      className="relative mask-reveal"
      style={{ width: size, height: size }}
      onMouseEnter={replay}
      onClick={replay}
    >
      {reduce ? (
        <img src={art.maskRevealEnd} alt="Illustrated portrait of Hari" className="mask-reveal-media" />
      ) : (
        <video
          ref={vid}
          className="mask-reveal-media"
          src={art.maskReveal}
          poster={art.maskRevealStart}
          muted
          playsInline
          preload="auto"
          onEnded={() => setEnded(true)}
          aria-label="Animated helmet opening to reveal an illustrated portrait of Hari"
        />
      )}
      {!reduce && (
        <motion.span
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.28em', color: 'var(--text-3)' }}
          animate={{ opacity: ended ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          HOVER TO SUIT UP AGAIN
        </motion.span>
      )}
    </motion.div>
  )
}

export default function Hero({ booted = true }) {
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

  /* Scroll-scrubbed exit: copy blurs away, the helmet portrait tilts back and
     recedes, then the next section rises. Driven by GSAP ScrollTrigger. */
  useLayoutEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: runway.current, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
      })
      tl.to('[data-hero="copy"]', { yPercent: -16, opacity: 0, filter: 'blur(8px)', duration: 0.5 }, 0)
        .to('[data-hero="cue"]', { opacity: 0, duration: 0.1 }, 0)
        .to('[data-hero="art"]', { yPercent: -10, scale: 0.82, rotateY: -14, opacity: 0, duration: 0.8, ease: 'power2.in' }, 0.1)
    }, stage)
    return () => ctx.revert()
  }, [reduce])

  return (
    <section id="top" ref={runway} className="relative" style={{ height: reduce ? 'auto' : '170vh' }}>
      <div
        ref={stage}
        onMouseMove={onMouseMove}
        className="sticky top-0 h-screen min-h-[600px] flex items-center overflow-hidden px-6 md:px-10"
      >
        {/* copy */}
        <div className="relative z-10 max-w-6xl mx-auto w-full pt-20 md:pt-16 flex flex-col-reverse md:flex-row md:items-center gap-10">
        <div data-hero="copy" className="flex-1 min-w-0 will-change-transform">
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
            className="mt-3 md:mt-5 flex flex-wrap md:flex-nowrap items-center gap-x-[0.35em] gap-y-2 font-bold"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2.1vw, 2.2rem)' }}
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

        <div data-hero="art" className="shrink-0 self-center will-change-transform" style={{ transformPerspective: 1000 }}>
          <motion.div style={{ x: smx, y: smy }}>
            <MaskReveal play={booted} reduce={reduce} />
          </motion.div>
        </div>
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
