import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills } from '../../data/resume'
import Section from '../ui/Section'

gsap.registerPlugin(ScrollTrigger)

const CLUSTER_COLORS: Record<string, string> = {
  'Cloud & Identity': '#4FD1C5',
  'Programming': '#E8A94C',
  'Web': '#7C8A93',
  'AI & Concepts': '#4FD1C5',
  'Tools': '#E8A94C',
}

export default function SkillNetwork() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !containerRef.current) return

    const clusters = containerRef.current.querySelectorAll('.skill-cluster')
    const nodes = containerRef.current.querySelectorAll('.skill-node')

    gsap.set(clusters, { opacity: 0, scale: 0.8 })
    gsap.set(nodes, { opacity: 0, y: 15 })

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(clusters, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)' })
        gsap.to(nodes, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, delay: 0.3, ease: 'power2.out' })
      },
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.vars.trigger === containerRef.current && t.kill())
  }, [])

  return (
    <Section id="skills" eyebrow="SKILL NETWORK" title="Technical Arsenal"
      description="Capabilities mapped by domain cluster.">
      {/* Mobile: simple stacked list */}
      <div className="sm:hidden space-y-6">
        {skills.map((cluster) => (
          <div key={cluster.cluster}>
            <p className="font-mono text-[10px] tracking-widest mb-2"
              style={{ color: CLUSTER_COLORS[cluster.cluster] ?? '#4FD1C5' }}>
              {cluster.cluster.toUpperCase()}
            </p>
            <div className="flex flex-wrap gap-2">
              {cluster.nodes.map((node) => (
                <span key={node} className="font-mono text-xs px-3 py-1.5 bg-panel2 border border-line rounded text-text">
                  {node}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: animated clusters */}
      <div ref={containerRef} className="hidden sm:block space-y-8">
        {skills.map((cluster) => (
          <div key={cluster.cluster} className="skill-cluster">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: CLUSTER_COLORS[cluster.cluster] ?? '#4FD1C5' }} />
              <span className="font-mono text-xs tracking-widest"
                style={{ color: CLUSTER_COLORS[cluster.cluster] ?? '#4FD1C5' }}>
                {cluster.cluster.toUpperCase()}
              </span>
              <div className="flex-1 h-px bg-line" />
            </div>
            <div className="flex flex-wrap gap-2 pl-5">
              {cluster.nodes.map((node) => (
                <span key={node} className="skill-node font-mono text-xs px-3 py-1.5 bg-panel2 border border-line rounded text-text hover:border-cyanDim hover:text-cyan transition-colors cursor-default">
                  {node}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
