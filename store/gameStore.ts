import { create } from 'zustand';

export interface Player {
    id: string;
    name: string;
    color: string;
    bigBeads: number; // 0 to 7
    smallBeads: number; // usually 0 to ?
    hasSmallBead: boolean; // Simplified: 1 small bead per side logic? 
    // User said: "opposite player gets 1 tiny ball moved... and the 7 big balls of the winner gets moved back"
    // So small ball tracks "Bummerls".
}

interface GameState {
    players: Player[];
    activePlayerId: string | null;
    history: { date: string; winnerId: string }[];

    savedGames: Record<string, { players: Player[], date: string }>;
    currentGameName: string | null;
    saveGame: (name: string) => void;
    loadGame: (name: string) => void;
    deleteGame: (name: string) => void;

    // Actions
    setPlayers: (players: Player[]) => void;
    setPlayerName: (id: string, name: string) => void;
    updateScore: (playerId: string, bigBeads: number) => void;
    addBummerl: (playerId: string) => void;
    updateSmallBeads: (playerId: string, smallBeads: number) => void;
    resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    players: [
        { id: 'green', name: 'Player 1', color: '#22c55e', bigBeads: 0, smallBeads: 0, hasSmallBead: false },
        { id: 'yellow', name: 'Player 2', color: '#eab308', bigBeads: 0, smallBeads: 0, hasSmallBead: false },
        { id: 'black', name: 'Player 3', color: '#1f2937', bigBeads: 0, smallBeads: 0, hasSmallBead: false },
        { id: 'red', name: 'Player 4', color: '#ef4444', bigBeads: 0, smallBeads: 0, hasSmallBead: false },
    ],
    activePlayerId: null,
    history: [],

    savedGames: {} as Record<string, { players: Player[], date: string }>,
    currentGameName: null,

    setPlayers: (players) => set({ players }),

    setPlayerName: (id, name) => set((state) => ({
        players: state.players.map(p => p.id === id ? { ...p, name } : p)
    })),

    updateScore: (playerId, bigBeads) => set((state) => ({
        players: state.players.map(p =>
            p.id === playerId ? { ...p, bigBeads } : p
        )
    })),

    addBummerl: (playerId) => set((state) => ({
        players: state.players.map(p => {
            if (p.id !== playerId) return p;
            // Logic: "Opposite player gets 1 tiny ball moved". 
            // Wait, if Player A wins (7 beads), Opponent gets Bummerl?
            // User said: "once each of the 7 big balls are on the other side, the opposite player gets 1 tiny ball moved... and the 7 big balls of the winner gets moved back"

            // Implementation: The "Winner" (who reached 7) triggers this.
            // BUT the Bummerl goes to whom? "Opposite player".
            // In 4 player game? Maybe "Loser"? Or is it pairs?
            // User said "played with 2, 3 or 4 people".
            // Schnapsn is usually 1vs1. 3/4 player is variation.
            // Let's assume standard Bummerl logic:
            // The ONE who reaches 7 is the winner of the DEAL.
            // The LOSER gets a Bummerl point (small bead).
            // Or the Winner marks a Bummerl on their side? 
            // "the person can move... 3 big balls... once each of 7... opposite player gets 1 tiny ball"
            // This implies the tiny ball is bad? Or good?
            // Usually Bummerl count goes DOWN or UP.
            // Let's stick to the visual: Move small bead on lane.

            return { ...p, smallBeads: p.smallBeads + 1, hasSmallBead: !p.hasSmallBead };
        })
    })),

    updateSmallBeads: (playerId, smallBeads) => set((state) => ({
        players: state.players.map(p =>
            p.id === playerId ? { ...p, smallBeads } : p
        )
    })),

    resetGame: () => set((state) => ({
        players: state.players.map(p => ({ ...p, bigBeads: 0, smallBeads: 0, hasSmallBead: false })),
        history: []
    })),

    saveGame: (name) => set((state) => ({
        savedGames: {
            ...state.savedGames,
            [name]: {
                players: state.players,
                date: new Date().toISOString()
            }
        }
    })),

    loadGame: (name) => set((state) => {
        const saved = state.savedGames[name];
        if (!saved) return state;
        return { players: saved.players };
    }),

    deleteGame: (name) => set((state) => {
        const newSaved = { ...state.savedGames };
        delete newSaved[name];
        return { savedGames: newSaved };
    })
}));
