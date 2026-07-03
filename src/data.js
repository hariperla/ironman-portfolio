// ─── Single source of truth for all site content ───────────────────────────
// Edit this file to update the site — components render from here.

export const profile = {
  name: 'Hari Charan Perla',
  firstName: 'HARI CHARAN',
  lastName: 'PERLA',
  monogram: 'H.C.P.',
  title: 'Triage Manager — Autonomy',
  company: 'Rivian',
  location: 'Palo Alto, CA',
  email: 'perlaharicharan@gmail.com',
  phone: '309-621-3571',
  phoneHref: 'tel:3096213571',
  github: 'https://github.com/hariperla',
  linkedin: 'https://www.linkedin.com/in/hari-perla-68561528/',
  summary:
    'Twelve years of automotive controls and software/systems engineering across autonomous driving, performance evaluation, data platforms, and large-scale vehicle software programs. I build the pipelines that find the failure before the driver does.',
  roles: [
    'AUTONOMY TRIAGE COMMANDER',
    'AI/ML PIPELINE ARCHITECT',
    'ROOT-CAUSE HUNTER',
    'EV & AUTONOMY ENTHUSIAST',
  ],
}

export const stats = [
  { value: 12, suffix: '+', label: 'Years in the Build', sub: 'Automotive · Autonomy · AI', color: 'var(--arc)' },
  { value: 85, suffix: '%', label: 'Manual Triage Automated', sub: 'TP/FP classification pipelines', color: 'var(--gold)' },
  { value: 80, suffix: '%', label: 'Backlog Eliminated', sub: 'End-to-end triage ownership', color: 'var(--red)' },
  { value: 40, suffix: '%', label: 'Faster Resolution', sub: 'Automated triage workflows', color: 'var(--arc)' },
]

export const marks = [
  {
    mark: 'MK-I',
    quote: 'The first build. Heavy metal.',
    company: 'Caterpillar',
    role: 'System Software Engineer',
    period: '2012 — 2014',
    bullets: [
      'Designed Stateflow models for sensor calibration logic on heavy-equipment platforms.',
      'Performed HIL testing and validation across multiple machine programs.',
    ],
    tags: ['Stateflow', 'HIL Testing', 'Systems'],
    current: false,
  },
  {
    mark: 'MK-II',
    quote: 'Flight-stable. Patented.',
    company: 'General Motors',
    role: 'Powertrain Controls Software Engineer',
    period: '2014 — 2019',
    bullets: [
      'Principal engineer for CVT control algorithms across the full SDLC — design, calibration, validation, release.',
      'Invented the patented ratio-drift control algorithm for cold launches and emergency braking (US 10,690,245 B2).',
      'Built MATLAB and C++ tooling to evaluate large-scale validation datasets.',
    ],
    tags: ['MATLAB', 'C++', 'Controls', 'US Patent'],
    current: false,
  },
  {
    mark: 'MK-III',
    quote: 'Eyes on the road. Combat-ready autonomy.',
    company: 'General Motors',
    role: 'Lead Performance Engineer — Lane Localization',
    period: '2020 — 2022',
    bullets: [
      'Led lane-localization performance tuning for Super Cruise (L2+) and Ultra Cruise (L3).',
      'Defined localization metrics and evaluation criteria across road geometries, weather, and traffic.',
      'Built Python analytics to process raw vehicle logs and compare performance across releases.',
    ],
    tags: ['Super Cruise', 'Ultra Cruise', 'Python', 'Metrics'],
    current: false,
  },
  {
    mark: 'MK-XII',
    quote: 'Current armor. Fully armed and operational.',
    company: 'Rivian',
    role: 'Triage Manager — Autonomy',
    period: '2022 — PRESENT',
    bullets: [
      'Lead a team of 5+ engineers triaging high-impact autonomy issues across AEB, ACC/HWA, PAW, RCTW, and BSW — on-road and simulation.',
      'Built automated triage workflows cutting issue-resolution time 40% and backlog 80%.',
      'Shipped TP/FP classification automation for perception and planner events — 85–90% less manual triage at ~70–80 events/day/person.',
      'Authored PRD + POC for DistilBERT-based NLP routing of JIRA autonomy issues.',
      'Delivered executive dashboards on safety KPIs: phantom braking, FP AEB, lane departures, disengagements per 1k miles.',
    ],
    tags: ['Python', 'DistilBERT', 'Databricks', 'MongoDB', 'Leadership'],
    current: true,
  },
]

