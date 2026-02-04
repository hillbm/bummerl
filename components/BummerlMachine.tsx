'use client';

import Lane from './Lane';

import { useTexture, Decal } from '@react-three/drei';

// Configuration for the 4 lanes
const LANES = [
    { id: 'green', color: '#22c55e', x: -1.5 },
    { id: 'yellow', color: '#eab308', x: -0.5 },
    { id: 'blue', color: '#2563eb', x: 0.5 },
    { id: 'red', color: '#ef4444', x: 1.5 },
];

function BaseMaterial() {
    const texture = useTexture('base_wood.png');
    // Tint the light wood texture to be more brown/warm
    return <meshStandardMaterial map={texture} color="#e6c288" roughness={0.5} />;
}

export default function BummerlMachine() {
    const logo = useTexture('/branding_logo.png');

    return (
        <group>
            {/* Wooden Base */}
            <mesh receiveShadow castShadow position={[0, -0.2, 0]}>
                <boxGeometry args={[5, 0.4, 3]} />
                <BaseMaterial />
                <Decal
                    position={[-1.8, 0, 1.5]}
                    rotation={[0, 0, 0]}
                    scale={[1.2, 0.25, 1]}
                >
                    <meshStandardMaterial
                        map={logo}
                        transparent
                        opacity={0.35}
                        roughness={1}
                        polygonOffset
                        polygonOffsetFactor={-1}
                        depthWrite={false}
                        bumpMap={logo}
                        bumpScale={-0.08}
                    />
                </Decal>
            </mesh>

            {/* Lanes */}
            {LANES.map((lane) => (
                <Lane key={lane.id} color={lane.color} position={[lane.x, 0, 0]} laneId={lane.id} />
            ))}
        </group>
    );
}
