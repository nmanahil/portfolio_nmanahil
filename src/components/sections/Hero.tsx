import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../../data/resume'

export default function Hero() {
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (photoRef.current)
        photoRef.current.style.transform = `translateY(${window.scrollY * 0.2}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: 'linear-gradient(#4FD1C5 1px, transparent 1px), linear-gradient(90deg, #4FD1C5 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="scanline absolute inset-0 z-10 pointer-events-none" />

      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-16 flex flex-col md:flex-row items-center gap-12 md:gap-20">

        {/* Left: text */}
        <div className="flex-1 min-w-0">
          {/* Status line */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-3 mb-6 font-mono text-xs text-muted"
          >
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="text-cyan tracking-widest">SESSION ACTIVE</span>
            <span className="text-line">·</span>
            <span>{profile.location}</span>
          </motion.div>

          {/* Glitch name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glitch font-mono font-bold text-text text-glow mb-3 leading-none"
            data-text={profile.name}
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
          >
            {profile.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="font-mono text-cyan text-lg md:text-xl mb-4 tracking-wide"
          >
            {profile.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-muted text-sm md:text-base max-w-lg leading-relaxed mb-8"
          >
            {profile.tagline}
          </motion.p>

          {/* Tech tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {['Azure IAM', 'PowerShell', 'Microsoft Graph', 'Cloud Security', 'TypeScript'].map((tag) => (
              <span key={tag} className="font-mono text-[10px] px-2.5 py-1 border border-cyanDim/50 text-cyanDim rounded tracking-wider">
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-mono text-xs px-5 py-2.5 bg-cyan text-ink font-semibold rounded hover:bg-cyan/80 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan"
            >
              &gt; OPEN CHANNEL
            </button>
            <button
              onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-mono text-xs px-5 py-2.5 border border-line text-muted rounded hover:border-cyan hover:text-cyan transition-colors focus:outline-none focus:ring-2 focus:ring-cyan"
            >
              &gt; VIEW AUDIT LOG
            </button>
          </motion.div>
        </div>

        {/* Right: sticker photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          className="flex-shrink-0 relative"
        >
          <div ref={photoRef} className="will-change-transform">
            {/* Outer glow rings */}
            <div className="absolute -inset-6 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(79,209,197,0.3) 0%, transparent 70%)' }} />

            {/* Corner brackets — circuit board aesthetic */}
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-cyan/60 rounded-tl" />
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-cyan/60 rounded-tr" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-cyan/60 rounded-bl" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-cyan/60 rounded-br" />

            {/* Sticker-style photo */}
            <div className="relative w-64 md:w-80" style={{ aspectRatio: '9/14' }}>
              <img
                src={profile.photos[0]}
                alt="Manahil Nawaz"
                className="w-full h-full object-cover object-top"
                style={{
                  borderRadius: '12px',
                  filter: 'contrast(1.05) saturate(0.9)',
                  boxShadow: '0 0 0 1px rgba(79,209,197,0.2), 0 0 40px rgba(79,209,197,0.1), 0 20px 60px rgba(0,0,0,0.6)',
                }}
              />
              {/* Cyan tint overlay */}
              <div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(10,15,20,0.7) 100%)', borderRadius: '12px' }} />

              {/* ID badge overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-ink/85 backdrop-blur border border-cyan/30 rounded-lg px-3 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[9px] text-cyan tracking-[0.2em]">IDENTITY VERIFIED</p>
                    <p className="font-mono text-xs text-text font-medium mt-0.5">{profile.name}</p>
                  </div>
                  <div className="w-6 h-6 rounded border border-cyan/40 flex items-center justify-center">
                    <span className="text-cyan text-[10px]">✓</span>
                  </div>
                </div>
              </div>

              {/* Scan line effect on photo */}
              <div className="absolute inset-0 rounded-xl pointer-events-none scanline opacity-30" />
            </div>

            {/* Floating data tags */}
            <div className="absolute -right-16 top-8 font-mono text-[9px] text-cyan/50 space-y-1 hidden md:block">
              <div>UID: MN-2024</div>
              <div>CLR: ALPHA</div>
              <div>LOC: BUD</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-mono text-[10px] text-muted tracking-widest">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-cyan/50 to-transparent" />
      </div>
    </section>
  )
}
