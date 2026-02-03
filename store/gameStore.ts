import { create } from 'zustand';

export interface LaneState {
    id: string; // 'green', 'yellow', etc.
    name: string;
    bigBeads: number; // 0 to 7
    smallBeads: number; // 0 to 7
}

interface GameState {
    lanes: LaneState[];

    // Actions
    updateScore: (laneId: string, count: number) => void;
    updateSmallBeads: (laneId: string, count: number) => void;
    updateName: (laneId: string, name: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
    lanes: [
        { id: 'green', name: 'Grün', bigBeads: 0, smallBeads: 0 },
        { id: 'yellow', name: 'Gelb', bigBeads: 0, smallBeads: 0 },
        { id: 'blue', name: 'Blau', bigBeads: 0, smallBeads: 0 },
        { id: 'red', name: 'Rot', bigBeads: 0, smallBeads: 0 },
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

    updateName: (laneId, name) => set((state) => ({
        lanes: state.lanes.map(l =>
            l.id === laneId ? { ...l, name } : l
        )
    })),
}));
