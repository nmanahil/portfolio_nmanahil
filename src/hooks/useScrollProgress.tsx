import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const SECTIONS = [
  { id: 'hero', label: 'INIT' },
  { id: 'about', label: 'PROFILE' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'experience', label: 'AUDIT LOG' },
  { id: 'projects', label: 'CASE FILES' },
  { id: 'certifications', label: 'CLEARANCE' },
  { id: 'leadership', label: 'COMMAND' },
  { id: 'contact', label: 'TRANSMIT' },
]

interface ScrollContextType {
  activeSection: string
  scrollProgress: number
}

const ScrollContext = createContext<ScrollContextType>({ activeSection: 'hero', scrollProgress: 0 })

export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState('hero')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(total > 0 ? window.scrollY / total : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Small delay so sections are mounted
    const timer = setTimeout(() => {
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        })
      })
    }, 300)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <ScrollContext.Provider value={{ activeSection, scrollProgress }}>
      {children}
    </ScrollContext.Provider>
  )
}

export const useScrollProgress = () => useContext(ScrollContext)
