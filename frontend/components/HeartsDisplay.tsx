import React, { useState, useEffect } from 'react';
import { Heart, Plus, Clock, Zap } from 'lucide-react';

interface HeartsDisplayProps {
    hearts: number;
    maxHearts: number;
    nextRegenIn?: number; // seconds
    onBuyHearts?: () => void;
}

export const HeartsDisplay: React.FC<HeartsDisplayProps> = ({
    hearts,
    maxHearts,
    nextRegenIn,
    onBuyHearts
}) => {
    const [timeLeft, setTimeLeft] = useState(nextRegenIn || 0);

    useEffect(() => {
        if (timeLeft <= 0 || hearts >= maxHearts) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, hearts, maxHearts]);

    useEffect(() => {
        setTimeLeft(nextRegenIn || 0);
    }, [nextRegenIn]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isEmpty = hearts <= 0;

    return (
        <div className={`flex items-center space-x-3 px-4 py-2 rounded-full border transition-all ${isEmpty
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-slate-900 border-slate-700'
            }`}>
            {/* Hearts display */}
            <div className="flex items-center space-x-1">
                {Array.from({ length: maxHearts }).map((_, i) => (
                    <Heart
                        key={i}
                        size={18}
                        className={`transition-all duration-300 ${i < hearts
                                ? 'text-red-500 fill-red-500'
                                : 'text-slate-600'
                            }`}
                    />
                ))}
            </div>

            {/* Regen timer */}
            {hearts < maxHearts && timeLeft > 0 && (
                <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Clock size={12} />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            )}

            {/* Buy button */}
            {onBuyHearts && (
                <button
                    onClick={onBuyHearts}
                    className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-full transition-colors text-xs text-red-400 hover:text-red-300"
                >
                    <Plus size={12} />
                    <span>50💎</span>
                </button>
            )}

            {/* Empty warning */}
            {isEmpty && (
                <div className="flex items-center space-x-1 text-red-400 text-xs font-bold animate-pulse">
                    <Zap size={12} />
                    <span>No hearts!</span>
                </div>
            )}
        </div>
    );
};

// Compact version for header
export const HeartsCompact: React.FC<{ hearts: number; maxHearts: number; onClick?: () => void }> = ({
    hearts,
    maxHearts,
    onClick
}) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full border transition-all ${hearts <= 1
                ? 'bg-red-500/10 border-red-500/30 animate-pulse'
                : 'bg-slate-900 border-slate-700 hover:border-red-500/50'
            }`}
    >
        <Heart size={16} className="text-red-500 fill-red-500" />
        <span className="font-bold text-white text-sm tabular-nums">{hearts}/{maxHearts}</span>
    </button>
);

export default HeartsDisplay;
