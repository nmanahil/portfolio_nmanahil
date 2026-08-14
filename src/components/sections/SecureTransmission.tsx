import { useState } from 'react'
import { contact, profile } from '../../data/resume'
import Section from '../ui/Section'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function SecureTransmission() {
  const ref = useScrollReveal()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `mailto:${contact.email}?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(form.message)}`
    setSent(true)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Atmospheric background photo */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img
          src={profile.photos[2]}
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-0 h-full w-auto max-w-none object-cover object-top"
          style={{
            opacity: 0.07,
            filter: 'blur(2px) grayscale(0.4) contrast(1.1)',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
          }}
        />
        {/* Extra cyan tint over the photo */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to left, rgba(79,209,197,0.04) 0%, transparent 60%)' }} />
      </div>

      <Section id="contact" eyebrow="SECURE TRANSMISSION" title="Open Channel"
        description={contact.availability}>
        <div ref={ref} className="grid md:grid-cols-2 gap-8 relative z-10">
          {/* Links */}
          <div className="space-y-4">
            {[
              { label: 'EMAIL',    value: contact.email,                    href: `mailto:${contact.email}` },
              { label: 'LINKEDIN', value: 'linkedin.com/in/manahilnawaz',   href: contact.linkedin },
              { label: 'PHONE',    value: contact.phone,                    href: `tel:${contact.phone}` },
            ].map(({ label, value, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 bg-panel/80 backdrop-blur border border-line rounded-xl p-4 hover:border-cyan group transition-colors">
                <span className="font-mono text-[10px] text-muted w-20 flex-shrink-0">{label}</span>
                <span className="font-mono text-sm text-text group-hover:text-cyan transition-colors">{value}</span>
              </a>
            ))}

            {/* Photo strip — photos[0] and photos[1] as small thumbnails */}
            <div className="flex gap-3 mt-6">
              {[profile.photos[0], profile.photos[1]].map((src, i) => (
                <div key={i} className="relative group">
                  <img
                    src={src}
                    alt={`Photo of ${profile.name}`}
                    className="w-16 h-20 object-cover object-top rounded-lg border border-line group-hover:border-cyanDim transition-colors"
                  />
                  <div className="absolute inset-0 rounded-lg bg-cyan/0 group-hover:bg-cyan/5 transition-colors" />
                </div>
              ))}
              {/* "Ghost" third photo hint */}
              <div className="relative w-16 h-20 rounded-lg border border-line/40 overflow-hidden">
                <img
                  src={profile.photos[2]}
                  alt={`Photo of ${profile.name}`}
                  className="w-full h-full object-cover object-top opacity-40 grayscale"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-[8px] text-cyan/60 tracking-widest">+1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {sent ? (
              <div className="bg-panel/80 backdrop-blur border border-cyanDim rounded-xl p-6 text-center">
                <p className="font-mono text-cyan text-sm">&gt; TRANSMISSION SENT</p>
                <p className="font-mono text-xs text-muted mt-2">Message routed to inbox.</p>
              </div>
            ) : (
              <>
                {(['name', 'email'] as const).map((field) => (
                  <input key={field} type={field === 'email' ? 'email' : 'text'}
                    placeholder={`> ${field.toUpperCase()}`}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required
                    className="w-full bg-panel/80 backdrop-blur border border-line rounded-lg px-4 py-2.5 font-mono text-sm text-text placeholder-muted focus:outline-none focus:border-cyan transition-colors" />
                ))}
                <textarea
                  placeholder="> MESSAGE"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full bg-panel/80 backdrop-blur border border-line rounded-lg px-4 py-2.5 font-mono text-sm text-text placeholder-muted focus:outline-none focus:border-cyan transition-colors resize-none" />
                <button type="submit"
                  className="w-full font-mono text-xs py-3 bg-cyan text-ink font-semibold rounded-lg hover:bg-cyan/80 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan">
                  &gt; TRANSMIT MESSAGE
                </button>
              </>
            )}
          </form>
        </div>
      </Section>
    </div>
  )
}
