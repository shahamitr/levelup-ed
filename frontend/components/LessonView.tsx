import React from 'react';
import { World, UserState, ViewState, Message, WorldId } from '../types';
import { AlertTriangle, RefreshCcw, Map, Clock, Sword, BrainCircuit, Volume2, Send } from 'lucide-react';
import { THEMES } from '../constants/themes';
import { Loader } from './Loader';
import { Hologram } from './Hologram';
import { BossArena } from './BossArena';

interface LessonViewProps {
    selectedWorld: World | null;
    currentLevel: number;
    user: UserState;
    showDriftAlert: boolean;
    showTimeUpOverlay: boolean;
    isResyncing: boolean;
    timeLeft: number;
    formatTime: (seconds: number) => string;
    lessonContent: string;
    chatHistory: Message[];
    ttsEnabled: boolean;
    setTtsEnabled: (enabled: boolean) => void;
    chatLoading: boolean;
    chatInput: string;
    setChatInput: (input: string) => void;
    handleSendMessage: (customMsg?: string, isInternal?: boolean) => Promise<void>;
    handleContinueSync: () => void;
    setView: (view: ViewState) => void;
    addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
    selectedWorld,
    currentLevel,
    user,
    showDriftAlert,
    showTimeUpOverlay,
    isResyncing,
    timeLeft,
    formatTime,
    lessonContent,
    chatHistory,
    ttsEnabled,
    setTtsEnabled,
    chatLoading,
    chatInput,
    setChatInput,
    handleSendMessage,
    handleContinueSync,
    setView,
    addNotification
}) => {
    const currentTheme = (selectedWorld && THEMES[selectedWorld.id]) ? THEMES[selectedWorld.id] : THEMES[WorldId.AI];

    return (
        <div className={`flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden relative transition-colors duration-700 ${currentTheme.colors.background} ${currentTheme.colors.text}`}>
            {/* Ambient Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: currentTheme.backgroundPattern }}></div>

            {/* Focus Alert Overlay */}
            {showDriftAlert && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none animate-in fade-in zoom-in duration-300">
                    <div className="bg-red-600/90 text-white px-12 py-8 rounded-[3rem] shadow-[0_0_80px_rgba(220,38,38,0.5)] border-2 border-red-400 flex flex-col items-center space-y-4">
                        <AlertTriangle size={64} className="animate-bounce" />
                        <div className="text-center">
                            <p className="font-black text-3xl uppercase tracking-tighter italic">Focus Loss Detected</p>
                            <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-80">Reconnecting with AI Mentor...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Time Up Overlay */}
            {showTimeUpOverlay && (
                <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-2xl animate-in fade-in duration-700">
                    <div className={`bg-slate-900 border-2 ${currentTheme.colors.accent} p-16 rounded-[4rem] max-w-2xl w-full text-center space-y-12 shadow-2xl relative overflow-hidden`}>
                        <div className="space-y-6">
                            <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Time's Up</h2>
                            <p className="text-slate-400 text-2xl font-medium tracking-tight px-6 leading-relaxed">Great effort! Take a break.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button
                                onClick={handleContinueSync}
                                disabled={isResyncing}
                                className={`flex-1 px-10 py-8 ${currentTheme.colors.primary} text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center space-x-4`}
                            >
                                <RefreshCcw size={28} className={isResyncing ? 'animate-spin' : ''} />
                                <span className="text-xl">Resume</span>
                            </button>
                            <button
                                onClick={() => setView(ViewState.WORLD_MAP)}
                                className={`flex-1 px-10 py-8 bg-slate-800 text-slate-300 rounded-[2.5rem] font-black uppercase tracking-widest border border-slate-700 shadow-xl transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center space-x-4`}
                            >
                                <Map size={28} />
                                <span className="text-xl">Exit</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`w-full md:w-2/3 p-16 overflow-y-auto relative scrollbar-hide border-r ${currentTheme.colors.accent} border-opacity-20`}>
                <div className="absolute top-16 right-16 flex items-center space-x-6">
                    {/* Timer UI */}
                    <div className={`flex items-center space-x-4 px-6 py-3 rounded-full border transition-all duration-500 ${timeLeft < 60 ? 'bg-red-500/20 border-red-500/50 text-red-400' : `${currentTheme.colors.primary} bg-opacity-10 ${currentTheme.colors.accent}`}`}>
                        <Clock size={16} className={timeLeft < 60 ? 'animate-pulse' : ''} />
                        <span className={`font-mono text-[10px] tracking-widest font-black uppercase ${currentTheme.colors.text}`}>TIME: {formatTime(timeLeft)}</span>
                    </div>

                    {/* Focus UI */}
                    <div className={`flex items-center space-x-4 px-6 py-3 rounded-full border ${currentTheme.colors.accent} bg-opacity-10`}>
                        <div className={`w-3 h-3 rounded-full ${user.focusScore > 80 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`font-mono text-[10px] tracking-widest font-bold ${currentTheme.colors.text}`}>FOCUS: {user.focusScore}%</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 relative">
                    <div className="space-y-4 relative z-10 max-w-4xl">
                        <p className={`${currentTheme.colors.text} font-mono text-[10px] font-bold tracking-[0.3em] uppercase opacity-60`}>TRACK: {selectedWorld?.name} // MODULE: {currentLevel}</p>
                        <h2 className={`text-4xl md:text-5xl font-bold tracking-tight leading-none ${currentTheme.colors.text} break-words`}>{selectedWorld?.name}</h2>
                    </div>
                    <button
                        onClick={() => setView(ViewState.BOSS_FIGHT)}
                        className={`px-8 py-4 ${currentTheme.colors.primary} text-white rounded-2xl font-bold shadow-lg transition-all hover:scale-105 whitespace-nowrap flex items-center shrink-0`}
                    >
                        <Sword size={20} className="inline mr-2" />
                        <span className="text-base uppercase tracking-wider">Start Interview</span>
                    </button>
                </div>

                {/* Content Container with Vibe-Specific Styling */}
                <div className={`prose max-w-none p-10 rounded-[3rem] border backdrop-blur-3xl transition-all duration-700
                  ${currentTheme.id === 'cyber-matrix' ? 'prose-invert font-mono border-green-500/30 bg-black/80 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : ''}
                  ${currentTheme.id === 'data-glass' ? 'prose-invert border-cyan-500/20 bg-slate-900/60 shadow-[0_0_50px_rgba(6,182,212,0.1)]' : ''}
                  ${currentTheme.id === 'web-brutalism' ? 'prose-zinc border-black bg-white shadow-[8px_8px_0px_#000]' : ''}
                  ${currentTheme.id === 'ai-ethereal' ? 'prose-invert prose-indigo border-indigo-500/30 bg-slate-900/40 shadow-[0_0_60px_rgba(79,70,229,0.2)]' : ''}
                `}>
                    <div className="text-lg md:text-xl leading-relaxed space-y-6 font-normal tracking-normal text-slate-300">
                        {lessonContent.includes('Loading Course Module')
                            ? <Loader type="app" text={`LOADING module content...`} />
                            : lessonContent.split('\n').map((line, i) => <p key={i}>{line}</p>)
                        }
                    </div>
                </div>
            </div>

            {/* Chat / Mentor Panel */}
            <div className={`w-full md:w-1/3 flex flex-col border-l backdrop-blur-3xl ${currentTheme.colors.secondary} ${currentTheme.colors.accent} border-opacity-30`}>
                <div className={`p-10 border-b ${currentTheme.colors.accent} border-opacity-30 flex justify-between items-center bg-opacity-90`}>
                    <div className="flex items-center space-x-5">
                        <BrainCircuit size={32} className={currentTheme.id === 'web-brutalism' ? 'text-black' : 'text-green-500'} />
                        <div>
                            <span className={`font-black text-sm tracking-[0.2em] uppercase block ${currentTheme.colors.text}`}>AI MENTOR</span>
                            <span className="text-[10px] font-bold opacity-60 uppercase">VIBE: {currentTheme.name}</span>
                        </div>
                    </div>
                    <button onClick={() => setTtsEnabled(!ttsEnabled)} className={`p-5 rounded-[2rem] transition-all shadow-xl ${ttsEnabled ? currentTheme.colors.primary + ' text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <Volume2 size={30} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
                    {chatHistory.map(msg => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-6 rounded-3xl text-sm md:text-base max-w-[85%] shadow-lg border relative overflow-hidden transition-all duration-500 ${msg.role === 'user'
                                ? `${currentTheme.colors.primary} text-white rounded-tr-none`
                                : msg.type === 'intervention'
                                    ? 'bg-red-900/10 text-red-400 border-red-500/30 rounded-tl-none'
                                    : `${currentTheme.id === 'web-brutalism' ? 'bg-gray-100 text-black border-black' : 'bg-slate-800/80 text-slate-300 border-slate-700/50'} rounded-tl-none`
                                }`}>

                                {msg.text.includes('<holodeck') ? (
                                    <div className="space-y-6">
                                        {msg.text.split(/<holodeck type="mermaid">([\s\S]*?)<\/holodeck>/).map((part, i) =>
                                            i % 2 === 1
                                                ? <Hologram key={i} content={part.trim()} caption="GENERATED SCHEMATIC" />
                                                : <div key={i} className="whitespace-pre-wrap">{part}</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                )}
                            </div>
                        </div>
                    ))}
                    {chatLoading && <Loader type="ai" text="Mentor is thinking..." className="ml-4" />}
                </div>
                <div className="p-10 bg-opacity-50">
                    <div className="relative">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask your mentor..."
                            className={`w-full bg-transparent border-2 rounded-[2.5rem] pl-10 pr-24 py-8 text-xl outline-none transition-all ${currentTheme.colors.text} ${currentTheme.colors.accent} focus:ring-4 focus:ring-opacity-20`}
                        />
                        <button onClick={() => handleSendMessage()} className={`absolute right-6 top-6 bottom-6 px-8 ${currentTheme.colors.primary} text-white rounded-2xl transition-all shadow-xl`}>
                            <Send size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
