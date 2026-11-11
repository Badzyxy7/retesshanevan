import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { Code, Film } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { capabilities, tools } from '../data/skills'
import type { Tool } from '../data/skills'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const cardIcons = { code: Code, film: Film }

// Icons are drawn in pure black (light mode) or white (dark mode)
function ToolIcon({ tool }: { tool: Tool }) {
  const [failed, setFailed] = useState(false)

  if (!tool.icon || failed) {
    return (
      <span className="font-display text-2xl font-black">
        {tool.name
          .replace(/[^a-z0-9]/gi, '')
          .slice(0, 2)
          .toUpperCase()}
      </span>
    )
  }

  const src = tool.icon.startsWith('/')
    ? tool.icon
    : `https://api.iconify.design/${tool.icon.replace(':', '/')}.svg`

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className="h-auto w-[44%] brightness-0 select-none dark:invert"
    />
  )
}

// Card that tilts toward the cursor, with a soft light that follows it
function Tilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.transform = `perspective(1000px) rotateX(${((0.5 - py) * 8).toFixed(2)}deg) rotateY(${((px - 0.5) * 10).toFixed(2)}deg)`
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
    el.style.setProperty('--glow', '1')
  }

  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.setProperty('--glow', '0')
  }

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className="relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-8"
      style={{ transition: 'transform 200ms ease-out' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 'var(--glow, 0)',
          background:
            'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--fg) 9%, transparent), transparent 70%)',
        }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  )
}

export default function Skills() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // Title lines rise out of a mask
      gsap.from('.skill-line', {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.skill-title',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      // Tool tiles flip up in 3D, scrubbed by scroll
      gsap.from('.skill-tile', {
        rotateX: -85,
        y: 70,
        autoAlpha: 0,
        transformPerspective: 700,
        ease: 'power2.out',
        stagger: { each: 0.035, from: 'random' },
        scrollTrigger: {
          trigger: '.skill-grid',
          start: 'top 90%',
          end: 'top 35%',
          scrub: 0.6,
        },
      })

      // Then each tile floats at its own pace
      gsap.utils.toArray<HTMLElement>('.skill-float').forEach((el) => {
        gsap.to(el, {
          y: gsap.utils.random(-8, 8),
          duration: gsap.utils.random(2.2, 3.8),
          delay: gsap.utils.random(0, 2),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })

      // Cards tip up from the bottom edge
      gsap.from('.skill-card', {
        y: 140,
        rotateX: 26,
        autoAlpha: 0,
        transformPerspective: 1200,
        transformOrigin: '50% 100%',
        ease: 'power2.out',
        stagger: 0.18,
        scrollTrigger: {
          trigger: '.skill-cards',
          start: 'top 92%',
          end: 'top 38%',
          scrub: 0.6,
        },
      })

      // Tags pop in once the cards have landed
      gsap.from('.skill-tag', {
        autoAlpha: 0,
        y: 12,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.skill-cards',
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      })
    },
    { scope: root },
  )

  return (
    <section
      id="skills"
      ref={root}
      className="relative overflow-x-clip border-t border-line py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 className="skill-title font-display text-7xl leading-[0.9] font-black md:text-9xl">
            <span className="block overflow-hidden py-[0.04em]">
              <span className="skill-line block">What I</span>
            </span>
            <span className="block overflow-hidden py-[0.04em]">
              <span className="skill-line block">can do</span>
            </span>
          </h2>
          <p className="mt-6 max-w-[42ch] text-muted">
            I build websites, mobile apps and desktop software, and design and
            edit the visuals that go with them.
          </p>

          <ul className="skill-grid mt-10 grid max-w-sm grid-cols-6 gap-2.5 md:gap-3">
            {tools.map((tool) => (
              <li key={tool.name} className="skill-tile group relative hover:z-20 focus-within:z-20">
                <div className="skill-float">
                  <div className="grid aspect-square w-full place-items-center rounded-2xl border border-line bg-surface transition-transform duration-300 group-hover:scale-110">
                    <ToolIcon tool={tool} />
                  </div>
                </div>
                <span className="sr-only">{tool.name}</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-full bg-fg px-2.5 py-1 text-xs whitespace-nowrap text-bg opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                  {tool.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="skill-cards grid gap-5 sm:grid-cols-2 lg:col-span-8">
          {capabilities.map((c) => {
            const Icon = cardIcons[c.icon]
            return (
              <div key={c.number} className="skill-card">
                <Tilt>
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-display text-7xl leading-none font-black">
                      {c.number}
                    </p>
                    <p className="max-w-[14ch] pt-2 text-right text-sm text-muted">
                      {c.title}
                    </p>
                  </div>

                  <div className="mt-8 grid size-14 place-items-center rounded-2xl border border-line">
                    <Icon size={26} strokeWidth={1.5} />
                  </div>

                  <p className="mt-6 text-sm leading-relaxed text-muted">
                    {c.description}
                  </p>

                  <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                    {c.skills.map((s) => (
                      <li
                        key={s}
                        className="skill-tag rounded-full border border-fg px-3 py-1 text-xs font-medium"
                      >
                        {s}
                      </li>
                    ))}
                    {c.tech.map((t) => (
                      <li
                        key={t}
                        className="skill-tag rounded-full border border-line px-3 py-1 text-xs text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </Tilt>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}