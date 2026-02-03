import React from 'react';
import { Flame } from 'lucide-react';

interface StreakFlameProps {
    streak: number;
}

export const StreakFlame: React.FC<StreakFlameProps> = ({ streak }) => {
    const isActive = streak > 0;

    return (
        <div className={`flex items-center space-x-1 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} title="Daily Streak">
            <div className="relative">
                <Flame
                    size={24}
                    className={`transition-all duration-500 ${isActive ? 'fill-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse' : ''}`}
                />
                {isActive && (
                    <div className="absolute inset-0 blur-sm bg-orange-400 opacity-50 rounded-full animate-ping" />
                )}
            </div>
            <span className="font-bold text-lg">{streak}</span>
        </div>
    );
};
