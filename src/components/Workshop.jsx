import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import { SectionHeader, Brackets, Chip } from './ui.jsx'
import { primaryBuilds, garageLab } from '../data.js'
import legoMk3 from '../assets/lego-mk3.jpg'

const EASE = [0.22, 1, 0.36, 1]
const MIRROR = 'translate(400 0) scale(-1 1)'

const accentFor = {
  AUTONOMY: 'var(--arc)',
  'AI/ML': 'var(--red)',
  'AI AGENTS': 'var(--red)',
  'DATA PLATFORM': 'var(--gold-soft)',
  ANALYTICS: 'var(--gold-soft)',
  TRADING: 'var(--gold-soft)',
  'PHYSICAL BUILD': 'var(--gold-soft)',
}

/* The one build that exists in atoms, not bits — LEGO Iron Man MK3 (76206),
   hand-assembled. Reference model for this very schematic. */
const legoBuild = {
  name: 'LEGO Iron Man MK3',
  tag: 'PHYSICAL BUILD',
  metric: 'HAND-ASSEMBLED · SET 76206',
  description:
    'The workshop’s physical centerpiece — a brick-built Iron Man MK3 figure, minifig pilot included. It stands guard over the desk where everything else on this page was built, and it’s the reference model for this schematic.',
  stack: ['LEGO Marvel', 'Patience', 'Zero Bugs'],
  image: legoMk3,
}

/* Each armor component mounts one build. node = hotspot position in the
   400×760 schematic viewBox; side decides which edge the callout runs to. */
const armory = [
  { part: 'helmet',    code: 'NEURAL HUD',   sys: 'CRANIAL ARRAY — ONBOARD INTELLIGENCE',  node: [200, 44],  side: 'r', build: primaryBuilds[1] },
  { part: 'reactor',   code: 'ARC CORE',     sys: 'PRIMARY POWER PLANT — FLAGSHIP SYSTEM', node: [200, 186], side: 'r', build: primaryBuilds[0] },
  { part: 'shoulderL', code: 'COMMS ARRAY',  sys: 'LEFT PAULDRON — EXECUTIVE UPLINK',      node: [116, 172], side: 'l', build: primaryBuilds[3] },
  { part: 'shoulderR', code: 'FLEET UPLINK', sys: 'RIGHT PAULDRON — FLEET TELEMETRY',      node: [284, 172], side: 'r', build: primaryBuilds[2] },
  { part: 'gauntletL', code: 'REPULSOR·L',   sys: 'LEFT GAUNTLET — LIVE-FIRE EXECUTION',   node: [92, 370],  side: 'l', build: garageLab[0] },
  { part: 'gauntletR', code: 'REPULSOR·R',   sys: 'RIGHT GAUNTLET — TARGETING COMPUTER',   node: [308, 370], side: 'r', build: garageLab[2] },
  { part: 'chassis',   code: 'CHASSIS',      sys: 'PELVIC FRAME — BRICK-BUILT ORIGINAL',   node: [200, 340], side: 'l', build: legoBuild },
  { part: 'thighL',    code: 'SIM SERVO',    sys: 'LEFT THIGH ACTUATOR — SIMULATION CORE', node: [176, 404], side: 'l', build: garageLab[1] },
  { part: 'thighR',    code: 'OPS SERVO',    sys: 'RIGHT THIGH ACTUATOR — AUTONOMOUS OPS', node: [224, 404], side: 'r', build: garageLab[3] },
  { part: 'bootL',     code: 'STABILIZER',   sys: 'LEFT BOOT — SENSOR STABILIZATION',      node: [164, 636], side: 'l', build: garageLab[4] },
  { part: 'bootR',     code: 'THRUSTER',     sys: 'RIGHT BOOT — PROPULSION RESEARCH',      node: [236, 636], side: 'r', build: garageLab[5] },
].map((a) => ({ ...a, accent: accentFor[a.build.tag || a.build.cat] || 'var(--arc)' }))

/* Armor plates per component, drawn for the viewer-left side (or center)
   and mirrored for right-hand parts. tone picks the alloy tint. */
