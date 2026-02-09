import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Trophy, Linkedin, FileText, Award } from 'lucide-react';
import { ViewState, World } from '../types';

interface VictoryStats {
    xpGained: number;
    masteryBonus: boolean;
    levelUp: boolean;
    skills: { name: string, value: number }[];
}

interface CelebrationModalProps {
    stats: VictoryStats | null;
    selectedWorld: World | null;
    currentLevel: number;
    setView: (view: ViewState) => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ stats, selectedWorld, currentLevel, setView }) => {
    if (!stats || !selectedWorld) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="max-w-3xl w-full bg-slate-900 border-2 border-indigo-500/30 rounded-[4rem] p-16 relative overflow-hidden shadow-[0_0_120px_rgba(79,70,229,0.3)] animate-in zoom-in duration-700">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse"></div>
                <div className="flex flex-col items-center text-center space-y-10">
                    <div className="p-10 bg-indigo-600/20 rounded-full border border-indigo-500/40 animate-bounce">
                        <Sparkles size={80} className="text-indigo-400" />
                    </div>

                    <div className="space-y-4">
                        <p className="text-indigo-400 font-mono text-sm font-black tracking-[0.5em] uppercase">MODULE COMPLETE</p>
                        <h2 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-tight">CERTIFIED!</h2>
                        <p className="text-slate-400 text-2xl font-medium tracking-tight">You have mastered {selectedWorld.name} Module {currentLevel}.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 w-full">
                        <div className="p-8 bg-slate-800 rounded-3xl border border-slate-700 flex flex-col items-center space-y-2">
                            <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">XP GAINED</span>
                            <span className="text-5xl font-black text-white tracking-tighter">+{stats.xpGained}</span>
                        </div>
                        <div className="p-8 bg-slate-800 rounded-3xl border border-slate-700 flex flex-col items-center space-y-2">
                            <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">SKILL BOOST</span>
                            <div className="flex space-x-4">
                                {stats.skills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase">{skill.name} +{skill.value}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {stats.masteryBonus && (
                        <div className="w-full bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/50 p-8 rounded-3xl flex items-center justify-center space-x-6 animate-pulse">
                            <Trophy size={40} className="text-yellow-500" />
                            <div className="text-left">
                                <p className="text-yellow-500 font-black uppercase text-sm tracking-widest">WORLD MASTERY BONUS</p>
                                <p className="text-white text-xl font-bold">You have conquered the {selectedWorld.name} Realm!</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col w-full gap-4">
                        <button
                            onClick={() => setView(ViewState.WORLD_MAP)}
                            className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black text-xl uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center space-x-4"
                        >
                            <span>Claim Rewards</span>
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
