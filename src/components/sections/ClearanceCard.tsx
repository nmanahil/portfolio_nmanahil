import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  const [modalOpen, setModalOpen] = useState(false)

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <Section id="about" eyebrow="CLEARANCE CARD" title="Identity Profile">
      <div ref={cardRef} className="space-y-6">

        {/* Top row */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">

          {/* ID Badge — click to expand */}
          <div
            className="bg-panel border border-line rounded-xl border-glow relative overflow-hidden flex cursor-pointer group"
            style={{ minHeight: '300px' }}
            onClick={() => setModalOpen(true)}
            role="button"
            aria-label="View full identity profile"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan via-cyanDim to-transparent z-10" />

            {/* Photo — takes up left half */}
            <div className="relative w-1/2 flex-shrink-0">
              <img
                src={profile.photos[1]}
                alt={profile.name}
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              {/* Fade to right */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to right, transparent 50%, rgba(16,25,34,1) 100%)' }} />
              <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
            </div>

            {/* Info */}
            <div className="flex-1 p-5 pt-6 flex flex-col justify-between min-w-0">
              <div>
                <p className="font-mono text-[10px] text-muted tracking-widest mb-1">SUBJECT</p>
                <h3 className="font-mono text-base font-semibold text-text">{profile.name}</h3>
                <p className="font-mono text-xs text-cyan mt-1">{profile.title}</p>
                <div className="mt-4 space-y-1.5">
                  {[
                    ['LOCATION',    profile.location],
                    ['INSTITUTION', 'ELTE Budapest'],
                    ['STATUS',      'ACTIVE CLEARANCE'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2 font-mono text-[10px]">
                      <span className="text-muted w-20 flex-shrink-0">{k}</span>
                      <span className={k === 'STATUS' ? 'text-cyan' : 'text-text/80'}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-line">
                <p className="text-[10px] text-muted leading-relaxed line-clamp-3">{profile.summary}</p>
                {/* Click hint */}
                <p className="font-mono text-[9px] text-cyan/50 mt-3 tracking-widest group-hover:text-cyan/80 transition-colors">
                  CLICK TO DECLASSIFY ›
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
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

        {/* Photo[2] cinematic banner */}
        <div className="relative rounded-xl overflow-hidden border border-line" style={{ height: '200px' }}>
          <img
            src={profile.photos[2]}
            alt={profile.name}
            className="w-full h-full object-cover object-top"
            style={{ filter: 'contrast(1.05) saturate(0.8)' }}
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(10,15,20,0.88) 0%, rgba(10,15,20,0.25) 45%, rgba(10,15,20,0.65) 100%)' }} />
          <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
          <div className="absolute inset-0 flex items-center px-8">
            <div>
              <p className="font-mono text-[10px] text-cyan tracking-[0.3em] mb-2">FIELD OPERATIVE</p>
              <p className="font-mono text-2xl font-bold text-text">{profile.name}</p>
              <p className="font-mono text-sm text-muted mt-1">{profile.title} · Morgan Stanley</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-ink/70 backdrop-blur border border-cyan/30 rounded px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-[10px] text-cyan tracking-widest">CLEARANCE: ALPHA-7</span>
          </div>
        </div>
      </div>

      {/* ── Modal popup ── */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div
                className="pointer-events-auto bg-panel border border-cyanDim rounded-2xl overflow-hidden shadow-2xl border-glow w-full max-w-2xl"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal header bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-panel2 border-b border-line">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                    <span className="font-mono text-xs text-cyan tracking-widest">IDENTITY FILE — DECLASSIFIED</span>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="font-mono text-muted hover:text-text transition-colors text-lg leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
                    aria-label="Close"
                  >×</button>
                </div>

                {/* Modal body */}
                <div className="flex flex-col sm:flex-row" style={{ minHeight: '340px' }}>
                  {/* Photo — fills full height of modal body */}
                  <div className="relative flex-shrink-0 w-full sm:w-48 h-52 sm:h-auto">
                    <img
                      src={profile.photos[1]}
                      alt={profile.name}
                      className="w-full h-full object-cover object-top"
                      style={{ display: 'block' }}
                    />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(to bottom, transparent 70%, rgba(16,25,34,0.6) 100%), linear-gradient(to right, transparent 70%, rgba(16,25,34,1) 100%)' }} />
                    <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                    <p className="font-mono text-[10px] text-muted tracking-widest mb-1">SUBJECT</p>
                    <h2 className="font-mono text-xl font-bold text-text">{profile.name}</h2>
                    <p className="font-mono text-sm text-cyan mt-1 mb-5">{profile.title}</p>

                    <div className="space-y-2 mb-6">
                      {[
                        ['LOCATION',    profile.location],
                        ['INSTITUTION', 'ELTE — BSc Computer Science'],
                        ['EMAIL',       profile.email],
                        ['STATUS',      'ACTIVE CLEARANCE'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-3 font-mono text-xs">
                          <span className="text-muted w-24 flex-shrink-0">{k}</span>
                          <span className={k === 'STATUS' ? 'text-cyan' : 'text-text/90'}>{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-line pt-4">
                      <p className="font-mono text-[10px] text-muted tracking-widest mb-3">FULL SUMMARY</p>
                      <p className="text-sm text-muted leading-relaxed">{profile.summary}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Section>
  )
}
