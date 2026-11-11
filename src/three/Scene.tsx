import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import type { Theme } from '../hooks/useTheme'
import { sceneState } from './sceneState'

// x and y are fractions of half the viewport. s is the scale.
const waypoints = [
  { x: 0.5, y: 0.05, s: 1 }, // home
  { x: -0.62, y: 0.2, s: 0.7 }, // work
  { x: 0.62, y: -0.1, s: 0.85 }, // skills
  { x: -0.58, y: 0, s: 0.95 }, // about
  { x: 0, y: 0, s: 1.4 }, // contact
]

const geometries = [
  <torusKnotGeometry key="knot" args={[0.62, 0.22, 220, 32]} />,
  <icosahedronGeometry key="ico" args={[1, 0]} />,
  <torusGeometry key="torus" args={[0.8, 0.3, 32, 100]} />,
  <octahedronGeometry key="octa" args={[1.1, 0]} />,
  <dodecahedronGeometry key="dodeca" args={[0.95, 0]} />,
]

const themeLook = {
  light: { color: new THREE.Color('#1a1a1a'), metalness: 0.5, roughness: 0.22 },
  dark: { color: new THREE.Color('#e6e6e6'), metalness: 0.95, roughness: 0.18 },
}

function Shapes({ theme }: { theme: Theme }) {
  const outer = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const meshes = useRef<(THREE.Mesh | null)[]>([])
  const weights = useRef<number[]>(
    geometries.map((_, i) => (i === sceneState.section ? 1 : 0)),
  )
  const base = useRef<{ x: number; y: number; s: number } | null>(null)
  const { viewport } = useThree()

  const reduced = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const [material] = useState(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: themeLook[theme].color.clone(),
        metalness: themeLook[theme].metalness,
        roughness: themeLook[theme].roughness,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const g = outer.current
    const sp = spin.current
    if (!g || !sp) return
    const { damp, clamp } = THREE.MathUtils

    // Where the object should be for the current section
    const narrow = viewport.width < 5.2
    const wp = waypoints[sceneState.section]
    const tx = (narrow ? wp.x * 0.3 : wp.x) * (viewport.width / 2)
    const ty = (wp.y + (narrow ? 0.3 : 0)) * (viewport.height / 2)
    const ts = wp.s * (narrow ? 0.62 : 1)

    if (!base.current) base.current = { x: tx, y: ty, s: ts }
    const b = base.current
    b.x = damp(b.x, tx, 2.4, delta)
    b.y = damp(b.y, ty, 2.4, delta)
    b.s = damp(b.s, ts, 2.4, delta)

    const intro = sceneState.intro
    const bob = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.9) * 0.1
    g.position.set(b.x, b.y + bob, 0)
    g.scale.setScalar(Math.max(b.s * intro, 0.0001))

    // Tilt toward the cursor
    g.rotation.y = damp(g.rotation.y, state.pointer.x * 0.45, 3, delta)
    g.rotation.x = damp(g.rotation.x, -state.pointer.y * 0.3, 3, delta)

    // Spin faster while scrolling, and during the intro
    sceneState.velocity = damp(sceneState.velocity, 0, 4, delta)
    const v = clamp(sceneState.velocity / 1200, -3, 3)
    if (reduced) {
      sp.rotation.y += delta * 0.05
    } else {
      sp.rotation.y += delta * (0.25 + (1 - intro) * 5 + v * 1.2)
      sp.rotation.x += delta * (0.1 + v * 0.6)
    }

    // Swap shapes: the active one grows, the others shrink
    geometries.forEach((_, i) => {
      const m = meshes.current[i]
      if (!m) return
      const target = i === sceneState.section ? 1 : 0
      const w = damp(weights.current[i], target, 5, delta)
      weights.current[i] = w
      const e = w * w * (3 - 2 * w)
      m.visible = e > 0.005
      m.scale.setScalar(Math.max(e, 0.0001))
    })

    // Light and dark material
    const look = themeLook[theme]
    material.color.lerp(look.color, 1 - Math.exp(-4 * delta))
    material.metalness = damp(material.metalness, look.metalness, 4, delta)
    material.roughness = damp(material.roughness, look.roughness, 4, delta)
  })

  return (
    <group ref={outer}>
      <group ref={spin}>
        {geometries.map((geometry, i) => (
          <mesh
            key={i}
            material={material}
            ref={(el) => {
              meshes.current[i] = el
            }}
          >
            {geometry}
          </mesh>
        ))}
      </group>
    </group>
  )
}

// Tweak these two to taste
const MAX_BLUR = 14 // px of blur once you've left the hero
const BG_OPACITY = 0.28 // how visible the object stays in the background

// Blurs and fades the canvas as you scroll away from the hero
// Hidden on the hero, then fades in blurred behind the other sections
function Focus({ target }: { target: RefObject<HTMLDivElement | null> }) {
  const amount = useRef(0)

  useFrame((_, delta) => {
    const el = target.current
    if (!el) return

    const vh = window.innerHeight
    // 0 = on the hero (hidden), 1 = in the other sections (blurred background)
    const raw = THREE.MathUtils.clamp(
      (window.scrollY - vh * 0.3) / (vh * 0.6),
      0,
      1,
    )

    amount.current = THREE.MathUtils.damp(amount.current, raw, 6, delta)
    const a = amount.current

    el.style.filter = `blur(${(a * MAX_BLUR).toFixed(1)}px)`
    el.style.opacity = String(BG_OPACITY * a)
    el.style.visibility = a < 0.01 ? 'hidden' : 'visible'
  })

  return null
}

export default function Scene({ theme }: { theme: Theme }) {
  const wrapper = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={wrapper}
      className="pointer-events-none fixed inset-0 z-[15]"
      style={{ willChange: 'filter, opacity' }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        eventSource={document.getElementById('root')!}
        eventPrefix="client"
      >
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={3}
            position={[0, 5, -6]}
            scale={[14, 4, 1]}
          />
          <Lightformer
            form="rect"
            intensity={2}
            position={[-6, 1, 2]}
            rotation-y={Math.PI / 2}
            scale={[8, 4, 1]}
          />
          <Lightformer
            form="rect"
            intensity={2}
            position={[6, 0, 2]}
            rotation-y={-Math.PI / 2}
            scale={[8, 4, 1]}
          />
          <Lightformer
            form="ring"
            intensity={4}
            position={[0, -4, 3]}
            rotation-x={Math.PI / 2}
            scale={3}
          />
        </Environment>
        <Shapes theme={theme} />
        <Focus target={wrapper} />
      </Canvas>
    </div>
  )

}