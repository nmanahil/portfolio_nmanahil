import { useEffect, useRef, useState } from 'react'

const BOOT_LINES = [
  { text: 'BIOS v2.4.1 — ACCESS_CONSOLE SYSTEM', delay: 0 },
  { text: 'Initializing secure kernel...', delay: 600 },
  { text: 'Loading identity matrix...', delay: 1200 },
  { text: 'Scanning biometric signature...', delay: 1900 },
  { text: 'Cross-referencing IAM policy database...', delay: 2700 },
  { text: 'Clearance level: ALPHA-7', delay: 3400 },
]

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [showGranted, setShowGranted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Matrix rain on boot canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cols = Math.floor(canvas.width / 20)
    const drops = Array(cols).fill(1)
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ'

    const draw = () => {
      ctx.fillStyle = 'rgba(10,15,20,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(79,209,197,0.15)'
      ctx.font = '14px IBM Plex Mono, monospace'
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * 20, y * 20)
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }
    const id = setInterval(draw, 50)
    return () => clearInterval(id)
  }, [])

  // Schedule lines appearing
  useEffect(() => {
    BOOT_LINES.forEach(({ delay }, i) => {
      setTimeout(() => setVisibleLines((prev) => [...prev, i]), delay)
    })
    // Show ACCESS GRANTED
    setTimeout(() => setShowGranted(true), 4400)
    // Fade out and call onDone
    setTimeout(() => setFadeOut(true), 5800)
    setTimeout(() => onDone(), 6400)
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center transition-opacity duration-600 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ transition: 'opacity 0.6s ease' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Terminal window chrome */}
        <div className="bg-panel border border-line rounded-xl overflow-hidden shadow-2xl border-glow">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-panel2 border-b border-line">
            <span className="w-3 h-3 rounded-full bg-danger/70" />
            <span className="w-3 h-3 rounded-full bg-amber/70" />
            <span className="w-3 h-3 rounded-full bg-cyan/70" />
            <span className="font-mono text-xs text-muted ml-3 tracking-widest">ACCESS_CONSOLE — SECURE_BOOT</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 min-h-[260px] font-mono text-sm space-y-2">
            {BOOT_LINES.map(({ text }, i) => (
              <div
                key={i}
                className={`flex gap-3 transition-all duration-300 ${visibleLines.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
              >
                <span className="text-cyanDim select-none">$</span>
                <span className={i === BOOT_LINES.length - 1 ? 'text-amber' : 'text-muted'}>{text}</span>
                {i === visibleLines[visibleLines.length - 1] && !showGranted && (
                  <span className="cursor-blink text-cyan">▋</span>
                )}
              </div>
            ))}

            {showGranted && (
              <div className="pt-4 pb-2 text-center">
                <div className="glitch-granted font-mono font-bold text-cyan tracking-[0.3em]"
                  data-text="ACCESS GRANTED"
                  style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', textShadow: '0 0 30px rgba(79,209,197,0.8), 0 0 60px rgba(79,209,197,0.4)' }}>
                  ACCESS GRANTED
                </div>
                <p className="font-mono text-xs text-muted mt-3 tracking-widest animate-pulse">
                  INITIALIZING PORTFOLIO INTERFACE...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