export const primaryBuilds = [
  {
    index: '01',
    name: 'AEB TP/FP Triage Automation',
    tag: 'AUTONOMY',
    metric: '−85–90% MANUAL LOAD',
    description:
      'Production Python pipeline classifying true/false positives for perception and planner events. Processes what once took a team of humans ~70–80 events/day/person each — automatically.',
    stack: ['Python', 'SciKit-Learn', 'Pandas', 'REST APIs'],
  },
  {
    index: '02',
    name: 'NLP JIRA Issue Routing',
    tag: 'AI/ML',
    metric: 'HIGH-ACCURACY ROUTING',
    description:
      'PRD and POC for automated autonomy-feature assignment in JIRA using a DistilBERT model. Issues route themselves to the right owner before an engineer touches them.',
    stack: ['Python', 'DistilBERT', 'SciKit-Learn', 'Tkinter'],
  },
  {
    index: '03',
    name: 'Weekend Drive Portal',
    tag: 'DATA PLATFORM',
    metric: 'FLEET-SCALE ANALYTICS',
    description:
      'Fleet assignment and management portal integrated with MongoDB and Databricks — scalable analytics on utilization, coverage, and AV performance for weekend drive programs.',
    stack: ['MongoDB', 'Databricks', 'Python', 'REST APIs'],
  },
  {
    index: '04',
    name: 'Executive Safety KPI Dashboards',
    tag: 'ANALYTICS',
    metric: 'DECISION-GRADE SIGNAL',
    description:
      'On-road performance and safety KPIs for leadership: phantom braking / 1k mi, FP AEB / 1k mi, lane departures, DTO, disengagements, and LCoC acceptance rates.',
    stack: ['Databricks', 'Tableau', 'Streamlit', 'SQL'],
  },
]

export const garageLab = [
  {
    name: 'Options Arena Auto-Trader',
    cat: 'TRADING',
    description: 'Telegram signal → live options execution via Robinhood MCP, with staged rollout and risk guards.',
    stack: ['Python', 'MCP', 'Telegram API'],
    url: null,
  },
  {
    name: '$100K Options Backtest Engine',
    cat: 'TRADING',
    description: 'Backtests the arena strategy against real historical options-chain data before a dollar goes live.',
    stack: ['Python', 'Pandas', 'Market Data APIs'],
    url: null,
  },
  {
    name: 'Smart Trading Signal Bot',
    cat: 'TRADING',
    description: 'Smart-money structure engine — BOS/CHoCH detection, CVD, multi-timeframe analysis, options strategies.',
    stack: ['Python', 'TradingView'],
    url: 'https://github.com/hariperla/Smart_Trading_Signal_Bot',
  },
  {
    name: 'career-ops AI Pipeline',
    cat: 'AI AGENTS',
    description: 'AI-powered job-search system on Claude Code — offer scoring, CV generation, portal scanning, batch agents.',
    stack: ['Node.js', 'Claude Code', 'Playwright'],
    url: 'https://github.com/hariperla/career-ops',
  },
  {
    name: 'Sensor Fusion Suite',
    cat: 'AUTONOMY',
    description: 'Lidar obstacle detection, radar target generation, unscented Kalman filter, 3D object tracking.',
    stack: ['C++', 'PCL', 'OpenCV'],
    url: 'https://github.com/hariperla/SFND_Lidar_Obstacle_Detection',
  },
  {
    name: 'Self-Driving Car Projects',
    cat: 'AUTONOMY',
    description: 'Advanced lane finding, CNN traffic-sign classifier, and A* route planner from the SDC nanodegree.',
    stack: ['Python', 'TensorFlow', 'OpenCV'],
    url: 'https://github.com/hariperla/CarND-Advanced-Lane-Finding',
  },
]

