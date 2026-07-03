import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeader, Brackets, Chip, TiltCard } from './ui.jsx'
import { primaryBuilds, garageLab } from '../data.js'

const EASE = [0.22, 1, 0.36, 1]

const catColors = {
  TRADING: 'var(--gold)',
  'AI AGENTS': 'var(--red)',
  AUTONOMY: 'var(--arc)',
}

function SubLabel({ children, accent = 'var(--arc)', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -14 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="flex items-center gap-3 mb-8 text-[11px] tracking-[0.3em]"
      style={{ fontFamily: 'var(--font-mono)', color: accent }}
    >
      <span className="w-6 h-px" style={{ background: accent }} />
      {children}
    </motion.div>
  )
}

function BuildCard({ p, i }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (i % 2) * 0.12, ease: EASE }}
    >
      <TiltCard max={5} className="h-full">
        <div className="brackets holo panel rounded-lg p-7 md:p-8 h-full flex flex-col group">
          <Brackets />

          <div className="flex items-start justify-between mb-5">
            <span
              className="text-4xl font-black leading-none"
              style={{ fontFamily: 'var(--font-display)', color: 'rgba(107,74,26, 0.14)' }}
            >
              {p.index}
            </span>
            <span
              className="text-[10px] px-2.5 py-1 rounded tracking-[0.18em] font-bold"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--arc)',
                border: '1px solid var(--line-strong)',
                background: 'rgba(107,74,26, 0.05)',
              }}
            >
              {p.tag}
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-white transition-colors" style={{ color: 'var(--text)' }}>
            {p.name}
          </h3>

          <div className="text-[11px] mb-4 tracking-[0.14em] font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>
            ▸ {p.metric}
          </div>

          <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--text-2)' }}>
            {p.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {p.stack.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

function LabCard({ p, i }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const accent = catColors[p.cat] || 'var(--arc)'
  const Tag = p.url ? motion.a : motion.div

  return (
    <Tag
      ref={ref}
      {...(p.url ? { href: p.url, target: '_blank', rel: 'noreferrer' } : {})}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (i % 3) * 0.1, ease: EASE }}
      whileHover={{ y: -5 }}
      className="brackets holo panel rounded-lg p-6 flex flex-col group cursor-default"
      style={p.url ? { cursor: 'pointer' } : {}}
    >
      <Brackets />

      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[10px] px-2 py-0.5 rounded tracking-[0.18em] font-bold"
          style={{
            fontFamily: 'var(--font-mono)',
            color: accent,
            border: `1px solid color-mix(in srgb, ${accent} 35%, transparent)`,
            background: `color-mix(in srgb, ${accent} 7%, transparent)`,
          }}
        >
          {p.cat}
        </span>
        {p.url && (
          <span className="opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: accent }}>
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" />
            </svg>
          </span>
        )}
      </div>

      <h4 className="text-base font-bold mb-2 group-hover:text-white transition-colors" style={{ color: 'var(--text)' }}>
        {p.name}
      </h4>
      <p className="text-[13px] leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-2)' }}>
        {p.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {p.stack.map((t) => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)', border: '1px solid var(--line)' }}>
            {t}
          </span>
        ))}
      </div>
    </Tag>
  )
}

export default function Workshop() {
  return (
    <section id="workshop" className="relative py-28 px-6 md:px-10" style={{ background: 'rgba(210,184,121, 0.45)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader num="02" code="WORKSHOP" title="The Builds" accent="var(--arc)" />

        <SubLabel accent="var(--arc)">PRIMARY SYSTEMS — DEPLOYED IN THE FIELD</SubLabel>
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {primaryBuilds.map((p, i) => (
            <BuildCard key={p.index} p={p} i={i} />
          ))}
        </div>

        <SubLabel accent="var(--red)">GARAGE LAB — AFTER-HOURS EXPERIMENTS</SubLabel>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {garageLab.map((p, i) => (
            <LabCard key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
