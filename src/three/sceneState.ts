import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const sectionIds = ['home', 'work', 'skills', 'about', 'contact']

export const sceneState = {
  section: 0,
  velocity: 0,
  intro: 0,
}

export function trackSections() {
  const triggers: ScrollTrigger[] = []

  sectionIds.forEach((id, i) => {
    const el = document.getElementById(id)
    if (!el) return
    triggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onEnter: () => (sceneState.section = i),
        onEnterBack: () => (sceneState.section = i),
      }),
    )
  })

  triggers.push(
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        sceneState.velocity = self.getVelocity()
      },
    }),
  )

  return () => triggers.forEach((t) => t.kill())
}