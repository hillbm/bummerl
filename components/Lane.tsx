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

    const handleBeadClick = (index: number, type: 'big' | 'small') => {
        const currentCount = type === 'big' ? bigBeadsRight : smallBeadsRight;
        const isRight = index >= (7 - currentCount);
        let newScore = currentCount;

        if (isRight) {
            newScore = 7 - index;
        } else {
            // If clicking on left side, move it to right.
            // e.g. click 0 -> 7 beads total? No.
            // Standard Abacus:
            // 0 1 2 3 [4 5 6]
            // if I click 3 (left), I want 4 beads on right.
            // 7 - 3 = 4.

            // Wait, logic check:
            // array 0..6.
            // right count = 3. Beads 4,5,6 are on right.
            // indices 4,5,6 are isRight.
            // indices 0,1,2,3 are isLeft.
            // If I click 2 (left): I want 7 - 2 = 5 beads?
            // index 2 becomes rightmost of left side?
            // usually: click bead -> toggle its side.
            // STACK behavior:
            // moving bead i to right moves i+1...6 to right too.
            // moving bead i to left moves 0...i-1 to left too.

            // Simplify:
            // Click i.
            // If i is LEFT, move i and all >i to Right?
            // If i is RIGHT, move i and all <i to Left?

            // Let's stick to "Count" logic.
            // Value = N beads on right.
            // Indices 7-N to 6 are on Right.

            // If I click index i:
            // logic: set cut point at i.
            // if i is currently Left, set value so i is on Right.
            // New Value = 7 - i.

            // if i is currently Right, set value so i is on Left.
            // New Value = 7 - (i + 1).

            // Let's retry the boolean logic:
            if (isRight) {
                // It is on the right. User wants to move it left.
                // That means count decreases.
                // If I click index 6 (rightmost), count becomes 0?
                // If I click index 4 (leftmost of right stack), count becomes ?
                // Right stack: 4,5,6. Count=3.
                // Click 4. Move to left.
                // Right stack becomes 5,6. Count=2.
                // Formula: (7 - 1) - index = 6 - 4 = 2. Correct.
                newScore = 7 - (index + 1);
            } else {
                // It is on the left. User wants to move it right.
                // Left stack: 0,1,2,3.
                // Click 3. Move to right.
                // Right stack becomes 3,4,5,6. Count=4.
                // Formula: 7 - 3 = 4. Correct.
                newScore = 7 - index;
            }
        }

        if (lane) {
            if (type === 'big') {
                updateScore(lane.id, newScore);
            } else {
                updateSmallBeads(lane.id, newScore);
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
