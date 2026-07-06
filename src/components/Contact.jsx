import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeader, Brackets, Magnetic } from './ui.jsx'
import ArcReactor from './ArcReactor.jsx'
import { comms, profile } from '../data.js'
import { art } from '../art.js'

const EASE = [0.22, 1, 0.36, 1]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-70px' })

  return (
    <section id="comms" ref={ref} className="relative py-28 px-6 md:px-10 overflow-hidden">
      {/* ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 45% at 50% 100%, rgba(156,32,32, 0.07), transparent 70%)' }}
      />
      <img
        src={art.gauntlet} alt="" aria-hidden="true" loading="lazy"
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{
          right: '-3%', bottom: '-4%', width: 'min(40vw, 560px)',
          opacity: 0.5,
          transform: 'rotate(-6deg)',
          maskImage: 'radial-gradient(ellipse 62% 62% at 52% 48%, black 42%, transparent 74%)',
          WebkitMaskImage: 'radial-gradient(ellipse 62% 62% at 52% 48%, black 42%, transparent 74%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <SectionHeader num="05" code="COMMS" title="Open a Channel" accent="var(--arc)" />

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="max-w-2xl text-base md:text-lg leading-relaxed mb-14 font-medium"
          style={{ color: 'var(--text-2)' }}
        >
          Available for mission briefings — autonomy programs, AI/ML triage systems, and teams
          that move fast. Transmission lines below are monitored.
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-5 mb-24">
          {comms.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.1, ease: EASE }}
            >
              <Magnetic strength={5}>
                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="brackets holo panel rounded-lg p-6 flex items-center justify-between group block"
                >
                  <Brackets />
                  <div>
                    <div className="text-[10px] tracking-[0.3em] mb-2" style={{ fontFamily: 'var(--font-mono)', color: c.accent }}>
                      {'//'} {c.label}
                    </div>
                    <div className="text-base md:text-lg font-bold group-hover:text-white transition-colors" style={{ color: 'var(--text)' }}>
                      {c.value}
                    </div>
                  </div>
                  <motion.span
                    className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                    style={{ border: `1px solid color-mix(in srgb, ${c.accent} 35%, transparent)`, color: c.accent }}
                    whileHover={{ scale: 1.15, rotate: 45 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" />
                    </svg>
                  </motion.span>
                </a>
              </Magnetic>
            </motion.div>
          ))}
        </div>

        {/* footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          <div className="flex items-center gap-3 text-[11px] tracking-[0.2em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
            <div className="w-6 h-6">
              <ArcReactor size={24} core="circle" intensity={0.5} />
            </div>
            <span>© 2026 {profile.name.toUpperCase()} — ALL SYSTEMS NOMINAL</span>
          </div>
          <div className="text-[11px] tracking-[0.2em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
            REACTOR: <span style={{ color: 'var(--arc)' }}>STABLE</span> · BUILT WITH REACT + FRAMER MOTION
          </div>
        </motion.footer>
      </div>
    </section>
  )
}
