import React from 'react';
import { Target, Zap, Gift } from 'lucide-react';

interface DailyGoalProps {
    currentXp: number;
    goalXp: number;
    onGoalComplete?: () => void;
}

export const DailyGoal: React.FC<DailyGoalProps> = ({ currentXp, goalXp, onGoalComplete }) => {
    const progress = Math.min((currentXp / goalXp) * 100, 100);
    const isComplete = currentXp >= goalXp;
    const remaining = Math.max(goalXp - currentXp, 0);

    return (
        <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${isComplete
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-slate-900/50 border-slate-800'
            }`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl ${isComplete ? 'bg-green-500/20' : 'bg-indigo-600/20'}`}>
                        <Target size={20} className={isComplete ? 'text-green-400' : 'text-indigo-400'} />
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">Daily XP Goal</p>
                        <p className="text-xs text-slate-500">
                            {isComplete ? 'Goal Complete! 🎉' : `${remaining} XP to go`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Zap size={16} className={isComplete ? 'text-green-400' : 'text-yellow-400'} fill="currentColor" />
                    <span className="font-black text-lg text-white tabular-nums">
                        {currentXp}/{goalXp}
                    </span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${isComplete
                            ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-500'
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Bonus reward indicator */}
            {isComplete && (
                <div className="mt-4 flex items-center justify-center space-x-2 p-3 bg-green-500/20 rounded-xl animate-pulse">
                    <Gift size={18} className="text-green-400" />
                    <span className="text-green-300 font-bold text-sm">+25 Bonus XP & +5 Gems Earned!</span>
                </div>
            )}
        </div>
    );
};

export default DailyGoal;