export const systems = [
  {
    module: 'FLIGHT CONTROL',
    sub: 'Languages',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'MATLAB', level: 90 },
      { name: 'C / C++', level: 85 },
      { name: 'SQL', level: 80 },
    ],
  },
  {
    module: 'TARGETING',
    sub: 'AI / ML',
    skills: [
      { name: 'Pandas', level: 95 },
      { name: 'SciKit-Learn', level: 90 },
      { name: 'NLP · DistilBERT', level: 85 },
      { name: 'Model Evaluation', level: 88 },
    ],
  },
  {
    module: 'POWER PLANT',
    sub: 'Data & Cloud',
    skills: [
      { name: 'Databricks', level: 90 },
      { name: 'Tableau · Streamlit', level: 88 },
      { name: 'MongoDB', level: 85 },
      { name: 'AWS', level: 78 },
    ],
  },
  {
    module: 'SENSOR ARRAY',
    sub: 'Autonomy Stack',
    skills: [
      { name: 'AEB · ACC · HWA Domain', level: 95 },
      { name: 'KPI & Metrics Design', level: 95 },
      { name: 'Polaris · Foxglove', level: 92 },
      { name: 'Simulation Triage', level: 90 },
    ],
  },
  {
    module: 'COMMAND',
    sub: 'Leadership',
    skills: [
      { name: 'JIRA · Confluence · Agile', level: 95 },
      { name: 'Program Management', level: 92 },
      { name: 'Executive Communication', level: 92 },
      { name: 'PRD / POC Development', level: 90 },
    ],
  },
]

export const auxModules = [
  'Jenkins', 'Git', 'REST APIs', 'Tkinter', 'Luau', 'Agile / Scrum', 'Confluence', 'HIL Testing', 'Stateflow',
]

export const achievements = [
  {
    featured: true,
    kicker: 'US PATENT',
    title: 'US 10,690,245 B2',
    sub: 'Ratio-Drift Control in a CVT',
    description:
      'Invented and shipped a patented control algorithm eliminating ratio drift during cold launches and emergency braking — running in production transmissions.',
  },
  {
    kicker: 'EDUCATION',
    title: 'M.S. — Purdue University',
    sub: 'Electrical & Computer Engineering · 2009 — 2012',
  },
  {
    kicker: 'LEADERSHIP',
    title: 'Team Built: 0 → 7',
    sub: 'Assembled Rivian’s autonomy triage team from the ground up',
  },
  {
    kicker: 'CERTIFICATION',
    title: 'Udacity Nanodegrees ×2',
    sub: 'Self-Driving Car Engineer · Sensor Fusion',
  },
]

export const comms = [
  { label: 'EMAIL', value: 'perlaharicharan@gmail.com', href: 'mailto:perlaharicharan@gmail.com', accent: 'var(--red)' },
  { label: 'LINKEDIN', value: '/in/hari-perla', href: 'https://www.linkedin.com/in/hari-perla-68561528/', accent: 'var(--arc)' },
  { label: 'GITHUB', value: 'github.com/hariperla', href: 'https://github.com/hariperla', accent: 'var(--gold)' },
  { label: 'DIRECT LINE', value: '309-621-3571', href: 'tel:3096213571', accent: 'var(--arc)' },
]

export const bootLines = [
  'STARK-CLASS BOOTLOADER v12.0 — PERLA WORKSHOP',
  '> mounting /dev/autonomy ................ OK',
  '> sensor array [AEB·ACC·HWA·PAW·BSW] .... CALIBRATED',
  '> loading DistilBERT weights ............ OK',
  '> Databricks cluster uplink ............. SECURE',
  '> triage backlog ........................ PURGED [-80%]',
  '> arc reactor output .................... STABLE',
  '> T.R.I.A.G.E. OS ....................... READY',
]

export const navLinks = [
  { label: 'MISSION LOG', href: '#missionlog' },
  { label: 'WORKSHOP', href: '#workshop' },
  { label: 'SYSTEMS', href: '#systems' },
  { label: 'ARMORY', href: '#armory' },
  { label: 'COMMS', href: '#comms' },
]
