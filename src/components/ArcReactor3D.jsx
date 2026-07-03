import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

/*
 * WebGL arc reactor — metallic casing, copper coil ring with emissive
 * windows, counter-spinning inner ring, glowing core with its own light.
 *
 * core        — 'triangle' | 'circle'
 * extRotation — optional framer-motion MotionValue (degrees, SVG screen
 *               convention) that drives the coil ring, e.g. the mission-log
 *               scroll spring. Read per-frame, no subscriptions.
 * tiltX/tiltY — optional MotionValues (-1..1, y-up) for pointer tilt when the
 *               canvas can't receive pointer events itself
 * reduce      — prefers-reduced-motion: render one static frame
 */

const COIL_COUNT = 10
const TICK_COUNT = 60

function polar(r, deg) {
  const a = (deg * Math.PI) / 180
  return [r * Math.cos(a), r * Math.sin(a), 0]
}

function TriangleCore() {
  const geo = useMemo(() => {
    const R = 0.44
    const shape = new THREE.Shape()
    const pts = [90, 210, 330].map((d) => polar(R, d))
    shape.moveTo(pts[0][0], pts[0][1])
    shape.lineTo(pts[1][0], pts[1][1])
    shape.lineTo(pts[2][0], pts[2][1])
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3 })
  }, [])
  return (
    <mesh geometry={geo} position={[0, -0.04, 0.06]}>
      <meshStandardMaterial color="#9FEDF7" emissive="#3CCFE0" emissiveIntensity={1.7} metalness={0.1} roughness={0.2} />
    </mesh>
  )
}

