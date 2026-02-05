import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LaneState {
    id: string; // 'green', 'yellow', etc.
    name: string;
    bigBeads: number; // 0 to 7
    smallBeads: number; // 0 to 7
}

export interface SavedGame {
    id: string;
    name: string;
    timestamp: number;
    lanes: LaneState[];
}

interface GameState {
    lanes: LaneState[];
    savedGames: SavedGame[];

    // Actions
    updateScore: (laneId: string, count: number) => void;
    updateSmallBeads: (laneId: string, count: number) => void;
    updateName: (laneId: string, name: string) => void;

    // Save/Load Actions
    saveGame: (name: string, overwriteId?: string) => void;
    loadGame: (id: string) => void;
    deleteGame: (id: string) => void;
    resetGame: () => void;
}

const INITIAL_LANES = [
    { id: 'green', name: 'Grün', bigBeads: 0, smallBeads: 0 },
    { id: 'yellow', name: 'Gelb', bigBeads: 0, smallBeads: 0 },
    { id: 'blue', name: 'Blau', bigBeads: 0, smallBeads: 0 },
    { id: 'red', name: 'Rot', bigBeads: 0, smallBeads: 0 },
];

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            lanes: INITIAL_LANES,
            savedGames: [],

            updateScore: (laneId, count) => set((state) => ({
                lanes: state.lanes.map(l =>
                    l.id === laneId ? { ...l, bigBeads: Math.max(0, Math.min(7, count)) } : l
                )
            })),

            updateSmallBeads: (laneId, count) => set((state) => ({
                lanes: state.lanes.map(l =>
                    l.id === laneId ? { ...l, smallBeads: Math.max(0, Math.min(7, count)) } : l
                )
            })),

            updateName: (laneId, name) => set((state) => ({
                lanes: state.lanes.map(l =>
                    l.id === laneId ? { ...l, name } : l
                )
            })),

            saveGame: (name, overwriteId) => set((state) => {
                const newSave: SavedGame = {
                    id: overwriteId || crypto.randomUUID(),
                    name,
                    timestamp: Date.now(),
                    lanes: state.lanes,
                };

                const currentSavedGames = Array.isArray(state.savedGames) ? state.savedGames : [];

                if (overwriteId) {
                    return {
                        savedGames: currentSavedGames.map(sg =>
                            sg.id === overwriteId ? newSave : sg
                        )
                    };
                } else {
                    return {
                        savedGames: [...currentSavedGames, newSave]
                    };
                }
            }),

            loadGame: (id) => set((state) => {
                const currentSavedGames = Array.isArray(state.savedGames) ? state.savedGames : [];
                const saveToLoad = currentSavedGames.find(sg => sg.id === id);
                if (saveToLoad) {
                    return { lanes: saveToLoad.lanes };
                }
                return {};
            }),

            deleteGame: (id) => set((state) => ({
                savedGames: (Array.isArray(state.savedGames) ? state.savedGames : []).filter(sg => sg.id !== id)
            })),

            resetGame: () => set({
                lanes: [
                    { id: 'green', name: 'Grün', bigBeads: 0, smallBeads: 0 },
                    { id: 'yellow', name: 'Gelb', bigBeads: 0, smallBeads: 0 },
                    { id: 'blue', name: 'Blau', bigBeads: 0, smallBeads: 0 },
                    { id: 'red', name: 'Rot', bigBeads: 0, smallBeads: 0 },
                ] // Reset to hardcoded initial state to ensure names are reset too
            }),
        }),
        {
            name: 'bummerl-storage',
            version: 1,
            migrate: (persistedState: unknown, version: number) => {
                if (version === 0) {
                    const state = persistedState as GameState;
                    // if moving from no version (0) to 1
                    return {
                        ...state,
                        savedGames: state.savedGames || [],
                    };
                }
                return persistedState as GameState;
            },
        }
    )
);
