import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import ArcReactor from './ArcReactor.jsx'
import { bootLines } from '../data.js'

const LINE_DELAY = 260 // ms between boot lines
const HOLD_AFTER = 900 // ms after last line before exit

export default function BootSequence({ onDone }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [leaving, setLeaving] = useState(false)

  // reveal lines one by one, then exit
  useEffect(() => {
    if (visibleLines < bootLines.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), LINE_DELAY)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setLeaving(true), HOLD_AFTER)
    return () => clearTimeout(t)
  }, [visibleLines])

  useEffect(() => {
    if (leaving) {
      const t = setTimeout(onDone, 650)
      return () => clearTimeout(t)
    }
  }, [leaving, onDone])

  const totalMs = bootLines.length * LINE_DELAY + HOLD_AFTER

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
      style={{ background: 'linear-gradient(160deg, var(--dark), var(--dark-2))' }}
      onClick={() => setLeaving(true)}
      animate={leaving ? { opacity: 0, scale: 1.06, filter: 'blur(6px)' } : {}}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="absolute inset-0 hud-grid opacity-60" />
      <div className="absolute inset-0 scanlines opacity-40" />

      {/* reactor spin-up */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotate: -90 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <ArcReactor size={150} core="circle" intensity={0.9} />
      </motion.div>

      {/* boot log */}
      <div
        className="w-[min(560px,88vw)] text-[12px] md:text-[13px] leading-relaxed h-56"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--arc)' }}
      >
        {bootLines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              color:
                i === 0 ? 'var(--gold-bright)'
                : line.includes('READY') ? 'var(--arc-bright)'
                : 'rgba(34,184,196, 0.8)',
            }}
          >
            {line}
          </motion.div>
        ))}
        {visibleLines >= bootLines.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-sm tracking-[0.25em]"
            style={{ color: '#F7ECD0', textShadow: '0 0 18px rgba(232,184,75,0.5), 0 0 42px rgba(34,184,196,0.25)' }}
          >
            WELCOME, COMMANDER PERLA<span className="caret">_</span>
          </motion.div>
        )}
      </div>

      {/* progress bar */}
      <div className="w-[min(560px,88vw)] h-[3px] mt-6 overflow-hidden rounded" style={{ background: 'rgba(232,184,75, 0.18)' }}>
        <motion.div
          className="h-full origin-left"
          style={{ background: 'linear-gradient(90deg, var(--red), var(--gold), var(--arc))' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: totalMs / 1000, ease: 'linear' }}
        />
      </div>

      <div className="mt-5 text-[10px] tracking-[0.3em]" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(214,196,158,0.6)' }}>
        [ CLICK TO SKIP BOOT ]
      </div>
    </motion.div>
  )
}
