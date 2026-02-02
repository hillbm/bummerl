'use client';

import { ThreeEvent } from '@react-three/fiber';
import { animated, SpringValue } from '@react-spring/three';

interface BeadProps {
    color: string;
    size: number;
    position: SpringValue<[number, number, number]> | [number, number, number];
    onClick?: (e: ThreeEvent<MouseEvent>) => void;
}

import { useTexture } from '@react-three/drei';

export default function Bead({ color, size, position, onClick }: BeadProps) {
    const texture = useTexture('bead_texture.png');

    return (
        <animated.mesh
            position={position as unknown as [number, number, number]}
            castShadow
            receiveShadow
            onClick={onClick}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
        >
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial
                map={texture}
                color={color}
                roughness={0.2}
                metalness={0.1}
            />
        </animated.mesh>
    );
}
