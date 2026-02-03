
import React from 'react';
import { World, WorldId } from '../types';
import { Lock, Star, CheckCircle2, Play, Trophy } from 'lucide-react';

interface WorldPathProps {
    world: World;
    completedLevels: number[];
    onStartLevel: (level: number) => void;
    onBossFight: () => void;
}

export const WorldPath: React.FC<WorldPathProps> = ({ world, completedLevels, onStartLevel, onBossFight }) => {
    // Generate levels 1-5
    const levels = Array.from({ length: world.totalLevels }, (_, i) => i + 1);
    const isBossUnlocked = completedLevels.length >= world.totalLevels;

    const getPosition = (index: number) => {
        // S-curve positions (x, y) in percentage
        const positions = [
            { x: 50, y: 85 },
            { x: 30, y: 70 },
            { x: 50, y: 55 },
            { x: 70, y: 40 },
            { x: 50, y: 25 },
        ];
        return positions[index] || { x: 50, y: 10 };
    };

    return (
        <div className="relative w-full max-w-md mx-auto h-[600px] bg-slate-900/50 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Background Ambience */}
            <div className={`absolute inset-0 bg-gradient-to-b from-${world.primaryColor.split('-')[1]}-900/20 to-slate-950`}></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 text-center z-20 bg-gradient-to-b from-slate-950 to-transparent">
                <h2 className={`text-2xl font-black uppercase tracking-tighter ${world.primaryColor}`}>{world.name}</h2>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{completedLevels.length} / {world.totalLevels} COMPLETED</p>
            </div>

            {/* Path SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={world.primaryColor.includes('indigo') ? '#6366f1' : '#22c55e'} stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#1e293b" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                <path
                    d="M 50% 85% Q 10% 80% 30% 70% T 50% 55% T 70% 40% T 50% 25% L 50% 10%"
                    stroke="url(#pathGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    style={{ vectorEffect: 'non-scaling-stroke' }} // Attempt to make it responsive
                />
                {/* Simple straight lines fallback if curves fail to scale in regular div */}
                {/* Note: The d attribute above is pseudo-code for % based coords which SVG doesn't strictly support without viewBox.
             For simplicity in this specific "fixed size" container, we'll assume the container 100% matches a coordinate system or keep it visual.
             Actually, better implementation: */}
                <path
                    d="M 200 510 C 100 510 50 450 120 420 S 280 380 280 330 S 150 280 200 240 S 300 180 200 150 L 200 60"
                    stroke="currentColor"
                    strokeWidth="12"
                    className={`${world.primaryColor.replace('text', 'text')}/20`}
                    fill="none"
                />
            </svg>

            {/* Nodes */}
            {levels.map((level, index) => {
                const isCompleted = completedLevels.includes(level);
                const isCurrent = !isCompleted && (completedLevels.includes(level - 1) || level === 1);
                const isLocked = !isCompleted && !isCurrent;
                const pos = getPosition(index);

                return (
                    <div
                        key={level}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    >
                        <button
                            onClick={() => !isLocked && onStartLevel(level)}
                            disabled={isLocked}
                            className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 transform ${isCompleted
                                    ? 'bg-yellow-500 border-yellow-300 hover:scale-105'
                                    : isCurrent
                                        ? `bg-${world.primaryColor.split('-')[1]}-600 border-white/50 animate-bounce-slow shadow-[0_0_30px_currentColor]`
                                        : 'bg-slate-800 border-slate-700 grayscale opacity-60 cursor-not-allowed'
                                }`}
                        >
                            {isCompleted ? (
                                <Star size={32} fill="white" className="text-white drop-shadow-md" />
                            ) : isLocked ? (
                                <Lock size={24} className="text-slate-500" />
                            ) : (
                                <span className="text-3xl font-black text-white italic">{level}</span>
                            )}

                            {/* Stars Decoration */}
                            {isCompleted && (
                                <div className="absolute -top-2 flex space-x-0.5">
                                    <Star size={12} fill="#fbbf24" className="text-yellow-400" />
                                    <Star size={16} fill="#fbbf24" className="text-yellow-300 -mt-2" />
                                    <Star size={12} fill="#fbbf24" className="text-yellow-400" />
                                </div>
                            )}
                        </button>

                        {/* Level Label */}
                        {isCurrent && (
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-top-2">
                                Start Level {level}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Boss Node */}
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <button
                    onClick={onBossFight}
                    disabled={!isBossUnlocked}
                    className={`w-24 h-24 rounded-[2rem] flex items-center justify-center border-4 transition-all duration-500 ${isBossUnlocked
                            ? 'bg-red-600 border-red-400 animate-pulse hover:scale-110 shadow-[0_0_50px_rgba(220,38,38,0.6)]'
                            : 'bg-slate-900 border-slate-800 grayscale opacity-40 cursor-not-allowed'
                        }`}
                >
                    <Trophy size={40} fill={isBossUnlocked ? "white" : "none"} className={isBossUnlocked ? 'text-white' : 'text-slate-600'} />
                </button>
                <p className={`absolute top-full mt-3 w-32 text-center -left-4 text-[10px] font-black uppercase tracking-widest ${isBossUnlocked ? 'text-red-500' : 'text-slate-700'}`}>
                    Final Exam
                </p>
            </div>

        </div>
    );
};
