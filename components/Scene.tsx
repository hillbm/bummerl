'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import BummerlMachine from './BummerlMachine';
import { Suspense } from 'react';

function MachineWrapper() {
  const { viewport } = useThree();
  const isLandscape = viewport.width > viewport.height;

  const position: [number, number, number] = isLandscape ? [0, 0, 0] : [0, 1.2, 0];
  const scale = isLandscape ? 1.2 : 0.9;

  return (
    <>
      <group position={position} scale={scale}>
        <BummerlMachine />
      </group>

      <ContactShadows
        position={position}
        opacity={0.4}
        scale={10}
        blur={1.5}
        far={1}
      />
    </>
  );
}

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

          <MachineWrapper />

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
