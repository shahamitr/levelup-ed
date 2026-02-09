
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
        <div className="relative w-full max-w-lg mx-auto h-[550px] bg-slate-900/40 rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden backdrop-blur-md hover:border-slate-600 transition-colors">
            {/* Background Ambience */}
            <div className={`absolute inset-0 bg-gradient-to-b from-${world.primaryColor.split('-')[1]}-900/20 to-slate-950`}></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 text-center z-20 bg-gradient-to-b from-slate-950/80 to-transparent">
                <h2 className={`text-xl font-bold tracking-tight text-white/90`}>{world.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="h-1 w-12 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${world.primaryColor.replace('text', 'bg')} w-[${completedLevels.length / world.totalLevels * 100}%]`}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{completedLevels.length}/{world.totalLevels} Modules</p>
                </div>
            </div>

            {/* Path SVG */}
            {/* Path SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={world.primaryColor.includes('indigo') ? '#6366f1' : '#22c55e'} stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#1e293b" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                <path
                    d="M 50 85 Q 10 80 30 70 T 50 55 T 70 40 T 50 25 L 50 10"
                    stroke="url(#pathGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    vectorEffect="non-scaling-stroke"
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
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-all duration-300 transform ${isCompleted
                                ? 'bg-yellow-500/20 border-yellow-500 hover:scale-105'
                                : isCurrent
                                    ? `bg-${world.primaryColor.split('-')[1]}-600 border-white shadow-[0_0_20px_currentColor]`
                                    : 'bg-slate-800 border-slate-700 opacity-60'
                                }`}
                        >
                            {isCompleted ? (
                                <Star size={32} fill="white" className="text-white drop-shadow-md" />
                            ) : isLocked ? (
                                <Lock size={24} className="text-slate-500" />
                            ) : (
                                <span className="text-lg font-bold text-white">{level}</span>
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
                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white text-slate-950 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-top-2">
                                Start Module {level}
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
