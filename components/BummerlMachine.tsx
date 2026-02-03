'use client';

import Lane from './Lane';

import { useTexture } from '@react-three/drei';

// Configuration for the 4 lanes
const LANES = [
    { id: 'green', color: '#22c55e', x: -1.5 },
    { id: 'yellow', color: '#eab308', x: -0.5 },
    { id: 'black', color: '#1f2937', x: 0.5 },
    { id: 'red', color: '#ef4444', x: 1.5 },
];

function BaseMaterial() {
    const texture = useTexture('base_wood.png');
    // Tint the light wood texture to be more brown/warm
    return <meshStandardMaterial map={texture} color="#e6c288" roughness={0.5} />;
}

export default function BummerlMachine() {
    return (
        <group>
            {/* Wooden Base */}
            <mesh receiveShadow castShadow position={[0, -0.2, 0]}>
                <boxGeometry args={[5, 0.4, 3]} />
                <BaseMaterial />
            </mesh>

            {/* Lanes */}
            {LANES.map((lane) => (
                <Lane key={lane.id} color={lane.color} position={[lane.x, 0, 0]} laneId={lane.id} />
            ))}
        </group>
    );
}
