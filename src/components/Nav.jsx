import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { navLinks, profile } from '../data.js'

export default function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled((prev) => {
      const next = v > 40
      return prev === next ? prev : next
    })
  })

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-40 px-5 md:px-10"
      style={{
        background: scrolled ? 'rgba(240,225,184, 0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
        {/* monogram */}
        <a href="#top" className="flex items-center gap-3 group">
          <span className="relative flex w-2.5 h-2.5 rounded-full ping" style={{ background: 'var(--arc)', color: 'var(--arc)' }} />
          <span
            className="text-sm font-black tracking-[0.3em] group-hover:text-white transition-colors"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
          >
            {profile.monogram}
          </span>
        </a>

        {/* links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-[11px] tracking-[0.22em] transition-colors hover:text-white group"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}
            >
              {l.label}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: 'var(--arc)' }}
              />
            </a>
          ))}
        </div>

        {/* status */}
        <a
          href="#comms"
          className="text-[10px] px-3 py-1.5 rounded tracking-[0.2em] transition-all hover:scale-105"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--gold)',
            border: '1px solid rgba(185,134,15, 0.35)',
            background: 'rgba(138,90,12, 0.06)',
          }}
        >
          MK-XII ONLINE
        </a>
      </div>
    </motion.nav>
  )
}
