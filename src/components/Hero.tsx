import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const WORD = 'PORTFOLIO'
const fade = 'linear-gradient(to bottom, #000 25%, transparent 92%)'

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const [hasPortrait, setHasPortrait] = useState(true)

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
     if (reduced) return

      // The one load sequence
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from(
        '.hero-letter',
        { yPercent: 60, autoAlpha: 0, duration: 1.2, stagger: 0.07 },
        0.15,
      )
      
      tl.from(
        '.hero-portrait',
        { yPercent: 12, autoAlpha: 0, duration: 1.4 },
        0.5,
      )
      tl.from(
        '.hero-rise',
        { y: 28, autoAlpha: 0, duration: 1, stagger: 0.12 },
        0.9,
      )

      // Floating: slow drifting, each element at its own pace
      gsap.to('.float-intro', {
        y: -12,
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.8,
      })
      gsap.to('.float-role', {
        y: -16,
        x: 6,
        rotation: 1.2,
        duration: 4.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.1,
      })

      // Scroll: the word and portrait drift at different speeds
      const scrub = {
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
      gsap.to('.hero-word', { yPercent: -18, ease: 'none', scrollTrigger: scrub })
      gsap.to('.hero-portrait-wrap', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: scrub,
      })
    },
    { scope: root },
  )

  return (
    <section
      id="home"
      ref={root}
      className="relative min-h-svh overflow-hidden"
    >
      {/* Giant word, behind everything */}
      <div
        aria-hidden="true"
        className="hero-word pointer-events-none absolute inset-x-0 top-[16svh] z-10 text-center font-display text-[22vw] leading-[0.8] font-black whitespace-nowrap select-none"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        {WORD.split('').map((letter, i) => (
          <span key={i} className="hero-letter inline-block">
            {letter}
          </span>
        ))}
      </div>

      {/* Portrait */}
      {hasPortrait && (
        <div className="hero-portrait-wrap pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center">
          <img
            src="/portrait.png"
            alt="Portrait of Shane Van Retes"
            draggable={false}
            onError={() => setHasPortrait(false)}
            className="hero-portrait h-[66svh] w-auto max-w-none object-contain select-none md:h-[88svh]"
          />
        </div>
      )}

      {/* Availability */}
      <p className="hero-rise absolute top-24 right-6 z-30 hidden items-center gap-2 text-sm text-muted sm:flex md:right-10">
        <span className="size-2 rounded-full bg-fg" />
        Available for projects
      </p>

      {/* Intro (floats) */}
      <div className="float-intro absolute bottom-8 left-6 z-30 md:bottom-12 md:left-10">
        <p className="hero-rise text-lg text-muted italic">Hey, I'm</p>
        <h1 className="hero-rise font-display text-5xl leading-[0.9] font-black md:text-7xl">
          Shane
          <br />
          Van Retes
        </h1>
        <p className="hero-rise mt-4 max-w-[28ch] text-sm text-muted">
          I build fast websites and design the visuals that go with them.
        </p>
      </div>

      {/* Role card (floats) */}
      <div className="float-role absolute right-6 bottom-8 z-30 hidden md:right-10 md:bottom-12 md:block">
        <div className="hero-rise rounded-2xl border border-line bg-surface/80 px-6 py-4 backdrop-blur-md">
          <p className="font-display text-2xl font-black">Web developer</p>
          <p className="font-display text-2xl font-black text-muted">
            Graphic designer
          </p>
        </div>
      </div>
    </section>
  )
}