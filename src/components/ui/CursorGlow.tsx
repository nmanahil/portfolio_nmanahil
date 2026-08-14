import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let currentX = x
    let currentY = y
    let rafId: number

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
    }

    const animate = () => {
      // Smooth lerp so the glow lags slightly behind cursor
      currentX += (x - currentX) * 0.08
      currentY += (y - currentY) * 0.08
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`
      }
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 z-0"
      style={{
        width: 600,
        height: 600,
        marginLeft: -300,
        marginTop: -300,
        background: 'radial-gradient(circle, rgba(79,209,197,0.06) 0%, rgba(79,209,197,0.02) 40%, transparent 70%)',
        borderRadius: '50%',
        willChange: 'transform',
      }}
    />
  )
}
