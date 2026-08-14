import { leadership } from '../../data/resume'
import Section from '../ui/Section'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function LeadershipStrip() {
  const ref = useScrollReveal()

  return (
    <Section id="leadership" eyebrow="COMMAND RECORD" title="Leadership & Involvement">
      <div ref={ref} className="grid sm:grid-cols-2 gap-4">
        {leadership.map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-panel border border-line rounded-xl p-4 hover:border-cyanDim transition-colors">
            <div className="w-8 h-8 rounded-full bg-cyanDim/20 border border-cyanDim flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-xs text-cyan">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div>
              <p className="font-mono text-sm text-text font-medium">{item.role}</p>
              <p className="font-mono text-[10px] text-muted mt-0.5">{item.org}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
