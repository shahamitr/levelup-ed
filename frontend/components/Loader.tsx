
import React from 'react';
import { Loader2, BrainCircuit } from 'lucide-react';

interface LoaderProps {
    type: 'app' | 'ai';
    text?: string;
    className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ type, text, className = '' }) => {
    if (type === 'app') {
        return (
            <div className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300 ${className}`}>
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
                    <Loader2 size={64} className="text-indigo-500 animate-spin relative z-10" />
                    <BrainCircuit size={32} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-white tracking-widest uppercase italic">{text || 'INITIALIZING SYSTEM'}</h3>
                    <div className="h-1 w-48 bg-slate-800 rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-[loading_1s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </div>
        );
    }

    // AI / Inline Loader
    return (
        <div className={`flex items-center space-x-3 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl w-fit ${className}`}>
            <div className="relative flex space-x-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            </div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">
                {text || 'AI Processing...'}
            </span>
        </div>
    );
};
