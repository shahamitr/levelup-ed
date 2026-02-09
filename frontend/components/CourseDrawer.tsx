import React from 'react';
import { X, ChevronRight, Play, Lock } from 'lucide-react';
import { World, UserState } from '../types';

interface CourseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    courses: World[];
    user: UserState;
    onSelectWorld: (world: World) => void;
}

export const CourseDrawer: React.FC<CourseDrawerProps> = ({
    isOpen,
    onClose,
    courses,
    user,
    onSelectWorld
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-xl font-black uppercase text-white tracking-wider">Mission Control</h2>
                        <p className="text-xs text-slate-500 font-mono">JUMP TO COORDINATES</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {courses.map(world => {
                        const completed = user.completedWorlds[world.id]?.length || 0;
                        const total = world.totalLevels;
                        const progress = Math.round((completed / total) * 100);
                        const isLocked = false; // Add logic if needed: isWorldLocked(world.id)

                        return (
                            <div
                                key={world.id}
                                onClick={() => {
                                    if (!isLocked) {
                                        onSelectWorld(world);
                                        onClose();
                                    }
                                }}
                                className={`
                                    group relative p-4 rounded-xl border border-slate-800 bg-slate-800/30
                                    hover:bg-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden
                                    ${isLocked ? 'opacity-50 grayscale' : ''}
                                `}
                            >
                                {/* Progress Bar Background */}
                                <div
                                    className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                />

                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700 ${world.primaryColor}`}>
                                            {isLocked ? <Lock size={16} /> : <Play size={16} className="fill-current" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">
                                                {world.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-mono">
                                                {completed}/{total} SECTORS CLEARED
                                            </p>
                                        </div>
                                    </div>
                                    {progress >= 100 && (
                                        <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded font-bold uppercase border border-green-500/30">
                                            Completed
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-slate-400 line-clamp-2 pl-[3.25rem]">
                                    {world.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
