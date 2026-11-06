import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

/* Scroll to an element or y-offset: eased through Lenis when it's running,
   native otherwise (reduced motion). */
export function scrollToTarget(target, opts = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -84, duration: 1.4, ...opts })
    return
  }
  const top = typeof target === 'number'
    ? target
    : (typeof target === 'string' ? document.querySelector(target) : target)?.getBoundingClientRect().top + window.scrollY - 84
  window.scrollTo({ top, behavior: 'auto' })
}

/* Lenis gives the whole page an inertial, weighted scroll; GSAP's ticker drives
   it so ScrollTrigger pins/scrubs and Lenis share one clock (no jitter).
   Framer Motion's useScroll keeps working since Lenis moves the native scroll. */
export function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -84 },
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    document.documentElement.classList.add('lenis-on')

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenis = null
      document.documentElement.classList.remove('lenis-on')
    }
  }, [enabled])
}

/* Lenis exposes start/stop to freeze scrolling (boot overlay). */
export function setScrollLocked(locked) {
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}

export { gsap, ScrollTrigger }
