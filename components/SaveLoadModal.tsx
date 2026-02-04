'use client';

import { useState } from 'react';
import { useGameStore, SavedGame } from '../store/gameStore';

interface SaveLoadModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'save' | 'load';
}

export default function SaveLoadModal({ isOpen, onClose, mode }: SaveLoadModalProps) {
    const savedGames = useGameStore(state => state.savedGames);
    const saveGame = useGameStore(state => state.saveGame);
    const loadGame = useGameStore(state => state.loadGame);
    const deleteGame = useGameStore(state => state.deleteGame);

    const [processName, setProcessName] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // Format timestamp
    const formatDate = (ts: number) => new Date(ts).toLocaleString('de-DE', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    if (!isOpen) return null;

    const handleSave = () => {
        if (!processName.trim()) return;
        saveGame(processName);
        setProcessName('');
        onClose();
    };

    const handleOverwrite = (game: SavedGame) => {
        saveGame(game.name, game.id);
        onClose();
    };

    const handleLoad = (id: string) => {
        loadGame(id);
        onClose();
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirmDeleteId === id) {
            deleteGame(id);
            setConfirmDeleteId(null);
        } else {
            setConfirmDeleteId(id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800">
                        {mode === 'save' ? 'Spiel speichern' : 'Spiel laden'}
                    </h2>
                    <button onClick={onClose} aria-label="Schließen" className="text-slate-400 hover:text-slate-600 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {mode === 'save' && (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Name des Spielstands..."
                                value={processName}
                                onChange={(e) => setProcessName(e.target.value)}
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSave}
                                disabled={!processName.trim()}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                            >
                                Speichern
                            </button>
                        </div>
                    )}

                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {savedGames.length === 0 ? (
                            <p className="text-center text-slate-400 py-8 italic">Keine gespeicherten Spiele vorhanden.</p>
                        ) : (
                            (Array.isArray(savedGames) ? savedGames : []).slice().sort((a, b) => b.timestamp - a.timestamp).map(game => (
                                <div
                                    key={game.id}
                                    onClick={() => mode === 'load' ? handleLoad(game.id) : handleOverwrite(game)}
                                    className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all"
                                >
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-800">{game.name}</div>
                                        <div className="text-xs text-slate-400">{formatDate(game.timestamp)}</div>
                                    </div>

                                    {mode === 'save' ? (
                                        <div className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            Überschreiben
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => handleDelete(game.id, e)}
                                                className={`p-2 rounded-lg transition-all ${confirmDeleteId === game.id
                                                    ? 'bg-red-500 text-white hover:bg-red-600 px-3 text-xs font-bold'
                                                    : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                                                    }`}
                                                title={confirmDeleteId === game.id ? "Wirklich löschen?" : "Löschen"}
                                            >
                                                {confirmDeleteId === game.id ? (
                                                    "Bestätigen"
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
