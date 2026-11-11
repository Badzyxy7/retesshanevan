import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from './components/Nav'
import Hero from './components/Hero'
import WorkGallery from './components/WorkGallery'
import Skills from './components/Skills'
import About from './components/About'
import Contact from './components/Contact'
import { useTheme } from './hooks/useTheme'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  const { theme, toggle } = useTheme()
  useSmoothScroll()

  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <Nav theme={theme} onToggle={toggle} />
      <main className="relative">
        <Hero />
        <WorkGallery />
        <Skills />
        <About />
        <Contact />
      </main>
    </>
  )
}