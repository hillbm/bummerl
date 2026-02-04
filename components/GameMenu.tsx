'use client';

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import SaveLoadModal from './SaveLoadModal';
import ResetModal from './ResetModal';

export default function GameMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'save' | 'load' | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const resetGame = useGameStore(state => state.resetGame);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            {/* Menu Button - Visible Top Right, Portrait Only (Landscape hidden via CSS or parent layout) */}
            <div className="fixed top-4 right-4 z-40 landscape:hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-10 h-10 bg-white/90 backdrop-blur shadow-sm border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
                    aria-label="Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute top-12 right-0 w-48 bg-white/95 backdrop-blur shadow-lg rounded-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="py-1">
                            <button
                                onClick={() => { setModalMode('save'); closeMenu(); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                                Spiel speichern
                            </button>
                            <button
                                onClick={() => { setModalMode('load'); closeMenu(); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                Spiel laden
                            </button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button
                                onClick={() => { setShowResetConfirm(true); closeMenu(); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                                Neustart
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <SaveLoadModal
                isOpen={modalMode !== null}
                onClose={() => setModalMode(null)}
                mode={modalMode || 'save'}
            />

            <ResetModal
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={resetGame}
            />
        </>
    );
}
