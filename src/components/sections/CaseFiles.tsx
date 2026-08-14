import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../../data/resume'
import Section from '../ui/Section'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function CaseFiles() {
  const [open, setOpen] = useState<string | null>(null)
  const ref = useScrollReveal()

  return (
    <Section id="projects" eyebrow="CASE FILES" title="Projects"
      description="Classified operations — click to declassify.">
      <div ref={ref} className="grid md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id}
            className="bg-panel border border-line rounded-xl overflow-hidden hover:border-cyanDim transition-colors cursor-pointer"
            onClick={() => setOpen(open === p.id ? null : p.id)}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-[10px] text-muted tracking-widest mb-1">
                    {p.status === 'In Progress' ? '⟳ IN PROGRESS' : '✓ SHIPPED'}
                  </p>
                  <h3 className="font-mono text-base font-semibold text-text">{p.name}</h3>
                </div>
                <span className={`font-mono text-lg text-muted transition-transform duration-200 ${open === p.id ? 'rotate-45' : ''}`}>+</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[10px] px-2 py-0.5 bg-panel2 border border-line rounded text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {open === p.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0 border-t border-line">
                    <p className="text-sm text-muted leading-relaxed mt-3">{p.description}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Section>
  )
}
