'use client';

import Wire from './Wire';
import Bead from './Bead';
import { useSprings } from '@react-spring/three';
import { useGameStore } from '../store/gameStore';
import { useEffect } from 'react';

interface LaneProps {
    color: string;
    position: [number, number, number];
    laneId: string;
}

function getArcPosition(radius: number, angle: number): [number, number, number] {
    return [
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        0
    ];
}

export default function Lane({ color, position, laneId }: LaneProps) {
    const bigRadius = 1.2;
    const smallRadius = 0.8;
    const bigBeadSize = 0.15;
    const smallBeadSize = 0.08;

    // Global State
    const lane = useGameStore(state => state.lanes.find(l => l.id === laneId));
    const updateScore = useGameStore(state => state.updateScore);
    const updateSmallBeads = useGameStore(state => state.updateSmallBeads);

    // Derived state
    const bigBeadsRight = lane ? lane.bigBeads : 0;
    const smallBeadsRight = lane ? lane.smallBeads : 0;

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

    const handleBigBeadClick = (index: number) => {
        if (!lane) return;
        // Strict logic for Big Beads ONLY
        const currentCount = lane.bigBeads;
        // Logic fix: 
        // If clicking on Right side (already moved), move back to Left.
        // If clicking on Left side, move to Right.

        // Let's visualize: 
        // 7 Beads total. Indices 0..6.
        // Count = 0. All Left. (Right indices: none)
        // Click index 6. 
        // calculateNewScore(6, 0): isRight=false. return 7 - 7 = 0? Wait.
        // My previous logic: 7 - (6+1) = 0.
        // If I click 6, and I want 1 bead on right...
        // Formula should be: 7 - index. (7-6=1).

        // Let's re-verify Standard Abacus/Counter logic.
        // Usually clicking a bead toggles its side.

        // Scenario A: Count = 0. All Left.
        // Click index 6 (right-most). I want it to move Right. Count -> 1.
        // isRight check: 6 >= 7? False.
        // else branch: 
        // return 7 - 6 = 1. Correct.

        // Scenario B: Count = 1. Bead 6 is Right.
        // Click index 6. I want to move it Left. Count -> 0.
        // isRight check: 6 >= (7-1=6)? True.
        // if branch:
        // return 7 - (6+1) = 0. Correct.

        const isRight = index >= (7 - currentCount);
        let newScore = 0;

        if (isRight) {
            // Move from Right to Left
            newScore = 7 - (index + 1);
        } else {
            // Move from Left to Right
            newScore = 7 - index;
        }

        updateScore(lane.id, newScore);
    };

    const handleSmallBeadClick = (index: number) => {
        if (!lane) return;
        // Strict logic for Small Beads ONLY
        const currentCount = lane.smallBeads;
        const isRight = index >= (7 - currentCount);
        let newScore = 0;

        if (isRight) {
            newScore = 7 - (index + 1);
        } else {
            newScore = 7 - index;
        }

        if (updateSmallBeads) {
            updateSmallBeads(lane.id, newScore);
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


    if (!lane) return null;

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
                        onClick={(e) => { e.stopPropagation(); handleBigBeadClick(i); }}
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
                        onClick={(e) => { e.stopPropagation(); handleSmallBeadClick(i); }}
                    />
                ))}
            </group>
        </group>
    );
}
