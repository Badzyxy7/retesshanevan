import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { scrollToSection } from '../hooks/useSmoothScroll'
import type { Theme } from '../hooks/useTheme'

const links = [
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'What I can do' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

type Props = { theme: Theme; onToggle: () => void }

export default function Nav({ theme, onToggle }: Props) {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const lock = useRef(false)

  // Click: light up the target, then glide to it
  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setOpen(false)
    setActive(id)
    lock.current = true
    const release = () => {
      lock.current = false
    }
    scrollToSection(id, release)
    window.setTimeout(release, 2400) // safety net
  }

  // Which section is current while scrolling
  useEffect(() => {
    const ids = ['home', ...links.map((l) => l.id)]
    let frame = 0

    const update = () => {
      frame = 0
      if (lock.current) return

      const line = window.innerHeight * 0.4
      let current = ids[0]

      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      if (atBottom) current = ids[ids.length - 1]

      setActive(current)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // The sliding pill follows the active link
  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current
      const el = list?.querySelector<HTMLElement>(`[data-id="${active}"]`)
      if (!list || !el) {
        setPill(null)
        return
      }
      setPill({ x: el.offsetLeft, w: el.offsetWidth })
    }

    measure()
    document.fonts.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-line bg-bg/70 py-2 pr-2 pl-2 backdrop-blur-xl"
      >
        <a
          href="#home"
          onClick={(e) => go(e, 'home')}
          aria-label="Shane Van Retes, back to top"
          className="grid size-10 place-items-center rounded-full bg-fg font-display text-xl font-black text-bg"
        >
          S
        </a>

        <ul
          ref={listRef}
          className="relative hidden items-center gap-1 md:flex"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 rounded-full bg-fg/10 transition-[transform,width,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: pill?.w ?? 0,
              transform: `translateX(${pill?.x ?? 0}px)`,
              opacity: pill ? 1 : 0,
            }}
          />
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                data-id={link.id}
                onClick={(e) => go(e, link.id)}
                className={`relative z-10 block rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                  active === link.id ? 'text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggle} />
          <a
            href="#contact"
            onClick={(e) => go(e, 'contact')}
            className="hidden rounded-full border border-fg px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fg hover:text-bg sm:block"
          >
            Hire me
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-line md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-5xl rounded-3xl border border-line bg-bg/90 p-3 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col">
            {[...links, { id: 'contact', label: 'Hire me' }].map((link, i) => (
              <li key={`${link.id}-${i}`}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => go(e, link.id)}
                  className="block rounded-2xl px-4 py-3 text-lg hover:bg-fg/10"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}