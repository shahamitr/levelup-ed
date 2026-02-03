
import React from 'react';
import { World } from '../types';
import { Lock, Play, Trophy, CheckCircle2, Star } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

interface WorldCardProps {
  world: World;
  isLocked: boolean;
  onSelect: (world: World) => void;
  completedCount: number;
}

export const WorldCard: React.FC<WorldCardProps> = ({ world, isLocked, onSelect, completedCount }) => {
  const { addNotification } = useNotification();
  const progressPercent = (completedCount / world.totalLevels) * 100;
  const isFullyMastered = completedCount >= world.totalLevels;

  const handleClick = () => {
    if (isLocked) {
      addNotification("ACCESS DENIED: COMPLETE PREVIOUS MODULES FIRST", 'error');
    } else {
      onSelect(world);
    }
  };

  return (
    <div 
      className={`relative group overflow-hidden rounded-xl border ${
        isFullyMastered 
          ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' 
          : 'border-slate-700'
      } bg-slate-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-${world.primaryColor.split('-')[1]}-900/20`}
    >
      {/* Image Overlay */}
      <div className="h-48 overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-80`} />
        <img 
          src={world.imageUrl} 
          alt={world.name} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isLocked ? 'grayscale opacity-50' : ''}`}
        />
        <div className="absolute bottom-4 left-4 z-20">
          <h3 className={`text-2xl font-bold ${world.primaryColor}`}>{world.name}</h3>
          <p className="text-slate-300 text-[10px] font-mono uppercase tracking-wider opacity-80">Interviewer: {world.bossName}</p>
        </div>
        
        {completedCount > 0 && (
          <div className={`absolute top-4 right-4 z-20 p-1.5 rounded-full shadow-lg ${isFullyMastered ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
             {isFullyMastered ? <Star size={14} fill="white" /> : <CheckCircle2 size={14} />}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Completion</span>
          <div className="flex items-center space-x-1.5">
            {isFullyMastered && <Star size={12} className="text-yellow-500 animate-pulse" fill="currentColor" />}
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              isFullyMastered ? 'text-yellow-500' : completedCount > 0 ? 'text-green-400' : 'text-slate-500'
            }`}>
              {completedCount} / {world.totalLevels} Modules
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
             <div 
                className={`h-full transition-all duration-700 ease-out ${
                  isFullyMastered ? 'bg-yellow-500' : world.primaryColor.replace('text', 'bg')
                } shadow-[0_0_8px_rgba(var(--tw-shadow-color),0.5)]`}
                style={{ width: `${Math.min(100, progressPercent)}%` }}
             />
          </div>
        </div>

        <p className="text-slate-400 text-xs mb-6 h-8 line-clamp-2 italic leading-relaxed">
          {world.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono uppercase tracking-tighter">
             <Trophy size={12} className="opacity-50" />
             <span>{world.totalLevels} Lessons</span>
          </div>
          
          <button
            onClick={handleClick}
            className={`flex items-center space-x-2 px-5 py-2 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all ${
              isLocked 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50' 
                : isFullyMastered
                  ? 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-lg shadow-yellow-900/20 active:scale-95'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 active:scale-95'
            }`}
          >
            {isLocked ? (
              <>
                <Lock size={14} className="mr-1" />
                <span>Locked</span>
              </>
            ) : isFullyMastered ? (
              <>
                <Trophy size={14} fill="currentColor" />
                <span>Replay</span>
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                <span>Start</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