function Reactor({ core, extRotation, tiltX, tiltY, reduce, pulseRef }) {
  const coilGroup = useRef(null)
  const innerGroup = useRef(null)
  const wholeGroup = useRef(null)
  const coreMesh = useRef(null)

  const coils = useMemo(() => Array.from({ length: COIL_COUNT }, (_, i) => (i * 360) / COIL_COUNT), [])
  const ticks = useMemo(() => Array.from({ length: TICK_COUNT }, (_, i) => (i * 360) / TICK_COUNT), [])

  useFrame((state, delta) => {
    if (reduce) return
    const t = state.clock.elapsedTime

    // coil ring: scroll-driven when a motion value is wired in, else idle spin
    if (coilGroup.current) {
      if (extRotation) {
        // SVG screen degrees (y-down, clockwise+) → three.js z-rotation (y-up)
        coilGroup.current.rotation.z = THREE.MathUtils.degToRad(-extRotation.get()) + t * 0.06
      } else {
        coilGroup.current.rotation.z -= delta * 0.14
      }
    }
    if (innerGroup.current) innerGroup.current.rotation.z += delta * 0.4

    // idle wobble + pointer tilt sell the depth
    if (wholeGroup.current) {
      const px = tiltX ? tiltX.get() : state.pointer.x
      const py = tiltY ? tiltY.get() : state.pointer.y
      wholeGroup.current.rotation.x = THREE.MathUtils.lerp(wholeGroup.current.rotation.x, -py * 0.32 + Math.sin(t * 0.5) * 0.05, 0.06)
      wholeGroup.current.rotation.y = THREE.MathUtils.lerp(wholeGroup.current.rotation.y, px * 0.38 + Math.sin(t * 0.34) * 0.07, 0.06)
    }

    // core pulse
    if (coreMesh.current) {
      const s = 1 + Math.sin(t * 2.6) * 0.045
      coreMesh.current.scale.setScalar(s)
    }
    if (pulseRef.current) pulseRef.current.intensity = 7 + Math.sin(t * 2.6) * 2
  })

  return (
    <group ref={wholeGroup}>
      {/* back plate — solid so the reactor reads as a physical object */}
      <mesh position={[0, 0, -0.16]}>
        <circleGeometry args={[1.46, 64]} />
        <meshStandardMaterial color="#151009" metalness={0.85} roughness={0.5} />
      </mesh>

      {/* outer casing */}
      <mesh>
        <torusGeometry args={[1.5, 0.15, 24, 96]} />
        <meshStandardMaterial color="#2A1F10" metalness={0.92} roughness={0.34} />
      </mesh>
      {/* gold rim accent */}
      <mesh position={[0, 0, 0.13]}>
        <torusGeometry args={[1.5, 0.022, 12, 96]} />
        <meshStandardMaterial color="#B9860F" emissive="#B9860F" emissiveIntensity={0.35} metalness={1} roughness={0.25} />
      </mesh>

      {/* tick ring (static, part of casing) */}
      {ticks.map((deg, i) => (
        <mesh key={deg} position={polar(1.3, deg)} rotation={[0, 0, (deg * Math.PI) / 180]}>
          <boxGeometry args={[i % 5 === 0 ? 0.085 : 0.05, 0.016, 0.02]} />
          <meshStandardMaterial color="#C89A3A" metalness={0.9} roughness={0.3} emissive="#8A5A0C" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* coil ring */}
      <group ref={coilGroup}>
        <mesh>
          <torusGeometry args={[1.02, 0.05, 12, 72]} />
          <meshStandardMaterial color="#221808" metalness={0.9} roughness={0.4} />
        </mesh>
        {coils.map((deg) => (
          <group key={deg} position={polar(1.02, deg)} rotation={[0, 0, ((deg + 90) * Math.PI) / 180]}>
            {/* copper winding block */}
            <mesh>
              <boxGeometry args={[0.3, 0.17, 0.12]} />
              <meshStandardMaterial color="#B87333" metalness={0.95} roughness={0.32} />
            </mesh>
            {/* emissive window */}
            <mesh position={[0, 0, 0.07]}>
              <boxGeometry args={[0.2, 0.09, 0.015]} />
              <meshStandardMaterial color="#BFF6FB" emissive="#22B8C4" emissiveIntensity={1.9} metalness={0.2} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* inner ring + struts */}
      <group ref={innerGroup}>
        <mesh>
          <torusGeometry args={[0.72, 0.03, 12, 64]} />
          <meshStandardMaterial color="#173A3E" emissive="#22B8C4" emissiveIntensity={1.1} metalness={0.6} roughness={0.35} />
        </mesh>
        {[30, 150, 270].map((deg) => (
          <mesh key={deg} position={polar(0.56, deg)} rotation={[0, 0, ((deg + 90) * Math.PI) / 180]}>
            <boxGeometry args={[0.05, 0.3, 0.05]} />
            <meshStandardMaterial color="#2A1F10" metalness={0.9} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* core halo */}
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[0.52, 48]} />
        <meshBasicMaterial color="#0E7C86" transparent opacity={0.5} />
      </mesh>

      {/* core */}
      {core === 'triangle' ? (
        <group ref={coreMesh}>
          <TriangleCore />
        </group>
      ) : (
        <mesh ref={coreMesh} position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial color="#9FEDF7" emissive="#3CCFE0" emissiveIntensity={1.9} metalness={0.1} roughness={0.15} />
        </mesh>
      )}
    </group>
  )
}

export default function ArcReactor3D({ core = 'circle', extRotation = null, tiltX = null, tiltY = null, className = '', style = {} }) {
  const wrapRef = useRef(null)
  const pulseRef = useRef(null)
  const [visible, setVisible] = useState(true)
  const reduce = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // pause the render loop when scrolled offscreen
  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible && !reduce ? 'always' : 'demand'}
        camera={{ position: [0, 0, 4.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.55} color="#FFE9C4" />
        <directionalLight position={[2.5, 3, 4]} intensity={1.4} color="#F5D9A0" />
        <directionalLight position={[-3, -2, 2]} intensity={0.4} color="#22B8C4" />
        <pointLight ref={pulseRef} position={[0, 0, 1.1]} intensity={8} distance={6} color="#7DE8F5" />
        <Reactor core={core} extRotation={extRotation} tiltX={tiltX} tiltY={tiltY} reduce={reduce} pulseRef={pulseRef} />
      </Canvas>
    </div>
  )
}
