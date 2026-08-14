import { useState } from 'react'
import { SECTIONS, useScrollProgress } from '../../hooks/useScrollProgress'

export default function StatusBar() {
  const { activeSection, scrollProgress } = useScrollProgress()
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-panel/90 backdrop-blur border-b border-line">
      {/* Progress bar */}
      <div
        className="h-[2px] bg-cyan transition-all duration-150"
        style={{ width: `${scrollProgress * 100}%` }}
      />
      <div className="flex items-center justify-between px-6 py-2">
        <span className="font-mono text-xs text-cyan tracking-widest">
          ACCESS_CONSOLE<span className="animate-pulse">_</span>
        </span>
        <nav className="hidden md:flex items-center gap-1" aria-label="Section navigation">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              aria-current={activeSection === id ? 'true' : undefined}
              className={`font-mono text-[10px] tracking-widest px-3 py-1 rounded transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan
                ${activeSection === id
                  ? 'text-cyan bg-cyanDim/20 border border-cyanDim'
                  : 'text-muted hover:text-text border border-transparent'
                }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-muted hidden sm:block">SYS:ONLINE</span>
          <button
            className="md:hidden font-mono text-xs text-muted hover:text-cyan transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan p-1 rounded"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t border-line bg-panel/95 backdrop-blur" aria-label="Mobile section navigation">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              aria-current={activeSection === id ? 'true' : undefined}
              className={`w-full text-left font-mono text-xs tracking-widest px-6 py-3 border-b border-line/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan
                ${activeSection === id ? 'text-cyan bg-cyanDim/10' : 'text-muted hover:text-text'}`}
            >
              &gt; {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}
