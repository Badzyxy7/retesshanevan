import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

// Glides to a section. Falls back to an instant jump if smooth scroll is off.
export function scrollToSection(id: string, onDone?: () => void) {
  const el = document.getElementById(id)
  if (!el) {
    onDone?.()
    return
  }

  if (lenis) {
    // Short hops are quick, long jumps take a little longer
    const distance = Math.abs(el.getBoundingClientRect().top)
    const screens = distance / window.innerHeight
    const duration = Math.min(0.8 + screens * 0.12, 1.3)

    lenis.scrollTo(el, {
      duration,
      // Starts fast, then eases out smoothly
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      onComplete: () => onDone?.(),
    })
  } else {
    el.scrollIntoView()
    onDone?.()
  }
}

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])
}