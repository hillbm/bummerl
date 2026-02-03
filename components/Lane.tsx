'use client';

import Wire from './Wire';
import Bead from './Bead';
import { useSprings } from '@react-spring/three';
import { useGameStore } from '../store/gameStore';
import { useEffect } from 'react';

interface LaneProps {
    color: string;
    position: [number, number, number];
}

function getArcPosition(radius: number, angle: number): [number, number, number] {
    return [
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        0
    ];
}

export default function Lane({ color, position, playerId }: LaneProps & { playerId: string }) {
    const bigRadius = 1.2;
    const smallRadius = 0.8;
    const bigBeadSize = 0.15;
    const smallBeadSize = 0.08;

    // Global State
    const player = useGameStore(state => state.players.find(p => p.id === playerId));
    const updateScore = useGameStore(state => state.updateScore);
    const updateSmallBeads = useGameStore(state => state.updateSmallBeads);

    // Derived state
    const bigBeadsRight = player ? player.bigBeads : 0;
    const smallBeadsRight = player ? player.smallBeads : 0;

    // Constants
    const bigSpacing = 0.25; // Exact diameter/radius for touching
    const smallSpacing = 0.20; // 0.16/0.8 = 0.2 for touching

    // Calculate start angles so beads touch the "floor" (y=0) at the bottom
    // y_center = R * sin(theta)
    // we want y_bottom = 0 => y_center = bead_radius
    // theta = asin(bead_radius / lane_radius)
    const startAngleBig = Math.asin(bigBeadSize / bigRadius);
    const startAngleSmall = Math.asin(smallBeadSize / smallRadius);

    const endAngleBig = Math.PI - startAngleBig;
    const endAngleSmall = Math.PI - startAngleSmall;

    // Movement Config: Faster but damped (Critical Damping ~ sqrt(4*k*m))
    const moveConfig = { mass: 1, tension: 250, friction: 32 };

    // Big Beads Animation
    const [bigSprings, bigApi] = useSprings(7, (i) => {
        const threshold = 7 - bigBeadsRight;
        const isRight = i >= threshold;
        const angle = isRight
            ? endAngleBig - ((6 - i) * bigSpacing)
            : startAngleBig + (i * bigSpacing);
        return {
            angle,
            from: { angle },
            config: moveConfig
        };
    });

    // Small Beads Animation
    const [smallSprings, smallApi] = useSprings(7, (i) => {
        const threshold = 7 - smallBeadsRight;
        const isRight = i >= threshold;
        const angle = isRight
            ? endAngleSmall - ((6 - i) * smallSpacing)
            : startAngleSmall + (i * smallSpacing);
        return {
            angle,
            from: { angle },
            config: moveConfig
        };
    });

    const handleBeadClick = (index: number, type: 'big' | 'small') => {
        const currentCount = type === 'big' ? bigBeadsRight : smallBeadsRight;
        const isRight = index >= (7 - currentCount);
        let newScore = currentCount;

        if (isRight) {
            newScore = 7 - (index + 1);
        } else {
            newScore = 7 - index;
        }

        if (player) {
            if (type === 'big') {
                updateScore(player.id, newScore);
            } else {
                if (updateSmallBeads) {
                    updateSmallBeads(player.id, newScore);
                }
            }
        }
    };

    useEffect(() => {
        // Update Big Beads
        bigApi.start(i => {
            const threshold = 7 - bigBeadsRight;
            const isRight = i >= threshold;
            const targetAngle = isRight
                ? endAngleBig - ((6 - i) * bigSpacing)
                : startAngleBig + (i * bigSpacing);
            return { angle: targetAngle };
        });

        // Update Small Beads
        smallApi.start(i => {
            const threshold = 7 - smallBeadsRight;
            const isRight = i >= threshold;
            const targetAngle = isRight
                ? endAngleSmall - ((6 - i) * smallSpacing)
                : startAngleSmall + (i * smallSpacing);
            return { angle: targetAngle };
        });
    }, [bigBeadsRight, smallBeadsRight, bigApi, smallApi, startAngleBig, endAngleBig, bigSpacing, startAngleSmall, endAngleSmall, smallSpacing]);


    if (!player) return null;

    return (
        <group position={position} rotation={[0, Math.PI / 2, 0]}>
            <group>
                <Wire radius={bigRadius} tube={0.03} position={[0, 0, 0]} />
                {bigSprings.map((props, i) => (
                    <Bead
                        key={`big-${i}`}
                        color={color}
                        size={bigBeadSize}
                        // Interpolate position from angle
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        position={props.angle.to(a => getArcPosition(bigRadius, a)) as any}
                        onClick={(e) => { e.stopPropagation(); handleBeadClick(i, 'big'); }}
                    />
                ))}
            </group>

            <group>
                <Wire radius={smallRadius} tube={0.02} position={[0, 0, 0]} />
                {smallSprings.map((props, i) => (
                    <Bead
                        key={`small-${i}`}
                        color={color}
                        size={smallBeadSize}
                        // Interpolate position from angle
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        position={props.angle.to(a => getArcPosition(smallRadius, a)) as any}
                        onClick={(e) => { e.stopPropagation(); handleBeadClick(i, 'small'); }}
                    />
                ))}
            </group>
        </group>
    );
}
