'use client';

interface WireProps {
    radius: number;
    tube: number;
    position: [number, number, number];
}

export default function Wire({ radius, tube, position }: WireProps) {
    return (
        <group position={position}>
            <mesh rotation={[0, 0, 0]} castShadow receiveShadow>
                <torusGeometry args={[radius, tube, 12, 48, Math.PI]} />
                <meshStandardMaterial
                    color="#b87333"
                    metalness={0.9}
                    roughness={0.2}
                />
            </mesh>
        </group>
    );
}
