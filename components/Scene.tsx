'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import BummerlMachine from './BummerlMachine';
import { Suspense } from 'react';

function ResponsiveGroup({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  const isPortrait = viewport.height > viewport.width;

  // Machine dimensions estimate (based on Lanes x: -1.5 to 1.5 + base padding)
  // Approx Width: 4.5 units
  // Approx Height/Depth: 3 units (looking from angle)

  // We want to fit ~5 units horizontally and ~5 units vertically to be safe
  const TARGET_SIZE = 5;

  // Calculate scale to fit the viewport
  // If viewport is small (portrait phone), width is the bottleneck.
  // If viewport is wide (desktop), height is usually the bottleneck.
  const scale = Math.min(viewport.width / TARGET_SIZE, viewport.height / TARGET_SIZE) * 0.95; // 0.95 for padding

  // Vertical Alignment Logic:
  // Portrait: "aligned on the bottom of the first third".
  // Viewport Height = H. Center = 0.
  // Top edge = H/2. Bottom edge = -H/2.
  // First third (top) range: [H/6, H/2]. Bottom of first third is Y = H/6.
  // We shift the center of the machine (Y=0) to Y=H/6.
  // Update: User requested to move it up by 10% more.
  // New Y (Landscape) = H*0.2
  const yOffset = isPortrait ? (viewport.height / 6) + (viewport.height * 0.1) : (viewport.height * 0.2);

  return (
    <group scale={scale} position={[0, yOffset, 0]}>
      {children}
    </group>
  );
}

export default function Scene() {
  return (
    <div className="h-full w-full">
      <Canvas
        shadows
        // Adjust camera position to "look down" at the centered object from a slight angle (approx 30 deg)
        camera={{ position: [4, 5, 7], fov: 45 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />

          <ResponsiveGroup>
            <Center>
              <BummerlMachine />
            </Center>
          </ResponsiveGroup>

          {/* Shadows at y=0, outside scaling group to keep soft shadow constant or scale with it? 
              Scaling shadow with object is better physically.
          */}


          <OrbitControls
            makeDefault
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            minDistance={2.5}
            maxDistance={15}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
