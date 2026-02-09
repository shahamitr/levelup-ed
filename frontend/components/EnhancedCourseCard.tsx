import React from 'react';
import { World, WorldId } from '../types';
import { Lock, Trophy, Clock, TrendingUp, CheckCircle2, Swords } from 'lucide-react';

interface EnhancedCourseCardProps {
    world: World;
    completedLevels: number[];
    isLocked: boolean;
    onStart: () => void;
    onBossFight?: () => void;
}

export const EnhancedCourseCard: React.FC<EnhancedCourseCardProps> = ({
    world,
    completedLevels,
    isLocked,
    onStart,
    onBossFight
}) => {
    const progress = (completedLevels.length / world.totalLevels) * 100;
    const isCompleted = completedLevels.length === world.totalLevels;
    const isInProgress = completedLevels.length > 0 && !isCompleted;

    const difficultyConfig = {
        [WorldId.WEB]: { label: 'Beginner', color: 'from-green-500 to-emerald-500' },
        [WorldId.DATA]: { label: 'Intermediate', color: 'from-yellow-500 to-orange-500' },
        [WorldId.CYBER]: { label: 'Advanced', color: 'from-orange-500 to-red-500' },
        [WorldId.AI]: { label: 'Expert', color: 'from-purple-500 to-pink-500' },
    };

    const difficulty = difficultyConfig[world.id as WorldId] || { label: 'Unknown', color: 'from-gray-500 to-gray-600' };

    return (
        <div className={`
      relative group
      bg-slate-900/50 backdrop-blur-xl
      border-2 ${isLocked ? 'border-slate-800' : 'border-slate-700 hover:border-indigo-500/50'}
      rounded-[2rem] p-6 h-full flex flex-col
      transition-all duration-300
      ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(79,70,229,0.3)] cursor-pointer'}
    `}>
            {/* Lock Overlay */}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 backdrop-blur-sm rounded-[2rem]">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-slate-800 rounded-full">
                            <Lock size={32} className="text-slate-500" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-wider">Locked</p>
                    </div>
                </div>
            )}

            {/* Progress Ring - Compact */}
            <div className="absolute top-4 right-4 z-10">
                <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-slate-800"
                        />
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                            className={`${isCompleted ? 'text-green-500' : 'text-indigo-500'} transition-all duration-1000`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        {isCompleted ? (
                            <CheckCircle2 size={20} className="text-green-500" />
                        ) : (
                            <span className="text-xs font-black text-white">{Math.round(progress)}%</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="space-y-4 relative z-0 flex-1 flex flex-col justify-between mt-2">
                {/* Header */}
                <div className="pr-16">
                    <div className="flex flex-col items-start mb-2">
                        <div className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${difficulty.color} text-white text-[10px] font-bold uppercase mb-2`}>
                            {difficulty.label}
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight leading-tight min-h-[3rem]">{world.name}</h2>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 min-h-[2.5em]">{world.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center justify-center p-2 bg-slate-800/30 rounded-xl border border-slate-700/30">
                        <Clock size={14} className="text-indigo-400 mb-1" />
                        <p className="text-[10px] font-bold text-white">{world.totalLevels * 30}m</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-slate-800/30 rounded-xl border border-slate-700/30">
                        <TrendingUp size={14} className="text-green-400 mb-1" />
                        <p className="text-[10px] font-bold text-white">{world.totalLevels} Mods</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-slate-800/30 rounded-xl border border-slate-700/30">
                        <Trophy size={14} className="text-yellow-400 mb-1" />
                        <p className="text-[10px] font-bold text-white">{world.totalLevels * 500} XP</p>
                    </div>
                </div>

                {/* Progress Bar (Compact) */}
                {isInProgress && (
                    <div className="pt-2">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
                            <span>Progress</span>
                            <span>{completedLevels.length}/{world.totalLevels}</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                    <button
                        onClick={onStart}
                        disabled={isLocked}
                        className={`
                            flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-wider text-xs
                            transition-all duration-300
                            ${isLocked
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                : isCompleted
                                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/50'
                                    : isInProgress
                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/50'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-purple-500/50'
                            }
                        `}
                    >
                        {isCompleted ? 'Recap' : isInProgress ? 'Continue' : 'Start'}
                    </button>

                    {(isCompleted || progress > 80) && onBossFight && (
                        <button
                            onClick={onBossFight}
                            className="p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 hover:shadow-red-500/40 transition-all flex items-center justify-center group"
                            title="Challenge Boss"
                        >
                            <Swords size={18} className="group-hover:animate-pulse" />
                        </button>
                    )}
                </div>
            </div>

            {/* Completion Badge */}
            {isCompleted && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white text-[10px] font-black uppercase shadow-lg whitespace-nowrap border-2 border-slate-900">
                        🏆 Mastered
                    </div>
                </div>
            )}
        </div>
    );
};
