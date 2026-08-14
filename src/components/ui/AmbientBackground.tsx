import { useEffect, useRef } from 'react'

const COMMANDS = [
  '$ git push origin main',
  '> SELECT * FROM users',
  '$ docker build -t app .',
  '> npm run deploy',
  '$ ssh admin@10.0.0.1',
  '> kubectl get pods',
  '$ az ad group sync',
  '> chmod 600 id_rsa',
  '$ ping 8.8.8.8',
  '> grep -r "AUTH" logs/',
  '$ curl -X POST /api',
  '> export TOKEN=$JWT',
  '$ ps aux | grep node',
  '> netstat -tulpn',
  '$ openssl req -new',
  '> git log --oneline',
  '$ python3 train.py',
  '$ nmap -sV 10.0.0.0/24',
  '> tail -f /var/log/auth',
  '$ terraform apply',
  '> iptables -L -n',
  '$ vercel --prod',
  '> whoami && id',
  '$ jest --coverage',
  '> traceroute 1.1.1.1',
  '$ make && make install',
  '> crontab -e',
  '$ dig +short MX domain',
  '> history | grep sudo',
  '$ env | grep SECRET',
  '> base64 -d token.txt',
  '$ strace -p 1234',
]

// Generate evenly distributed positions across the full page
// Use a seeded-like deterministic spread so they don't cluster
const ROWS = 16
const COLS = 5
const ITEMS = ROWS * COLS

const staticCmds = Array.from({ length: ITEMS }, (_, i) => {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  const offsetX = ((i * 137) % 18) - 9
  const offsetY = ((i * 97)  % 14) - 7
  return {
    text: COMMANDS[i % COMMANDS.length],
    left: (col / COLS) * 88 + 4 + offsetX,
    // spread over 800vh so commands appear throughout the whole scrollable page
    top: (row / ROWS) * 800 + (800 / ROWS / 2) + offsetY,
    amber: i % 6 === 0,
    glitchDelay: (i * 1.3) % 12,
    glitchDuration: 0.08 + (i % 3) * 0.04,
  }
})

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Canvas: circuit corner traces only — no rain
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = window.innerWidth
    let H = window.innerHeight

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    resize()
    window.addEventListener('resize', resize)

    const drawTraces = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(79,209,197,0.08)'
      ctx.lineWidth = 1
      const shapes = [
        [[0,55],[38,55],[38,75],[78,75]],
        [[0,115],[28,115],[28,95],[68,95],[68,135],[98,135]],
        [[18,0],[18,38],[58,38],[58,18],[88,18]],
        [[W,H-55],[W-38,H-55],[W-38,H-75],[W-78,H-75]],
        [[W,H-115],[W-28,H-115],[W-28,H-95],[W-68,H-95],[W-68,H-135],[W-98,H-135]],
        [[W-18,H],[W-18,H-38],[W-58,H-38],[W-58,H-18],[W-88,H-18]],
      ]
      shapes.forEach(pts => {
        ctx.beginPath()
        pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
        ctx.stroke()
        pts.forEach(([x, y]) => {
          ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(79,209,197,0.18)'; ctx.fill()
        })
      })
    }

    drawTraces()
    window.addEventListener('resize', drawTraces)
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('resize', drawTraces) }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Static commands scattered across the full scrollable page */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ minHeight: '100%' }}>
        {staticCmds.map((cmd, i) => (
          <span
            key={i}
            className="absolute font-mono select-none whitespace-nowrap"
            style={{
              left: `${cmd.left}%`,
              top: `${cmd.top}vh`,
              fontSize: '11px',
              color: cmd.amber ? 'rgba(232,169,76,0.22)' : 'rgba(79,209,197,0.18)',
              letterSpacing: '0.04em',
              animationName: 'cmdGlitch',
              animationDuration: `${cmd.glitchDuration}s`,
              animationDelay: `${cmd.glitchDelay}s`,
              animationTimingFunction: 'steps(1)',
              animationIterationCount: 'infinite',
              animationDirection: 'normal',
            }}
          >
            {cmd.text}
          </span>
        ))}
      </div>
    </>
  )
}