const PLATES = {
  helmet: [
    { d: 'M200 36 L 186 38 L 176 46 L 172 60 L 172 82 L 176 98 L 184 110 L 192 116 L 200 118 L 208 116 L 216 110 L 224 98 L 228 82 L 228 60 L 224 46 L 214 38 Z', tone: 'red' },
    { d: 'M186 52 L 214 52 L 220 60 L 220 74 L 216 80 L 218 88 L 212 104 L 204 112 L 196 112 L 188 104 L 182 88 L 184 80 L 180 74 L 180 60 Z', tone: 'gold' },
  ],
  reactor: [
    { d: 'M200 136 L 156 142 L 132 164 L 136 208 L 164 238 L 200 246 L 236 238 L 264 208 L 268 164 L 244 142 Z', tone: 'red' },
  ],
  shoulderL: [
    { d: 'M154 140 L 116 144 L 96 166 L 98 194 L 122 202 L 152 178 Z', tone: 'red' },
    { d: 'M98 202 L 90 252 L 116 260 L 128 210 Z', tone: 'gold' },
  ],
  gauntletL: [
    { d: 'M96 256 L 112 258 L 116 272 L 106 280 L 92 276 L 88 262 Z', tone: 'gold' },
    { d: 'M86 284 L 80 338 L 108 344 L 116 288 Z', tone: 'gold' },
    { d: 'M78 348 L 74 386 C 73 397 81 404 92 401 L 106 395 L 110 350 Z', tone: 'red' },
  ],
  chassis: [
    { d: 'M168 316 L 232 316 L 240 344 L 214 360 L 200 368 L 186 360 L 160 344 Z', tone: 'red' },
  ],
  thighL: [
    { d: 'M166 352 L 156 452 L 190 458 L 198 366 L 190 354 Z', tone: 'gold' },
    { d: 'M156 464 L 190 468 L 186 492 L 160 488 Z', tone: 'red' },
  ],
  bootL: [
    { d: 'M158 496 L 154 592 L 180 596 L 188 500 Z', tone: 'red' },
    { d: 'M152 598 L 148 640 L 130 662 C 122 672 128 682 140 682 L 180 682 L 186 650 L 184 602 Z', tone: 'red' },
  ],
}
PLATES.shoulderR = PLATES.shoulderL
PLATES.gauntletR = PLATES.gauntletL
PLATES.thighR = PLATES.thighL
PLATES.bootR = PLATES.bootL

/* Non-interactive connective armor: neck, abdominal bands, pelvis. */
const decorPlates = [
  { d: 'M189 116 L 211 116 L 209 132 L 191 132 Z', tone: 'dark' },
  { d: 'M168 250 L 232 250 L 229 268 L 171 268 Z', tone: 'red' },
  { d: 'M171 272 L 229 272 L 227 290 L 173 290 Z', tone: 'red' },
  { d: 'M173 294 L 227 294 L 225 312 L 175 312 Z', tone: 'red' },
]

const plateFills = {
  red: ['rgba(156,32,32,0.10)', 'rgba(156,32,32,0.18)', 'rgba(156,32,32,0.26)'],
  gold: ['rgba(185,134,15,0.12)', 'rgba(185,134,15,0.20)', 'rgba(185,134,15,0.28)'],
  dark: ['rgba(43,27,12,0.08)', 'rgba(43,27,12,0.12)', 'rgba(43,27,12,0.16)'],
}

function plateProps(tone, state, accent) {
  const idx = state === 'active' ? 2 : state === 'hover' ? 1 : 0
  return {
    fill: plateFills[tone][idx],
    stroke: state === 'active' ? accent : state === 'hover' ? 'rgba(107,74,26, 0.9)' : 'rgba(107,74,26, 0.55)',
    strokeWidth: state === 'active' ? 2.2 : 1.4,
    strokeLinejoin: 'round',
    style: { transition: 'fill 0.25s, stroke 0.25s' },
  }
}

