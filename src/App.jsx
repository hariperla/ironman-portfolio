import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import BackgroundFX from './components/BackgroundFX.jsx'
import BootSequence from './components/BootSequence.jsx'
import HUDOverlay from './components/HUDOverlay.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import PowerStats from './components/PowerStats.jsx'
import MarkTimeline from './components/MarkTimeline.jsx'
import Workshop from './components/Workshop.jsx'
import SuitSystems from './components/SuitSystems.jsx'
import Achievements from './components/Achievements.jsx'
import Contact from './components/Contact.jsx'

export default function App() {
  const reduce = useReducedMotion()
  const [booted, setBooted] = useState(false)

  // skip boot entirely for reduced-motion users
  useEffect(() => {
    if (reduce) setBooted(true)
  }, [reduce])

  // lock scroll during boot
  useEffect(() => {
    document.body.style.overflow = booted ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [booted])

  return (
    <>
      <AnimatePresence>
        {!booted && <BootSequence key="boot" onDone={() => setBooted(true)} />}
      </AnimatePresence>

      <BackgroundFX />
      <HUDOverlay />
      <Nav />

      <main className="relative" style={{ zIndex: 1 }}>
        <Hero />
        <PowerStats />
        <MarkTimeline />
        <Workshop />
        <SuitSystems />
        <Achievements />
        <Contact />
      </main>
    </>
  )
}
