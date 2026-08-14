import { useEffect, useRef, useState } from 'react'
import { profile } from '../../data/resume'
import Section from '../ui/Section'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const STATS = [
  { label: 'Experience', value: 2,    suffix: '+', sub: 'years at Morgan Stanley' },
  { label: 'University', value: null, display: 'ELTE', sub: 'BSc Computer Science' },
  { label: 'Certifications', value: 7, suffix: '', sub: 'security & cloud certs' },
  { label: 'Focus',      value: null, display: 'IAM',  sub: 'Identity & Access Mgmt' },
]

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        if (prefersReduced) { setCount(target); return }
        const duration = 1200
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(tick)
          else setCount(target)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function ClearanceCard() {
  const cardRef = useScrollReveal()

  return (
    <Section id="about" eyebrow="CLEARANCE CARD" title="Identity Profile">
      <div ref={cardRef} className="space-y-6">

        {/* Top row: badge + stats */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">

          {/* ID Badge — photo[1] as tall left panel */}
          <div className="bg-panel border border-line rounded-xl border-glow relative overflow-hidden flex min-h-[280px]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan via-cyanDim to-transparent z-10" />

            {/* Tall photo on the left */}
            <div className="relative w-40 flex-shrink-0">
              <img
                src={profile.photos[1]}
                alt={profile.name}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to right, transparent 55%, rgba(16,25,34,1) 100%)' }} />
              <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
            </div>

            {/* Info panel */}
            <div className="flex-1 p-5 pt-6 flex flex-col justify-between">
              <div>
                <p className="font-mono text-[10px] text-muted tracking-widest mb-1">SUBJECT</p>
                <h3 className="font-mono text-lg font-semibold text-text">{profile.name}</h3>
                <p className="font-mono text-xs text-cyan mt-1">{profile.title}</p>
                <div className="mt-4 space-y-1.5">
                  {[
                    ['LOCATION',    profile.location],
                    ['INSTITUTION', 'ELTE Budapest'],
                    ['STATUS',      'ACTIVE CLEARANCE'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2 font-mono text-[10px]">
                      <span className="text-muted w-24 flex-shrink-0">{k}</span>
                      <span className={k === 'STATUS' ? 'text-cyan' : 'text-text/80'}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-line">
                <p className="font-mono text-[10px] text-muted tracking-widest mb-2">SUMMARY</p>
                <p className="text-xs text-muted leading-relaxed line-clamp-4">{profile.summary}</p>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 content-start">
            {STATS.map(({ label, value, suffix, display, sub }) => (
              <div key={label} className="bg-panel2 border border-line rounded-lg p-4 hover:border-cyanDim transition-colors">
                <p className="font-mono text-2xl font-semibold text-cyan">
                  {value !== null ? <CountUp target={value!} suffix={suffix} /> : display}
                </p>
                <p className="font-mono text-xs text-text mt-1">{label}</p>
                <p className="font-mono text-[10px] text-muted mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: photos[2] as a wide cinematic banner */}
        <div className="relative rounded-xl overflow-hidden border border-line" style={{ height: '200px' }}>
          <img
            src={profile.photos[2]}
            alt={profile.name}
            className="w-full h-full object-cover object-top"
            style={{ filter: 'contrast(1.05) saturate(0.8)' }}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(10,15,20,0.85) 0%, rgba(10,15,20,0.3) 40%, rgba(10,15,20,0.7) 100%)' }} />
          <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />

          {/* Text overlay on the left */}
          <div className="absolute inset-0 flex items-center px-8">
            <div>
              <p className="font-mono text-[10px] text-cyan tracking-[0.3em] mb-2">FIELD OPERATIVE</p>
              <p className="font-mono text-2xl font-bold text-text">{profile.name}</p>
              <p className="font-mono text-sm text-muted mt-1">{profile.title} · Morgan Stanley</p>
            </div>
          </div>

          {/* Clearance badge top-right */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-ink/70 backdrop-blur border border-cyan/30 rounded px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-[10px] text-cyan tracking-widest">CLEARANCE: ALPHA-7</span>
          </div>
        </div>

      </div>
    </Section>
  )
}
