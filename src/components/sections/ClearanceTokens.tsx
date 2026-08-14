import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { certifications } from '../../data/resume'
import Section from '../ui/Section'

gsap.registerPlugin(ScrollTrigger)

export default function ClearanceTokens() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !ref.current) return

    const chips = ref.current.querySelectorAll('.cert-chip')
    gsap.set(chips, { opacity: 0, scale: 0.8 })
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      onEnter: () => gsap.to(chips, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.07, ease: 'back.out(1.4)' }),
    })
    return () => ScrollTrigger.getAll().forEach((t) => t.vars.trigger === ref.current && t.kill())
  }, [])

  return (
    <Section id="certifications" eyebrow="CLEARANCE TOKENS" title="Certifications"
      description="Verified credentials on record.">
      <div ref={ref} className="flex flex-wrap gap-3">
        {certifications.map((cert) => (
          <div key={cert.name} className="cert-chip flex items-center gap-2 bg-panel border border-cyanDim/40 rounded-lg px-4 py-2.5 hover:border-cyan hover:bg-cyanDim/10 transition-colors">
            <span className="text-cyan font-mono text-xs">✓</span>
            <span className="font-mono text-xs text-text">{cert.name}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}
