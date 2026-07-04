import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { SectionHeader, Brackets } from './ui.jsx'
import { systems, auxModules } from '../data.js'

const EASE = [0.22, 1, 0.36, 1]

// overall reactor output = mean of every skill level
const allLevels = systems.flatMap((m) => m.skills.map((s) => s.level))
const masterOutput = Math.round(allLevels.reduce((a, b) => a + b, 0) / allLevels.length)

// the hottest module runs in overdrive; the rest report nominal
const avgOf = (m) => m.skills.reduce((a, s) => a + s.level, 0) / m.skills.length
const overdriveModule = systems.reduce((best, m) => (avgOf(m) > avgOf(best) ? m : best), systems[0]).module

/* Count-up readout, fires when scrolled into view. */
function Counter({ to, suffix = '%', delay = 0, inView }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  useEffect(() => {
    if (inView) {
      const ctrl = animate(count, to, { duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] })
      return ctrl.stop
    }
  }, [inView, to, delay, count])
  return (
    <span className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

/* Segmented power-cell meter — discrete HUD cells filling red → gold. */
function CellBar({ level, segs = 20, height = 8, delay = 0, inView }) {
  const reduce = useReducedMotion()
  const filled = Math.round((level / 100) * segs)
  return (
    <div className="flex gap-[3px] w-full" style={{ height }}>
      {Array.from({ length: segs }, (_, i) => {
        const on = i < filled
        const t = i / (segs - 1)
        const color = `color-mix(in srgb, var(--red) ${Math.round(88 - t * 68)}%, var(--gold-soft))`
        const isTip = on && i === filled - 1
        return (
          <motion.span
            key={i}
            className={`flex-1 rounded-[1px] ${isTip && !reduce ? 'cell-tip' : ''}`}
            initial={{ opacity: 0, scaleY: 0.25 }}
            animate={inView ? { opacity: on ? 1 : 0.22, scaleY: 1 } : {}}
            transition={{ duration: 0.3, delay: delay + i * 0.028, ease: EASE }}
            style={{
              background: on ? color : 'rgba(107,74,26, 0.16)',
              boxShadow: isTip ? '0 0 10px rgba(156,32,32, 0.75)' : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

/* Miniature spinning reactor glyph for module headers. */
function ModuleGlyph({ accent = 'var(--red)' }) {
  const reduce = useReducedMotion()
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <circle cx="15" cy="15" r="13" stroke={accent} strokeWidth="1" opacity="0.35" />
      <circle cx="15" cy="15" r="8.5" stroke={accent} strokeWidth="1.4" strokeDasharray="4 3">
        {!reduce && (
          <animateTransform attributeName="transform" type="rotate" from="0 15 15" to="360 15 15" dur="9s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx="15" cy="15" r="3" fill={accent} opacity="0.85" />
    </svg>
  )
}

function StatusChip({ overdrive, inView }) {
  return (
    <motion.span
      animate={inView ? { opacity: [0.45, 1, 0.45] } : {}}
      transition={{ repeat: Infinity, duration: overdrive ? 1.3 : 2.2, ease: 'easeInOut' }}
      className="text-[10px] px-2 py-0.5 rounded tracking-widest font-bold"
      style={
        overdrive
          ? { fontFamily: 'var(--font-mono)', color: 'var(--red)', border: '1px solid rgba(156,32,32, 0.45)', background: 'rgba(156,32,32, 0.07)' }
          : { fontFamily: 'var(--font-mono)', color: '#22C55E', border: '1px solid rgba(34,197,94, 0.3)' }
      }
    >
      {overdrive ? '▲ OVERDRIVE' : 'NOMINAL'}
    </motion.span>
  )
}

function SkillRow({ skill, delay, inView }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-2)' }}>
          {skill.name}
        </span>
        <span className="text-[11px] font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--red)' }}>
          <Counter to={skill.level} delay={delay} inView={inView} />
        </span>
      </div>
      <CellBar level={skill.level} delay={delay} inView={inView} />
    </div>
  )
}

function ModulePanel({ mod, i }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const overdrive = mod.module === overdriveModule
  const draw = Math.round(avgOf(mod))

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (i % 3) * 0.1, ease: EASE }}
      whileHover={{ y: -5 }}
      className="brackets holo panel rounded-lg p-6 md:p-7 flex flex-col"
      style={overdrive ? { borderColor: 'rgba(156,32,32, 0.3)', boxShadow: '0 0 34px rgba(156,32,32, 0.07)' } : {}}
    >
      <Brackets />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ModuleGlyph accent={overdrive ? 'var(--red)' : 'var(--gold-soft)'} />
          <div>
            <div className="text-sm font-black tracking-[0.2em]" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
              {mod.module}
            </div>
            <div className="text-[11px] mt-0.5 tracking-[0.16em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
              {mod.sub.toUpperCase()}
            </div>
          </div>
        </div>
        <StatusChip overdrive={overdrive} inView={isInView} />
      </div>

      <div className="space-y-4 flex-1">
        {mod.skills.map((s, j) => (
          <SkillRow key={s.name} skill={s} delay={0.25 + j * 0.12} inView={isInView} />
        ))}
      </div>

      <div
        className="mt-6 pt-3 flex items-center justify-between text-[10px] tracking-[0.2em]"
        style={{ borderTop: '1px solid var(--line)', fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}
      >
        <span>CELL {String(i + 1).padStart(2, '0')}</span>
        <span>
          DRAW <span style={{ color: overdrive ? 'var(--red)' : 'var(--text-2)' }}>{draw}%</span>
        </span>
      </div>
    </motion.div>
  )
}

/* Master bus meter above the module grid. */
function MasterPower() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
      className="brackets holo panel rounded-lg p-6 md:p-7 mb-8"
      style={{ borderColor: 'rgba(156,32,32, 0.25)' }}
    >
      <Brackets />
      <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
        <div className="md:w-60 flex-shrink-0">
          <div className="text-base font-black tracking-[0.2em]" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
            MASTER POWER
          </div>
          <div className="text-[11px] mt-1 tracking-[0.16em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
            REACTOR BUS — LIVE FEED
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <CellBar level={masterOutput} segs={34} height={16} delay={0.2} inView={isInView} />
          <div
            className="mt-2 flex justify-between text-[9px] tracking-[0.18em]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}
          >
            <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <span
            className="text-3xl md:text-4xl font-black glow-red"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--red)' }}
          >
            <Counter to={masterOutput} delay={0.3} inView={isInView} />
          </span>
          <motion.span
            animate={isInView ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-[10px] px-2.5 py-1 rounded tracking-[0.2em] font-bold"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', border: '1px solid rgba(185,134,15, 0.4)', background: 'rgba(138,90,12, 0.06)' }}
          >
            OUTPUT STABLE
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}

export default function SuitSystems() {
  const auxRef = useRef(null)
  const auxInView = useInView(auxRef, { once: true, margin: '-40px' })

  return (
    <section
      id="systems"
      className="relative py-28 px-6 md:px-10"
      style={{ background: 'linear-gradient(180deg, transparent, rgba(156,32,32, 0.045) 25%, rgba(156,32,32, 0.045) 75%, transparent)' }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader num="03" code="SYSTEMS DIAGNOSTIC" title="Suit Systems" accent="var(--red)" />

        <MasterPower />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((mod, i) => (
            <ModulePanel key={mod.module} mod={mod} i={i} />
          ))}

          {/* aux modules panel */}
          <motion.div
            ref={auxRef}
            initial={{ opacity: 0, y: 30 }}
            animate={auxInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
            whileHover={{ y: -5 }}
            className="brackets holo panel rounded-lg p-6 md:p-7 flex flex-col"
          >
            <Brackets />
            <div className="flex items-center gap-3 mb-1">
              <ModuleGlyph accent="var(--arc)" />
              <div>
                <div className="text-sm font-black tracking-[0.2em]" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                  AUX MODULES
                </div>
                <div className="text-[11px] mt-0.5 tracking-[0.16em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
                  SUPPORT SYSTEMS
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5 flex-1 content-start">
              {auxModules.map((m, j) => (
                <motion.span
                  key={m}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={auxInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.35, delay: 0.3 + j * 0.05, ease: EASE }}
                  whileHover={{ scale: 1.08, y: -2, borderColor: 'var(--red)', color: 'var(--red)' }}
                  className="h-fit text-[11px] px-3 py-1.5 rounded cursor-default"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-2)',
                    border: '1px solid var(--line)',
                    background: 'rgba(107,74,26, 0.03)',
                  }}
                >
                  {m}
                </motion.span>
              ))}
            </div>
            <div
              className="mt-6 pt-3 flex items-center justify-between text-[10px] tracking-[0.2em]"
              style={{ borderTop: '1px solid var(--line)', fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}
            >
              <span>CELL 06</span>
              <span>{auxModules.length} UNITS</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
