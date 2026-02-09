import React, { useEffect, useState } from 'react';
import { X, Sparkles, Quote, Trophy, ArrowRight } from 'lucide-react';
import { playSound } from '../services/audioService';

interface DailyLoginModalProps {
    onClose: () => void;
    onClaim: () => void;
    streak: number;
}

const QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "It's not a bug, it's an undocumented feature.", author: "Anonymous" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" }
];

export const DailyLoginModal: React.FC<DailyLoginModalProps> = ({ onClose, onClaim, streak }) => {
    const [quote, setQuote] = useState(QUOTES[0]);

    useEffect(() => {
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        playSound('success');
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-lg rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(79,70,229,0.3)] relative overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center space-y-8 relative z-10">

                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl transform -rotate-6 mb-4">
                        <Sparkles size={40} className="text-white animate-pulse" />
                    </div>

                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-2">
                            Welcome Back!
                        </h2>
                        <p className="text-indigo-400 font-bold tracking-widest text-xs uppercase">
                            Day {streak} Login Streak
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 relative">
                        <Quote size={20} className="text-slate-600 absolute top-4 left-4" />
                        <p className="text-slate-300 font-medium text-lg italic mb-4 relative z-10 font-serif">
                            "{quote.text}"
                        </p>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
                            — {quote.author}
                        </p>
                    </div>

                    {/* Reward Section */}
                    <div className="flex items-center justify-center space-x-4">
                        <div className="px-6 py-3 bg-slate-800 rounded-xl border border-yellow-500/30 flex items-center space-x-3">
                            <Trophy size={20} className="text-yellow-400" />
                            <span className="text-yellow-400 font-black">+50 XP</span>
                        </div>
                        <div className="px-6 py-3 bg-slate-800 rounded-xl border border-cyan-500/30 flex items-center space-x-3">
                            <Sparkles size={20} className="text-cyan-400" />
                            <span className="text-cyan-400 font-black">+10 Gems</span>
                        </div>
                    </div>

                    <button
                        onClick={onClaim}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>Claim Rewards & Start</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
