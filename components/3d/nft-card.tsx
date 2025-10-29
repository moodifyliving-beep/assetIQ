"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import { Suspense } from "react"

function NFTBox() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#6366f1"
        metalness={0.8}
        roughness={0.2}
        emissive="#4f46e5"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function NFTCardScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={false} />
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <NFTBox />
    </>
  )
}

export function NFTCard() {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
      <Suspense fallback={<div className="w-full h-full bg-slate-800" />}>
        <Canvas>
          <NFTCardScene />
        </Canvas>
      </Suspense>
    </div>
  )
}
