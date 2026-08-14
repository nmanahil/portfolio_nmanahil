import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../../data/resume'
import Section from '../ui/Section'

gsap.registerPlugin(ScrollTrigger)

export default function AuditLog() {
  const listRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !listRef.current) return

    // Animate the timeline line drawing downward
    if (lineRef.current) {
      gsap.fromTo(lineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.5,
          },
        }
      )
    }

    const entries = listRef.current.querySelectorAll('.audit-entry')
    entries.forEach((entry) => {
      const bullets = entry.querySelectorAll('.audit-bullet')
      gsap.set(entry, { opacity: 0, x: -30 })
      gsap.set(bullets, { opacity: 0, x: -10 })

      ScrollTrigger.create({
        trigger: entry,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(entry, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' })
          gsap.to(bullets, { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, delay: 0.3, ease: 'power2.out' })
        },
      })
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <Section id="experience" eyebrow="AUDIT LOG" title="Experience Timeline"
      description="Access history — verified entries only.">
      <div ref={listRef} className="relative">
        {/* Timeline line — draws downward on scroll */}
        <div ref={lineRef} className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-cyan/60 via-cyan/20 to-transparent" />

        <div className="space-y-10 pl-10">
          {experience.map((entry, i) => (
            <div key={i} className="audit-entry relative">
              {/* Dot */}
              <div className={`absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border-2 ${entry.status === 'ACTIVE' ? 'bg-cyan border-cyan' : 'bg-panel border-cyanDim'}`} />

              <div className="bg-panel border border-line rounded-xl p-5 hover:border-cyanDim transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-mono text-[10px] text-muted tracking-widest mb-1">{entry.org} · {entry.location}</p>
                    <h3 className="font-mono text-base font-semibold text-text">{entry.role}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${entry.status === 'ACTIVE' ? 'text-cyan border-cyanDim bg-cyanDim/10' : 'text-muted border-line'}`}>
                      {entry.status}
                    </span>
                    <span className="font-mono text-[10px] text-muted">{entry.dateRange}</span>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {entry.bullets.map((b, j) => (
                    <li key={j} className="audit-bullet flex gap-2 text-sm text-muted">
                      <span className="text-cyanDim flex-shrink-0 font-mono">›</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
