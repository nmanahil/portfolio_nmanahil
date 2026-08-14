import { ReactNode } from 'react'

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export default function Section({ id, eyebrow, title, description, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`relative py-24 px-6 md:px-12 max-w-6xl mx-auto ${className}`}>
      <div className="mb-12">
        <p className="font-mono text-xs text-cyan tracking-[0.3em] uppercase mb-3">
          &gt; {eyebrow}
        </p>
        <h2 className="font-mono text-3xl md:text-4xl font-semibold text-text mb-4">{title}</h2>
        {description && (
          <p className="text-muted text-sm md:text-base max-w-2xl leading-relaxed">{description}</p>
        )}
        <div className="mt-4 h-px bg-gradient-to-r from-cyan/40 via-line to-transparent" />
      </div>
      {children}
    </section>
  )
}
