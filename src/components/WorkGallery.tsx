import { useEffect, useRef, useState } from 'react'
import type {
  CSSProperties,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { categories, projects } from '../data/projects'
import type { Category, Project } from '../data/projects'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="grid h-full w-full place-items-center"
      style={{
        backgroundImage:
          'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }}
    >
      <div className="text-center">
        <p className="font-display text-7xl leading-none font-black text-fg/15 capitalize md:text-9xl">
          {label}
        </p>
        <p className="mt-3 text-sm text-muted">Preview coming soon</p>
      </div>
    </div>
  )
}

type CardProps = {
  project: Project
  offset: number
  onSelect: () => void
}

function Card({ project, offset, onSelect }: CardProps) {
  const tilt = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const distance = Math.abs(offset)
  const active = offset === 0
  const hidden = distance > 2

  // The active card tilts toward the cursor
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!active || !tilt.current) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    tilt.current.style.transform = `perspective(900px) rotateX(${(-py * 12).toFixed(2)}deg) rotateY(${(px * 16).toFixed(2)}deg)`
  }
  const reset = () => {
    if (tilt.current) tilt.current.style.transform = ''
  }

  return (
    <div
      onClick={active ? undefined : onSelect}
      onKeyDown={(e) => {
        if (!active && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onSelect()
        }
      }}
      onPointerMove={move}
      onPointerLeave={reset}
      role={active ? undefined : 'button'}
      tabIndex={active || hidden ? -1 : 0}
      aria-hidden={hidden}
      aria-label={active ? undefined : `Show ${project.title}`}
      className="absolute top-0 left-1/2 h-full w-[78vw] sm:w-[62vw] md:w-[640px]"
      style={{
        transform: `translateX(${-50 + offset * 58}%) translateZ(${-distance * 160}px) rotateY(${-offset * 34}deg)`,
        zIndex: 10 - distance,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
        cursor: active ? 'default' : 'pointer',
        transition:
          'transform 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease',
      }}
    >
      <div className="card-in h-full" style={{ '--i': distance } as CSSProperties}>
        <div
          ref={tilt}
          className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface"
          style={{ transition: 'transform 200ms ease-out' }}
        >
          {project.image && !failed ? (
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              draggable={false}
              onError={() => setFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <Placeholder label={project.category} />
          )}
          {/* Dims the cards that aren't in focus */}
          <div
            className="pointer-events-none absolute inset-0 bg-bg transition-opacity duration-700"
            style={{ opacity: Math.min(distance * 0.5, 0.85) }}
          />
        </div>
      </div>
    </div>
  )
}

export default function WorkGallery() {
  const root = useRef<HTMLElement>(null)
  const drag = useRef({ x: 0, moved: false })
  const [category, setCategory] = useState<Category>('web')
  const [index, setIndex] = useState(0)

  const list = projects.filter((p) => p.category === category)
  const current = list[index]
  const label = categories.find((c) => c.id === category)?.label ?? ''

  const go = (next: number) =>
    setIndex(Math.min(Math.max(next, 0), list.length - 1))

  const pick = (id: Category) => {
    setCategory(id)
    setIndex(0)
  }

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, moved: false }
  }
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 10) drag.current.moved = true
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') go(index + 1)
    if (e.key === 'ArrowLeft') go(index - 1)
  }

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [category])

  // Scroll-driven: the gallery tilts up into view, then tilts away as you leave
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.fromTo(
        '.gallery-body',
        { rotateX: 38, y: 140, scale: 0.82, opacity: 0, transformPerspective: 1400 },
        {
          rotateX: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 70%',
            end: 'top 10%',
            scrub: true,
          },
        },
      )

      gsap.fromTo(
        '.gallery-body',
        { rotateX: 0, y: 0, scale: 1, opacity: 1 },
        {
          rotateX: -26,
          y: -90,
          scale: 0.9,
          opacity: 0.1,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: root.current,
            start: 'bottom 85%',
            end: 'bottom 15%',
            scrub: true,
          },
        },
      )
    },
    { scope: root },
  )

  return (
    <section
      id="work"
      ref={root}
      className="relative overflow-x-clip border-t border-line py-32"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <h2 className="font-display text-7xl leading-[0.85] font-black md:text-9xl">
            Work gallery
          </h2>
          <p className="mt-4 max-w-[40ch] text-muted">
            Systems, apps and websites I've built.
          </p>
        </div>

        <div role="group" aria-label="Project type" className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const count = projects.filter((p) => p.category === c.id).length
            const on = c.id === category
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => pick(c.id)}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                  on
                    ? 'border-fg bg-fg text-bg'
                    : 'border-line text-muted hover:text-fg'
                }`}
              >
                {c.label}
                <span className={on ? 'text-bg/60' : 'text-muted'}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="gallery-body mt-14">
        <div
          key={category}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${label} projects`}
          onKeyDown={onKey}
          onPointerDown={onDown}
          onPointerUp={onUp}
          className="relative mx-auto h-[220px] w-full touch-pan-y select-none sm:h-[300px] md:h-[420px]"
          style={{ perspective: '1600px' }}
        >
          {list.map((project, i) => (
            <Card
              key={project.id}
              project={project}
              offset={i - index}
              onSelect={() => {
                if (!drag.current.moved) go(i)
              }}
            />
          ))}
        </div>

        {list.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Previous project"
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-line transition-colors hover:bg-fg/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ArrowLeft size={18} />
            </button>
            <p className="min-w-14 text-center text-sm text-muted tabular-nums">
              {index + 1} / {list.length}
            </p>
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === list.length - 1}
              aria-label="Next project"
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-line transition-colors hover:bg-fg/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        <div
          key={current.id}
          className="info-in mx-auto mt-10 flex min-h-[19rem] max-w-2xl flex-col items-center px-6 text-center md:min-h-[16rem]"
        >
          <h3 className="font-display text-4xl font-black md:text-5xl">
            {current.title}
          </h3>
          <p className="mt-4 max-w-[60ch] text-balance text-muted">
            {current.description}
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {current.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted"
              >
                {t}
              </li>
            ))}
          </ul>
          {current.link && (
            <a
              href={current.link}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-fg px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fg hover:text-bg"
            >
              View project
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}