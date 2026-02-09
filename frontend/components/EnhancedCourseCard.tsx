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
      rounded-[2.5rem] p-8
      transition-all duration-300
      ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(79,70,229,0.3)] cursor-pointer'}
    `}>
            {/* Lock Overlay */}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 backdrop-blur-sm rounded-[2.5rem]">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="p-6 bg-slate-800 rounded-full">
                            <Lock size={48} className="text-slate-500" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-sm tracking-wider">Complete Previous Course</p>
                    </div>
                </div>
            )}

            {/* Progress Ring */}
            <div className="absolute -top-6 -right-6">
                <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-800"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                        className={`${isCompleted ? 'text-green-500' : 'text-indigo-500'} transition-all duration-1000`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    {isCompleted ? (
                        <CheckCircle2 size={32} className="text-green-500" />
                    ) : (
                        <span className="text-sm font-black text-white">{Math.round(progress)}%</span>
                    )}
                </div>
            </div>

            {/* Course Content */}
            <div className="space-y-6 relative z-0">
                {/* Header */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-3xl font-black text-white tracking-tight">{world.name}</h2>
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${difficulty.color} text-white text-xs font-bold uppercase`}>
                            {difficulty.label}
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{world.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-2xl">
                        <Clock size={20} className="text-indigo-400" />
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Duration</p>
                            <p className="text-sm font-bold text-white">{world.totalLevels * 30}min</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-2xl">
                        <TrendingUp size={20} className="text-green-400" />
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Modules</p>
                            <p className="text-sm font-bold text-white">{world.totalLevels}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-2xl">
                        <Trophy size={20} className="text-yellow-400" />
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">XP</p>
                            <p className="text-sm font-bold text-white">{world.totalLevels * 500}</p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {isInProgress && (
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span>PROGRESS</span>
                            <span>{completedLevels.length} / {world.totalLevels} Modules</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <button
                        onClick={onStart}
                        disabled={isLocked}
                        className={`
                            flex-1 py-4 px-6 rounded-2xl font-black uppercase tracking-wider text-sm
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
                        {isCompleted ? '✓ Review Course' : isInProgress ? 'Continue Learning' : 'Start Course'}
                    </button>

                    {(isCompleted || progress > 80) && onBossFight && (
                        <button
                            onClick={onBossFight}
                            className="p-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 hover:shadow-red-500/40 transition-all flex items-center justify-center group"
                            title="Challenge Boss"
                        >
                            <Swords size={24} className="group-hover:animate-pulse" />
                        </button>
                    )}
                </div>
            </div>

            {/* Completion Badge */}
            {isCompleted && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white text-xs font-black uppercase shadow-lg">
                        🏆 Mastered
                    </div>
                </div>
            )}
        </div>
    );
};
