import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeader, Brackets } from './ui.jsx'
import { systems, auxModules } from '../data.js'

const EASE = [0.22, 1, 0.36, 1]

function SkillBar({ skill, delay, inView }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-2)' }}>
          {skill.name}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.9, duration: 0.4 }}
          className="text-[11px] tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--arc)' }}
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(107,74,26, 0.08)' }}>
        <motion.div
          className="h-full origin-left rounded-full"
          style={{
            background: 'linear-gradient(90deg, var(--arc), var(--gold))',
            boxShadow: '0 0 8px rgba(14,124,134, 0.5)',
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: skill.level / 100 } : {}}
          transition={{ duration: 1.1, delay, ease: EASE }}
        />
      </div>
    </div>
  )
}

function ModulePanel({ mod, i }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (i % 3) * 0.1, ease: EASE }}
      className="brackets panel rounded-lg p-6 md:p-7"
    >
      <Brackets />
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm font-black tracking-[0.2em]" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
            {mod.module}
          </div>
          <div className="text-[11px] mt-0.5 tracking-[0.16em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
            {mod.sub.toUpperCase()}
          </div>
        </div>
        <motion.span
          animate={isInView ? { opacity: [0.4, 1, 0.4] } : {}}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="text-[10px] px-2 py-0.5 rounded tracking-widest"
          style={{ fontFamily: 'var(--font-mono)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}
        >
          NOMINAL
        </motion.span>
      </div>
      <div className="space-y-4">
        {mod.skills.map((s, j) => (
          <SkillBar key={s.name} skill={s} delay={0.25 + j * 0.12} inView={isInView} />
        ))}
      </div>
    </motion.div>
  )
}

export default function SuitSystems() {
  const auxRef = useRef(null)
  const auxInView = useInView(auxRef, { once: true, margin: '-40px' })

  return (
    <section id="systems" className="relative py-28 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <SectionHeader num="03" code="SYSTEMS DIAGNOSTIC" title="Suit Systems" accent="var(--gold)" />

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
            className="brackets panel rounded-lg p-6 md:p-7"
          >
            <Brackets />
            <div className="text-sm font-black tracking-[0.2em] mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
              AUX MODULES
            </div>
            <div className="text-[11px] mb-6 tracking-[0.16em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
              SUPPORT SYSTEMS
            </div>
            <div className="flex flex-wrap gap-2">
              {auxModules.map((m, j) => (
                <motion.span
                  key={m}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={auxInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.35, delay: 0.3 + j * 0.05, ease: EASE }}
                  whileHover={{ scale: 1.08, borderColor: 'var(--arc)' }}
                  className="text-[11px] px-3 py-1.5 rounded cursor-default"
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}
