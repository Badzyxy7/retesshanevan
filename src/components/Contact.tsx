import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Mail,
  Send,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { contact } from '../data/contact'
import { scrollToSection } from '../hooks/useSmoothScroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function ChannelIcon({ icon }: { icon: string }) {
  if (icon === 'mail') return <Mail size={20} strokeWidth={1.6} />
  return (
    <img
      src={`https://api.iconify.design/${icon.replace(':', '/')}.svg`}
      alt=""
      draggable={false}
      className="size-5 brightness-0 select-none dark:invert"
    />
  )
}

export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1800)
    } catch {
      // Clipboard can be blocked; the link still works
    }
  }

  // The big button leans toward the cursor
  const attract = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reducedMotion() || e.pointerType === 'touch') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    gsap.to(el, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.12,
      y: (e.clientY - (r.top + r.height / 2)) * 0.35,
      duration: 0.4,
      ease: 'power3.out',
    })
  }
  const release = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  useGSAP(
    () => {
      if (reducedMotion()) return

      // Headline lines rise out of a mask
      gsap.from('.contact-line', {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.contact-title',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      // The text and buttons follow the headline
      gsap.from('.contact-copy', {
        y: 24,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-title',
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      })

      // Cards swing in from the right edge, tied to scroll
      gsap.from('.contact-card', {
        x: 90,
        rotateY: -38,
        autoAlpha: 0,
        transformPerspective: 1000,
        transformOrigin: '0% 50%',
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.contact-cards',
          start: 'top 90%',
          end: 'top 35%',
          scrub: 0.6,
        },
      })
    },
    { scope: root },
  )

  return (
    <section
      id="contact"
      ref={root}
      className="relative flex min-h-svh flex-col overflow-x-clip border-t border-line"
    >
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-6 py-28 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="contact-title font-display text-[clamp(4.5rem,13vw,11rem)] leading-[0.84] font-black">
            {contact.title.map((line) => (
              <span key={line} className="block overflow-hidden py-[0.04em]">
                <span className="contact-line block">{line}</span>
              </span>
            ))}
          </h2>

          <p className="contact-copy mt-10 max-w-[24ch] font-display text-3xl leading-tight font-black md:text-4xl">
            {contact.tagline}
          </p>
          <p className="contact-copy mt-4 max-w-[46ch] text-muted">
            {contact.body}
          </p>

          {contact.resume && (
            <a
              href={contact.resume}
              download
              className="contact-copy mt-8 inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
            >
              Download resume
              <Download size={16} />
            </a>
          )}
        </div>

        <div className="contact-cards flex flex-col gap-3 lg:col-span-5">
          {contact.channels.map((c) => {
            const isMail = c.href.startsWith('mailto:')
            const done = copied === c.id
            return (
              <div
                key={c.id}
                className="contact-card group relative flex items-center gap-4 rounded-3xl border border-line bg-surface p-4 pr-5 transition-colors duration-300 hover:border-fg/40"
              >
                <a
                  href={c.href}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noreferrer noopener'}
                  className="flex min-w-0 flex-1 items-center gap-4 after:absolute after:inset-0 after:rounded-3xl"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line transition-colors duration-300 group-hover:bg-fg/10">
                    <ChannelIcon icon={c.icon} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">{c.label}</span>
                    <span className="block truncate font-medium">{c.value}</span>
                  </span>
                </a>

                {c.copy ? (
                  <button
                    type="button"
                    onClick={() => copy(c.id, c.value)}
                    aria-label={`Copy ${c.value}`}
                    className="relative z-10 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-fg/10 hover:text-fg"
                  >
                    {done ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                ) : (
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                  />
                )}
              </div>
            )
          })}

          <a
            href={`mailto:${contact.email}`}
            onPointerMove={attract}
            onPointerLeave={release}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-fg px-6 py-5 text-sm font-medium transition-colors duration-300 hover:bg-fg hover:text-bg"
          >
            Send me a message
            <Send size={16} />
          </a>

          <p role="status" className="sr-only">
            {copied ? 'Copied to clipboard' : ''}
          </p>
        </div>
      </div>

      <footer className="mx-auto flex w-full max-w-7xl items-center justify-between border-t border-line px-6 py-6 text-sm text-muted md:px-10">
        <p>© 2026 Shane Van Retes</p>
        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className="inline-flex cursor-pointer items-center gap-2 transition-colors hover:text-fg"
        >
          Back to top
          <ArrowUp size={16} />
        </button>
      </footer>
    </section>
  )
}