import { create } from 'zustand';

export interface LaneState {
    id: string; // 'green', 'yellow', etc.
    bigBeads: number; // 0 to 7
    smallBeads: number; // 0 to 7
}

interface GameState {
    lanes: LaneState[];

    // Actions
    updateScore: (laneId: string, count: number) => void;
    updateSmallBeads: (laneId: string, count: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
    lanes: [
        { id: 'green', bigBeads: 0, smallBeads: 0 },
        { id: 'yellow', bigBeads: 0, smallBeads: 0 },
        { id: 'black', bigBeads: 0, smallBeads: 0 },
        { id: 'red', bigBeads: 0, smallBeads: 0 },
    ],

    updateScore: (laneId, count) => set((state) => ({
        lanes: state.lanes.map(l =>
            l.id === laneId ? { ...l, bigBeads: count } : l
        )
    })),

    updateSmallBeads: (laneId, count) => set((state) => ({
        lanes: state.lanes.map(l =>
            l.id === laneId ? { ...l, smallBeads: count } : l
        )
    })),
}));
