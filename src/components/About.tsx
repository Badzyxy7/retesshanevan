import { useRef, useState } from 'react'
import { GraduationCap, Layers } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { about } from '../data/about'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const icons = { graduation: GraduationCap, layers: Layers }
const fade = 'linear-gradient(to bottom, #000 30%, transparent 95%)'

// Splits text into words so the scroll can fill them in one by one
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} className="bio-word">
          {word}{' '}
        </span>
      ))}
    </>
  )
}

export default function About() {
  const root = useRef<HTMLElement>(null)
  const [hasPhoto, setHasPhoto] = useState(true)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // Headline lines rise out of a mask
      gsap.from('.about-line', {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.about-title',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      // The bio fills in word by word as you scroll
      gsap.fromTo(
        '.bio-word',
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.06,
          scrollTrigger: {
            trigger: '.bio-block',
            start: 'top 78%',
            end: 'bottom 50%',
            scrub: true,
          },
        },
      )

      // The giant word drifts sideways behind the photo
      gsap.fromTo(
        '.about-giant',
        { xPercent: 14 },
        {
          xPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )

      // The photo is revealed from the bottom up
      gsap.fromTo(
        '.about-photo',
        { clipPath: 'inset(100% 0% 0% 0%)', yPercent: 8 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          yPercent: 0,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.about-body',
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      // The photo also moves slightly slower than the page
      gsap.fromTo(
        '.about-photo-box',
        { yPercent: 5 },
        {
          yPercent: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )

      // Callouts draw themselves: dot, then line, then label
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.about-body',
            start: 'top 40%',
            toggleActions: 'play none none reverse',
          },
        })
        .from('.callout-dot', {
          scale: 0,
          duration: 0.4,
          stagger: 0.15,
          ease: 'back.out(3)',
        })
        .from(
          '.callout-line',
          { scaleX: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
          '<0.1',
        )
        .from(
          '.callout-label',
          { autoAlpha: 0, scale: 0.85, duration: 0.5, stagger: 0.15 },
          '<0.3',
        )

      // The stats card tips up, then its rows follow
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.stats-card',
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        })
        .from('.stats-card', {
          y: 90,
          rotateX: 22,
          autoAlpha: 0,
          transformPerspective: 900,
          duration: 1,
          ease: 'power4.out',
        })
        .from(
          '.stats-row',
          { autoAlpha: 0, x: -20, duration: 0.6, stagger: 0.12 },
          '<0.35',
        )
    },
    { scope: root },
  )

  return (
    <section
      id="about"
      ref={root}
      className="relative overflow-hidden border-t border-line pt-28"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <h2 className="about-title font-display text-[clamp(2rem,7.2vw,6rem)] leading-[0.9] font-black">
          {about.headline.map((line, i) => (
            <span key={i} className="block overflow-hidden py-[0.04em]">
              <span
                className={`about-line block ${i === 1 ? 'text-muted' : ''}`}
              >
                {line}
              </span>
            </span>
          ))}
        </h2>
      </div>

      <div className="about-body relative mx-auto mt-8 max-w-7xl px-6 md:px-10 lg:min-h-[88svh]">
        {/* Text column */}
       <div className="relative z-30 pb-12 lg:w-[44%] lg:pb-16">
          <div className="bio-block">
            <div className="max-w-[46ch] space-y-4 text-base leading-relaxed lg:text-[1.05rem]">
              {about.paragraphs.map((p, i) => (
                <p key={i}>
                  <Words text={p} />
                </p>
              ))}
            </div>
            <p className="mt-8 max-w-[22ch] font-display text-3xl leading-tight font-black md:text-4xl">
              <Words text={about.closing} />
            </p>
          </div>

          <div className="stats-card mt-10 max-w-sm rounded-3xl bg-fg p-6 text-bg">
            {about.stats.map((stat, i) => {
              const Icon = icons[stat.icon]
              return (
                <div
                  key={stat.label}
                  className={`stats-row flex items-start gap-4 ${
                    i > 0 ? 'mt-5 border-t border-bg/20 pt-5' : ''
                  }`}
                >
                  <Icon size={28} strokeWidth={1.5} className="mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-bg/60">{stat.label}</p>
                    {stat.lines.map((line) => (
                      <p
                        key={line}
                        className="font-display text-xl leading-tight font-black"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Photo column */}
        <div className="pointer-events-none relative z-10 mt-6 flex justify-center lg:absolute lg:right-10 lg:bottom-0 lg:mt-0 lg:w-[54%] lg:justify-end">
          <span
            aria-hidden="true"
            className="about-giant absolute top-[2%] right-0 z-0 font-display text-[28vw] leading-[0.8] font-black text-fg/10 select-none lg:text-[15vw]"
            style={{ maskImage: fade, WebkitMaskImage: fade }}
          >
            {about.giantWord}
          </span>

          <div className="about-photo-box relative z-10 w-fit max-w-full">
            {hasPhoto ? (
              <img
                src="/about.png"
                alt="Shane Van Retes"
                draggable={false}
                onLoad={() => ScrollTrigger.refresh()}
                onError={() => setHasPhoto(false)}
                className="about-photo h-[62svh] w-auto max-w-full object-contain object-bottom select-none lg:h-[84svh]"
              />
            ) : (
              <div className="grid h-[50svh] w-[min(80vw,24rem)] place-items-center rounded-3xl border border-dashed border-line px-6 text-center text-sm text-muted">
                Add your photo as public/about.png
              </div>
            )}

            {hasPhoto &&
              about.callouts.map((c) => (
                <div
                  key={c.label}
                  className={`absolute hidden items-center gap-2 md:flex ${
                    c.side === 'left'
                      ? '-translate-x-full flex-row'
                      : 'flex-row-reverse'
                  }`}
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                >
                  <span className="callout-label rounded-full border border-line bg-bg/80 px-3 py-1 text-xs whitespace-nowrap backdrop-blur">
                    {c.label}
                  </span>
                  <span
                    className="callout-line block h-px w-14 bg-fg"
                    style={{
                      transformOrigin:
                        c.side === 'left' ? 'right center' : 'left center',
                    }}
                  />
                  <span className="callout-dot block size-1.5 rounded-full bg-fg" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}