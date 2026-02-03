'use client';

import { useGameStore } from "../store/gameStore";
import { Plus, Minus, Dices, Save, FolderOpen, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getRandomName } from '../utils/funnyNames';
import Image from 'next/image';


export default function GameUI() {
    const players = useGameStore(state => state.players);
    const resetGame = useGameStore(state => state.resetGame);
    const setPlayerName = useGameStore(state => state.setPlayerName);
    const updateScore = useGameStore(state => state.updateScore);

    const handleScoreChange = (playerId: string, currentScore: number, change: number) => {
        const newScore = Math.max(0, Math.min(7, currentScore + change));
        // Update animations will happen automatically via store subscription in Lane.tsx
        updateScore(playerId, newScore);
    };

    const updateSmallBeads = useGameStore(state => state.updateSmallBeads);

    const handleBummerlChange = (playerId: string, currentScore: number, change: number) => {
        const newScore = Math.max(0, Math.min(7, currentScore + change));
        updateSmallBeads(playerId, newScore);
    };

    const savedGames = useGameStore(state => state.savedGames);
    const saveGame = useGameStore(state => state.saveGame);
    const loadGame = useGameStore(state => state.loadGame);
    const deleteGame = useGameStore(state => state.deleteGame);
    const currentGameName = useGameStore(state => state.currentGameName);

    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [saveName, setSaveName] = useState('');

    const handleSaveClick = () => {
        if (currentGameName) {
            saveGame(currentGameName);
        } else {
            setIsSaveModalOpen(true);
        }
    };

    const handleSaveModalConfirm = () => {
        if (saveName.trim()) {
            saveGame(saveName.trim());
            setSaveName('');
            setIsSaveModalOpen(false);
        }
    };

    const hasGameStarted = players.some(p => p.bigBeads > 0 || p.smallBeads > 0);

    const [isMobileLandscape, setIsMobileLandscape] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            setIsMobileLandscape(window.matchMedia('(orientation: landscape) and (max-height: 500px)').matches);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-1 md:p-8 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+64px)]">
            {/* Header */}
            <div className="flex justify-between items-start pointer-events-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 drop-shadow-sm">
                        <Image src="icon.svg" alt="App Icon" fill className="object-contain" />
                    </div>
                    <h1 className="text-lg font-bold text-black drop-shadow-sm">Bummerlzähler</h1>
                </div>

                {!isMobileLandscape && (
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleSaveClick}
                                className="bg-white/90 backdrop-blur text-black p-2 rounded-lg hover:bg-white transition shadow-sm"
                                title="Speichern"
                                aria-label="Speichern"
                            >
                                <Save size={20} />
                            </button>
                            <button
                                onClick={() => setIsLoadModalOpen(true)}
                                className="bg-white/90 backdrop-blur text-black p-2 rounded-lg hover:bg-white transition shadow-sm"
                                title="Laden"
                                aria-label="Laden"
                            >
                                <FolderOpen size={20} />
                            </button>
                            <button
                                onClick={() => setIsResetModalOpen(true)}
                                className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-700 transition shadow-md"
                                title="Neustart"
                                aria-label="Neustart"
                            >
                                <RotateCcw size={20} />
                            </button>
                        </div>
                        {currentGameName && (
                            <div className="text-xs font-medium text-black/60 drop-shadow-sm bg-white/40 px-2 py-0.5 rounded backdrop-blur-sm">
                                Spiel: {currentGameName}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Save Modal */}
            {isSaveModalOpen && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-96 max-w-full m-4">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Spiel speichern</h2>
                        <input
                            type="text"
                            value={saveName}
                            onChange={(e) => setSaveName(e.target.value)}
                            placeholder="Name eingeben..."
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                            autoFocus
                        />

                        {/* Existing Saves List */}
                        {Object.keys(savedGames).length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Vorhandene überschreiben:</p>
                                <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-100 rounded-lg p-1">
                                    {Object.keys(savedGames).map(name => (
                                        <button
                                            key={name}
                                            onClick={() => setSaveName(name)}
                                            className={`w-full text-left p-2 rounded-md text-sm transition flex items-center justify-between ${saveName === name
                                                ? 'bg-slate-900 text-white shadow-md'
                                                : 'hover:bg-slate-100 text-slate-600'
                                                }`}
                                        >
                                            <span className="font-medium truncate">{name}</span>
                                            <span className={`text-xs ${saveName === name ? 'text-slate-300' : 'text-slate-400'}`}>
                                                {new Date(savedGames[name].date).toLocaleDateString()}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsSaveModalOpen(false)}
                                className="px-4 py-2 text-slate-500 hover:text-slate-800"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleSaveModalConfirm}
                                disabled={!saveName.trim()}
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
                            >
                                Speichern
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Load Modal */}
            {isLoadModalOpen && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-96 max-w-full m-4">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Spiel laden</h2>
                        <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                            {Object.keys(savedGames).length === 0 ? (
                                <p className="text-slate-400 text-center py-4">Keine gespeicherten Spiele gefunden.</p>
                            ) : (
                                Object.keys(savedGames).map(name => (
                                    <div key={name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition">
                                        <button
                                            onClick={() => {
                                                loadGame(name);
                                                setIsLoadModalOpen(false);
                                            }}
                                            className="flex-1 text-left font-medium text-slate-700"
                                        >
                                            {name}
                                            <div className="text-xs text-slate-400 font-normal">
                                                {new Date(savedGames[name].date).toLocaleDateString()}
                                            </div>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteGame(name);
                                            }}
                                            className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                            title="Delete Save"
                                        >
                                            <Minus size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsLoadModalOpen(false)}
                                className="px-4 py-2 text-slate-500 hover:text-slate-800"
                            >
                                Schließen
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Reset Modal */}
            {isResetModalOpen && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-96 max-w-full m-4">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Neustart</h2>
                        <p className="text-slate-600 mb-6">Möchten Sie das Spiel wirklich zurücksetzen?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsResetModalOpen(false)}
                                className="px-4 py-2 text-slate-500 hover:text-slate-800"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={() => {
                                    resetGame();
                                    setIsResetModalOpen(false);
                                }}
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700"
                            >
                                Neustart
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Players Status Overlay */}
            {!isMobileLandscape && (
                <div className="w-full max-w-lg mx-auto pointer-events-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 flex flex-col max-h-[80vh]">
                    <div className="divide-y divide-slate-200/60 overflow-y-auto scrollbar-hide">
                        {players.map(player => (
                            <div key={player.id} className="p-3 md:p-4 flex flex-col gap-2 transition bg-transparent hover:bg-black/[0.02]">
                                {/* Top Row: Dot, Name, Dice */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full shadow-sm ring-1 ring-black/10 shrink-0"
                                        style={{ backgroundColor: player.color }}
                                        title="Spielerfarbe"
                                    />
                                    <input
                                        type="text"
                                        value={player.name}
                                        onChange={(e) => setPlayerName && setPlayerName(player.id, e.target.value)}
                                        className="font-extrabold text-black bg-transparent border-b border-transparent hover:border-black/20 focus:border-black focus:outline-none w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                        aria-label={`Name von ${player.name}`}
                                        title={`Name von ${player.name}`}
                                        disabled={hasGameStarted}
                                    />
                                    <button
                                        onClick={() => setPlayerName && setPlayerName(player.id, getRandomName(player.name))}
                                        className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-black transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                                        title="Generiere lustigen Namen"
                                        aria-label="Generiere lustigen Namen"
                                        disabled={hasGameStarted}
                                    >
                                        <Dices size={18} />
                                    </button>
                                </div>

                                {/* Bottom Row: Controls */}
                                <div className="flex items-center justify-end gap-6 pl-7">
                                    {/* Points */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-black uppercase tracking-wider leading-none">Punkte</span>
                                        <div className="flex items-center gap-1 bg-black/5 rounded-lg p-0.5">
                                            <button
                                                onClick={() => handleScoreChange(player.id, player.bigBeads, -1)}
                                                className="p-1 rounded-md hover:bg-white/50 text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                                                disabled={player.bigBeads === 0}
                                                aria-label="Punkte verringern"
                                                title="Punkte verringern"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-mono font-bold w-5 text-center text-base leading-none text-black">{player.bigBeads}</span>
                                            <button
                                                onClick={() => handleScoreChange(player.id, player.bigBeads, 1)}
                                                className="p-1 rounded-md hover:bg-white/50 text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                                                disabled={player.bigBeads === 7}
                                                aria-label="Punkte erhöhen"
                                                title="Punkte erhöhen"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bummerl */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-black uppercase tracking-wider leading-none">Bummerl</span>
                                        <div className="flex items-center gap-1 bg-black/5 rounded-lg p-0.5">
                                            <button
                                                onClick={() => handleBummerlChange(player.id, player.smallBeads, -1)}
                                                className="p-1 rounded-md hover:bg-white/50 text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                                                disabled={player.smallBeads === 0}
                                                aria-label="Bummerl verringern"
                                                title="Bummerl verringern"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-mono font-bold w-5 text-center text-base leading-none text-black">{player.smallBeads}</span>
                                            <button
                                                onClick={() => handleBummerlChange(player.id, player.smallBeads, 1)}
                                                className="p-1 rounded-md hover:bg-white/50 text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                                                disabled={player.smallBeads === 7}
                                                aria-label="Bummerl erhöhen"
                                                title="Bummerl erhöhen"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
