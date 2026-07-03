import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeader, Brackets } from './ui.jsx'
import { achievements } from '../data.js'

const EASE = [0.22, 1, 0.36, 1]

function PatentSeal({ inView }) {
  // hexagonal seal with drawing stroke
  const hex = 'M60 6 L106 33 L106 87 L60 114 L14 87 L14 33 Z'
  return (
    <svg viewBox="0 0 120 120" className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 18px rgba(185,134,15, 0.45))' }}>
      <motion.path
        d={hex}
        fill="rgba(138,90,12, 0.06)"
        stroke="var(--gold)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      <motion.path
        d="M60 22 L92 41 L92 79 L60 98 L28 79 L28 41 Z"
        fill="none"
        stroke="rgba(185,134,15, 0.5)"
        strokeWidth="1"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.6, delay: 0.3, ease: 'easeInOut' }}
      />
      <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1, duration: 0.6, ease: EASE }}>
        <text x="60" y="55" textAnchor="middle" fontSize="13" fill="var(--gold)" fontFamily="Audiowide, sans-serif" fontWeight="900">US</text>
        <text x="60" y="72" textAnchor="middle" fontSize="11" fill="var(--gold)" fontFamily="Audiowide, sans-serif" fontWeight="700">PATENT</text>
      </motion.g>
    </svg>
  )
}

export default function Achievements() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-70px' })
  const featured = achievements.find((a) => a.featured)
  const rest = achievements.filter((a) => !a.featured)

  return (
    <section id="armory" ref={ref} className="relative py-28 px-6 md:px-10" style={{ background: 'rgba(210,184,121, 0.45)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader num="04" code="ARMORY" title="Hall of Armor" accent="var(--red)" />

        {/* featured patent */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="brackets holo panel rounded-lg p-8 md:p-10 mb-6 flex flex-col md:flex-row items-center gap-8"
          style={{ borderColor: 'rgba(185,134,15, 0.3)', boxShadow: '0 0 50px rgba(138,90,12, 0.06)' }}
        >
          <Brackets />
          <PatentSeal inView={isInView} />
          <div className="text-center md:text-left">
            <div className="text-[11px] tracking-[0.3em] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>
              {'//'} {featured.kicker}
            </div>
            <h3
              className="text-2xl md:text-4xl font-black mb-2 glow-gold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', letterSpacing: '0.03em' }}
            >
              {featured.title}
            </h3>
            <div className="text-base md:text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>
              {featured.sub}
            </div>
            <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--text-2)' }}>
              {featured.description}
            </p>
          </div>
        </motion.div>

        {/* other achievements */}
        <div className="grid sm:grid-cols-3 gap-5">
          {rest.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.25 + i * 0.12, ease: EASE }}
              whileHover={{ y: -5 }}
              className="brackets panel rounded-lg p-6"
            >
              <Brackets />
              <div className="text-[10px] tracking-[0.28em] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--arc)' }}>
                {'//'} {a.kicker}
              </div>
              <div className="text-lg font-black mb-1.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '0.01em' }}>
                {a.title}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-2)' }}>
                {a.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
