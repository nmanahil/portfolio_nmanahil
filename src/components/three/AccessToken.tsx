import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Trail } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollProgress } from '../../hooks/useScrollProgress'

const SECTION_CONFIG: Record<string, { speed: number; color: string; distort: number }> = {
  hero:          { speed: 0.8,  color: '#4FD1C5', distort: 0.3 },
  about:         { speed: 0.4,  color: '#4FD1C5', distort: 0.2 },
  skills:        { speed: 1.2,  color: '#E8A94C', distort: 0.5 },
  experience:    { speed: 0.5,  color: '#4FD1C5', distort: 0.2 },
  projects:      { speed: 1.0,  color: '#E8A94C', distort: 0.4 },
  certifications:{ speed: 0.1,  color: '#4FD1C5', distort: 0.05 }, // "locks"
  leadership:    { speed: 0.6,  color: '#4FD1C5', distort: 0.25 },
  contact:       { speed: 0.3,  color: '#4FD1C5', distort: 0.15 },
}

function Token({ activeSection }: { activeSection: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const colorRef = useRef(new THREE.Color('#4FD1C5'))
  const targetColor = useRef(new THREE.Color('#4FD1C5'))
  const speedRef = useRef(0.8)
  const distortRef = useRef(0.3)
  const reducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const cfg = SECTION_CONFIG[activeSection] ?? SECTION_CONFIG.hero
    targetColor.current.set(cfg.color)
    speedRef.current = cfg.speed
    distortRef.current = cfg.distort
  }, [activeSection])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    if (!reducedMotion.current) {
      meshRef.current.rotation.y += delta * speedRef.current
      meshRef.current.rotation.x += delta * speedRef.current * 0.3
    }
    colorRef.current.lerp(targetColor.current, 0.05)
    const mat = meshRef.current.material as THREE.MeshStandardMaterial & { color: THREE.Color; distort: number }
    mat.color.copy(colorRef.current)
    mat.distort = THREE.MathUtils.lerp(mat.distort ?? 0.3, distortRef.current, 0.05)
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Trail width={0.5} length={4} color={new THREE.Color('#4FD1C5')} attenuation={(t) => t * t}>
        <mesh ref={meshRef} castShadow>
          <icosahedronGeometry args={[1.2, 1]} />
          <MeshDistortMaterial
            color="#4FD1C5"
            emissive="#2C6B67"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.1}
            distort={0.3}
            speed={2}
            wireframe={false}
          />
        </mesh>
      </Trail>
    </Float>
  )
}

function Scene({ activeSection }: { activeSection: string }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#4FD1C5" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#E8A94C" />
      <Token activeSection={activeSection} />
    </>
  )
}

export default function AccessToken() {
  const { activeSection } = useScrollProgress()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={canvasRef} className="fixed right-4 top-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 z-30 pointer-events-none opacity-60 md:opacity-80">
      {visible && (
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <Scene activeSection={activeSection} />
        </Canvas>
      )}
    </div>
  )
}
