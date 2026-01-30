'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import BummerlMachine from './BummerlMachine';
import { Suspense } from 'react';

export default function Scene() {
  return (
    <div className="h-screen w-full bg-slate-50">
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 45 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />

          <group position={[0, 1.0, 0]} scale={0.7}>
            <BummerlMachine />
          </group>

          <ContactShadows
            position={[0, 1.0, 0]}
            opacity={0.4}
            scale={10}
            blur={1.5}
            far={1}
          />

          <OrbitControls
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
