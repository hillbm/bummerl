'use client';

import Image from 'next/image';
import { useGameStore, LaneState } from '../store/gameStore';

const COLOR_MAP: Record<string, string> = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-600',
    red: 'bg-red-500',
};

// Helper for slim stepper
function Stepper({
    value,
    onChange,
    max = 7,
    min = 0
}: {
    value: number;
    onChange: (val: number) => void;
    max?: number;
    min?: number;
}) {
    return (
        <div className="flex items-center bg-gray-100 rounded-md overflow-hidden h-8">
            <button
                className={`px-2 font-bold ${value <= min ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200 active:bg-gray-300'}`}
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
            >
                -
            </button>
            <span className="w-6 text-center text-sm font-medium text-gray-800">{value}</span>
            <button
                className={`px-2 font-bold ${value >= max ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200 active:bg-gray-300'}`}
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
            >
                +
            </button>
        </div>
    );
}

function PlayerRow({ lane }: { lane: LaneState }) {
    const updateName = useGameStore(state => state.updateName);
    const updateScore = useGameStore(state => state.updateScore);
    const updateSmallBeads = useGameStore(state => state.updateSmallBeads);

    return (
        <div className="flex items-center gap-2 p-2 border-b border-slate-100 last:border-0">
            {/* Color Indicator */}
            <div className={`w-3 h-8 rounded-full ${COLOR_MAP[lane.id] || 'bg-gray-400'}`} />

            {/* Name Input - Flexible width */}
            <input
                type="text"
                value={lane.name}
                onChange={(e) => updateName(lane.id, e.target.value)}
                aria-label={`Name for ${lane.name} player`}
                className="flex-1 min-w-0 bg-transparent text-slate-800 font-medium text-sm focus:outline-none focus:border-b focus:border-slate-300"
            />

            {/* Controls Group */}
            <div className="flex items-center gap-3">
                {/* Score (Big Beads) */}
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider leading-none mb-1">Punkte</span>
                    <Stepper value={lane.bigBeads} onChange={(val) => updateScore(lane.id, val)} />
                </div>

                {/* Bummerl (Small Beads) */}
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider leading-none mb-1">Bummerl</span>
                    <Stepper value={lane.smallBeads} onChange={(val) => updateSmallBeads(lane.id, val)} />
                </div>
            </div>
        </div>
    );
}

export default function PlayerControls() {
    const lanes = useGameStore(state => state.lanes);

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe landscape:hidden">
            <div className="max-w-md mx-auto">
                {lanes.map(lane => (
                    <PlayerRow key={lane.id} lane={lane} />
                ))}

                {/* Footer Branding */}
                <div className="flex items-center justify-center gap-3 py-4 mt-1">
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight">Bummerlzähler</h1>
                    <div className="w-8 h-8 relative">
                        <Image src="/icon.svg" alt="App Icon" fill className="object-contain" />
                    </div>
                </div>
            </div>
        </div>
    );
}