/* One clickable armor component: its plates + hotspot node + callout. */
function ArmorPart({ entry, index, state, onSelect, onHover }) {
  const { part, code, node, side, accent } = entry
  const [nx, ny] = node
  const mirrored = side === 'r' && part !== 'helmet' && part !== 'reactor'
  const active = state === 'active'
  const labelLeft = side === 'l'

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${code} — ${entry.build.name}`}
      onClick={() => onSelect(index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(index) }
      }}
      onPointerEnter={() => onHover(index)}
      onPointerLeave={() => onHover(null)}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <g transform={mirrored ? MIRROR : undefined}>
        {PLATES[part].map((p, i) => (
          <path key={i} d={p.d} {...plateProps(p.tone, state, accent)} />
        ))}
      </g>

      {/* callout leader line — active part only */}
      {active && (
        <g pointerEvents="none">
          <line
            x1={labelLeft ? nx - 14 : nx + 14} y1={ny}
            x2={labelLeft ? 16 : 384} y2={ny}
            stroke={accent} strokeWidth="1" strokeDasharray="4 4" opacity="0.75"
          />
          <circle cx={labelLeft ? 16 : 384} cy={ny} r="2.5" fill={accent} />
          <text
            x={labelLeft ? 16 : 384} y={ny - 7}
            textAnchor={labelLeft ? 'start' : 'end'}
            fontSize="11" fontFamily="Space Mono, monospace" fontWeight="700"
            fill={accent} letterSpacing="2"
          >
            {code}
          </text>
        </g>
      )}

      {/* hotspot node */}
      <g>
        <circle cx={nx} cy={ny} r="20" fill="transparent" />
        {active ? (
          <g pointerEvents="none">
            <circle cx={nx} cy={ny} r="13" fill="none" stroke={accent} strokeWidth="1.2" strokeDasharray="5 5">
              <animateTransform attributeName="transform" type="rotate" from={`0 ${nx} ${ny}`} to={`360 ${nx} ${ny}`} dur="7s" repeatCount="indefinite" />
            </circle>
            <circle cx={nx} cy={ny} r="13" fill="none" stroke={accent} strokeWidth="1" opacity="0.6">
              <animate attributeName="r" values="13;24" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </g>
        ) : (
          <circle cx={nx} cy={ny} r="9" fill="none" stroke="rgba(107,74,26, 0.5)" strokeWidth="1" pointerEvents="none" style={{ transition: 'stroke 0.25s' }} />
        )}
        <circle
          cx={nx} cy={ny} r="4.5" pointerEvents="none"
          fill={active ? accent : 'rgba(29,20,9, 0.85)'}
          stroke={active ? accent : state === 'hover' ? 'var(--gold-soft)' : 'rgba(107,74,26, 0.7)'}
          strokeWidth="1.5"
          style={{ transition: 'fill 0.25s, stroke 0.25s' }}
        />
      </g>

      {/* hover label chip */}
      {state === 'hover' && (
        <g pointerEvents="none">
          <rect
            x={labelLeft ? nx + 16 : nx - 16 - (code.length * 7.4 + 14)}
            y={ny - 10} height="20" rx="3"
            width={code.length * 7.4 + 14}
            fill="rgba(29,20,9, 0.92)" stroke="rgba(185,134,15, 0.5)" strokeWidth="1"
          />
          <text
            x={labelLeft ? nx + 23 : nx - 23} y={ny + 4}
            textAnchor={labelLeft ? 'start' : 'end'}
            fontSize="11" fontFamily="Space Mono, monospace" fontWeight="700"
            fill="var(--gold-bright)" letterSpacing="1.5"
          >
            {code}
          </text>
        </g>
      )}
    </g>
  )
}

/* Full-body MK-XII blueprint. Click a component to mount its build. */
function SuitSchematic({ selected, onSelect }) {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(null)
  const activePart = armory[selected].part
  const accent = armory[selected].accent

  return (
    <svg
      viewBox="0 0 400 760" width="100%" role="group"
      aria-label="MK-XII armor schematic — select a component to inspect its build"
    >
      <defs>
        <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(34,184,196,0)" />
          <stop offset="50%" stopColor="rgba(34,184,196,0.28)" />
          <stop offset="100%" stopColor="rgba(34,184,196,0)" />
        </linearGradient>
        <radialGradient id="suitGlow">
          <stop offset="0%" stopColor="rgba(185,134,15,0.14)" />
          <stop offset="70%" stopColor="rgba(185,134,15,0.04)" />
          <stop offset="100%" stopColor="rgba(185,134,15,0)" />
        </radialGradient>
      </defs>

      {/* ambient backing + orbit rings */}
      <circle cx="200" cy="380" r="230" fill="url(#suitGlow)" />
      <circle cx="200" cy="380" r="215" fill="none" stroke="rgba(107,74,26, 0.14)" strokeWidth="1" strokeDasharray="2 8" />
      <circle cx="200" cy="380" r="188" fill="none" stroke="rgba(14,124,134, 0.12)" strokeWidth="1" />

      {/* blueprint furniture: corner marks, dimension line, title block */}
      <g stroke="rgba(107,74,26, 0.4)" strokeWidth="1">
        <path d="M58 16 L 58 28 M52 22 L 64 22" />
        <path d="M342 16 L 342 28 M336 22 L 348 22" />
      </g>
      <g stroke="rgba(107,74,26, 0.35)" strokeWidth="1">
        <line x1="34" y1="28" x2="34" y2="690" />
        <path d="M30 34 L 34 28 L 38 34 M30 684 L 34 690 L 38 684" fill="none" />
      </g>
      <text x="27" y="380" fontSize="9" fontFamily="Space Mono, monospace" fill="rgba(110,84,50, 0.75)" letterSpacing="3" transform="rotate(-90 27 380)" textAnchor="middle">
        MK-XII — H 78.0 IN
      </text>
      <g fontFamily="Space Mono, monospace" fill="rgba(110,84,50, 0.85)">
        <rect x="256" y="700" width="136" height="52" fill="none" stroke="rgba(107,74,26, 0.4)" strokeWidth="1" />
        <line x1="256" y1="717" x2="392" y2="717" stroke="rgba(107,74,26, 0.3)" strokeWidth="1" />
        <text x="264" y="712" fontSize="9" letterSpacing="2" fontWeight="700">MK-XII ARMOR</text>
        <text x="264" y="731" fontSize="8" letterSpacing="1">SCHEMATIC · REV 12</text>
        <text x="264" y="744" fontSize="8" letterSpacing="1">SCALE 1:8 · H.C.P.</text>
      </g>

      {/* connective armor (non-interactive) */}
      {decorPlates.map((p, i) => (
        <path key={i} d={p.d} {...plateProps(p.tone, 'base', accent)} opacity="0.8" />
      ))}

      {/* chest detail lines */}
      <path d="M162 150 L 238 150 M144 198 L 170 226 M256 198 L 230 226" stroke="rgba(107,74,26, 0.35)" strokeWidth="1" fill="none" />

      {/* interactive components */}
      {armory.map((entry, i) => (
        <ArmorPart
          key={entry.part}
          entry={entry}
          index={i}
          state={i === selected ? 'active' : i === hovered ? 'hover' : 'base'}
          onSelect={onSelect}
          onHover={setHovered}
        />
      ))}

      {/* ── always-on suit lights ─────────────────────────────── */}
      {/* eyes — brighten when the helmet system is mounted */}
      <g pointerEvents="none">
        <path d="M181 63 L 196 63 L 195 70 L 182 70 Z" fill="var(--arc-bright)" opacity={activePart === 'helmet' ? 1 : 0.6}>
          {activePart === 'helmet' && <animate attributeName="opacity" values="1;0.55;1" dur="2.4s" repeatCount="indefinite" />}
        </path>
        <path d="M219 63 L 204 63 L 205 70 L 218 70 Z" fill="var(--arc-bright)" opacity={activePart === 'helmet' ? 1 : 0.6}>
          {activePart === 'helmet' && <animate attributeName="opacity" values="1;0.55;1" dur="2.4s" repeatCount="indefinite" />}
        </path>
        {/* brow ridge, faceplate seams, mouth slit */}
        <path
          d="M180 60 L 190 55 L 200 56 L 210 55 L 220 60 M186 78 L 186 96 L 194 106 M214 78 L 214 96 L 206 106"
          stroke="rgba(107,74,26, 0.55)" strokeWidth="1.2" fill="none" strokeLinejoin="round"
        />
      </g>

      {/* arc reactor — spins up when the core is mounted */}
      <g pointerEvents="none">
        <circle cx="200" cy="186" r="24" fill="none" stroke="rgba(185,134,15, 0.7)" strokeWidth="1.6" />
        <circle cx="200" cy="186" r="16" fill="none" stroke="var(--arc)" strokeWidth="1.2" strokeDasharray="7 4">
          {!reduce && (
            <animateTransform attributeName="transform" type="rotate" from="0 200 186" to="360 200 186" dur={activePart === 'reactor' ? '3s' : '10s'} repeatCount="indefinite" />
          )}
        </circle>
        <circle cx="200" cy="186" r="8" fill="var(--arc-bright)" opacity="0.9">
          {!reduce && <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.2s" repeatCount="indefinite" />}
        </circle>
        {activePart === 'reactor' && (
          <circle cx="200" cy="186" r="24" fill="none" stroke="var(--arc-bright)" strokeWidth="1" opacity="0.6">
            <animate attributeName="r" values="24;40" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}
      </g>

      {/* repulsor palms — fire when a gauntlet is mounted */}
      {[['gauntletL', 90, 394], ['gauntletR', 310, 394]].map(([part, cx, cy]) => (
        <g key={part} pointerEvents="none">
          <circle cx={cx} cy={cy} r="6" fill={activePart === part ? 'var(--arc-bright)' : 'none'} stroke="var(--arc)" strokeWidth="1.2" opacity={activePart === part ? 1 : 0.6} style={{ transition: 'opacity 0.25s' }} />
          {activePart === part && (
            <circle cx={cx} cy={cy} r="6" fill="none" stroke="var(--arc-bright)" strokeWidth="1.4">
              <animate attributeName="r" values="6;20" dur="1.1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="1.1s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}

      {/* boot thrusters — ignite when a boot is mounted */}
      {[['bootL', 158], ['bootR', 242]].map(([part, cx]) => (
        activePart === part && (
          <g key={part} pointerEvents="none">
            <path d={`M${cx - 12} 688 L ${cx} 730 L ${cx + 12} 688 Z`} fill="rgba(34,184,196, 0.4)">
              <animate attributeName="opacity" values="1;0.4;1" dur="0.5s" repeatCount="indefinite" />
            </path>
            <path d={`M${cx - 6} 688 L ${cx} 712 L ${cx + 6} 688 Z`} fill="var(--arc-bright)">
              <animate attributeName="opacity" values="0.9;0.5;0.9" dur="0.34s" repeatCount="indefinite" />
            </path>
          </g>
        )
      ))}

      {/* scan sweep */}
      {!reduce && (
        <motion.rect
          x="68" width="264" height="30" fill="url(#scanGrad)" pointerEvents="none"
          animate={{ y: [16, 664, 16] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </svg>
  )
}

/* HUD readout for the mounted build. */
function BuildReadout({ entry, index, total }) {
  const { build: p, code, sys, accent } = entry
  const tag = p.tag || p.cat

  return (
    <motion.div
      key={code}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="flex flex-wrap items-center gap-2.5 mb-5">
        <span
          className="text-[10px] md:text-[11px] px-2.5 py-1 rounded tracking-[0.2em] font-bold"
          style={{ fontFamily: 'var(--font-mono)', color: accent, border: `1px solid color-mix(in srgb, ${accent} 40%, transparent)`, background: `color-mix(in srgb, ${accent} 7%, transparent)` }}
        >
          ◈ {code}
        </span>
        <span
          className="text-[10px] md:text-[11px] px-2.5 py-1 rounded tracking-[0.2em] font-bold"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)', border: '1px solid var(--line)' }}
        >
          {tag}
        </span>
        <span className="ml-auto text-[11px] tracking-[0.2em] tabular-nums" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
          {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="text-[10px] md:text-[11px] mb-3 tracking-[0.22em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
        MOUNT POINT: {sys}
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2" style={{ color: 'var(--text)' }}>
            {p.name}
          </h3>

          {p.metric && (
            <div className="text-[11px] md:text-xs mb-4 tracking-[0.14em] font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>
              ▸ {p.metric}
            </div>
          )}

          <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: 'var(--text-2)' }}>
            {p.description}
          </p>

          {p.points && (
            <ul className="space-y-2.5 mb-6 -mt-2">
              {p.points.map((pt, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.08, ease: EASE }}
                  className="flex gap-2.5 text-sm md:text-[15px] leading-relaxed"
                  style={{ color: 'var(--text-2)' }}
                >
                  <span className="mt-[8px] flex-shrink-0 w-1.5 h-1.5 rotate-45" style={{ background: 'var(--red)' }} />
                  {pt}
                </motion.li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-2 mb-1">
            {p.stack.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>

          {p.url && (
            <a
              href={p.url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded text-[11px] md:text-xs tracking-[0.18em] font-bold border transition-colors hover:text-white"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--arc)', borderColor: 'var(--line-strong)', background: 'rgba(107,74,26, 0.04)' }}
            >
              ACCESS REPOSITORY
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" />
              </svg>
            </a>
          )}
        </div>

        {p.image && (
          <div className="w-[min(70vw,200px)] mx-auto sm:mx-0 sm:w-[170px] md:w-[200px] flex-shrink-0">
            <div className="brackets relative rounded overflow-hidden" style={{ border: '1px solid var(--line-strong)' }}>
              <Brackets />
              <img src={p.image} alt={p.name} className="w-full h-auto block" />
              <div className="scanlines absolute inset-0 pointer-events-none opacity-50" />
            </div>
            <div className="mt-2 text-center text-[9px] tracking-[0.22em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
              FIELD UNIT — WORKSHOP FLOOR
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Workshop() {
  const [selected, setSelected] = useState(1) // boot with the ARC CORE mounted
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const entry = armory[selected]

  const step = (dir) => setSelected((s) => (s + dir + armory.length) % armory.length)
  const btn =
    'px-4 py-2 rounded text-xs tracking-[0.2em] transition-colors border cursor-pointer'

  return (
    <section id="workshop" className="relative py-28 px-6 md:px-10" style={{ background: 'rgba(210,184,121, 0.45)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader num="02" code="WORKSHOP" title="The Builds" accent="var(--arc)" />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="grid lg:grid-cols-[minmax(300px,420px)_1fr] gap-10 lg:gap-14 items-start"
        >
          {/* armor schematic */}
          <div className="lg:sticky lg:top-20 mx-auto w-[min(86vw,360px)] lg:w-full">
            <SuitSchematic selected={selected} onSelect={setSelected} />
            <div className="mt-3 text-center text-[11px] tracking-[0.3em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
              [ TAP A COMPONENT TO INSPECT ]
            </div>
          </div>

          {/* readout + component index */}
          <div className="w-full min-w-0">
            <div
              className="brackets holo panel rounded-lg p-6 md:p-8 mb-6 min-h-[380px] flex flex-col"
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') step(1)
                if (e.key === 'ArrowLeft') step(-1)
              }}
            >
              <Brackets />
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <BuildReadout key={selected} entry={entry} index={selected} total={armory.length} />
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3 mt-7 pt-5" style={{ borderTop: '1px solid var(--line)', fontFamily: 'var(--font-mono)' }}>
                <button onClick={() => step(-1)} className={btn} style={{ color: 'var(--arc)', borderColor: 'var(--line-strong)', background: 'rgba(107,74,26, 0.04)' }}>
                  ◀ PREV
                </button>
                <button onClick={() => step(1)} className={btn} style={{ color: 'var(--arc)', borderColor: 'var(--line-strong)', background: 'rgba(107,74,26, 0.04)' }}>
                  NEXT ▶
                </button>
                <span className="ml-auto hidden sm:flex items-center gap-2 text-[10px] tracking-[0.22em]" style={{ color: 'var(--text-3)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--arc)', boxShadow: '0 0 6px var(--arc)' }} />
                  SYS.CHECK: ONLINE
                </span>
              </div>
            </div>

            {/* component index — every mounted system at a glance */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
              {armory.map((a, i) => (
                <button
                  key={a.part}
                  onClick={() => setSelected(i)}
                  className="text-left px-3 py-2.5 rounded border transition-colors cursor-pointer"
                  style={{
                    borderColor: i === selected ? `color-mix(in srgb, ${a.accent} 55%, transparent)` : 'var(--line)',
                    background: i === selected ? `color-mix(in srgb, ${a.accent} 8%, transparent)` : 'rgba(107,74,26, 0.03)',
                  }}
                >
                  <div className="text-[9px] mb-1 tracking-[0.18em] font-bold" style={{ fontFamily: 'var(--font-mono)', color: i === selected ? a.accent : 'var(--text-3)' }}>
                    {a.code}
                  </div>
                  <div className="text-[11px] font-semibold leading-tight truncate" style={{ color: i === selected ? 'var(--text)' : 'var(--text-2)' }}>
                    {a.build.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
