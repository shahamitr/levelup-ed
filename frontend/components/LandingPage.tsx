
import React from 'react';
import { ArrowRight, BrainCircuit, Users, TrendingUp, ShieldCheck, Zap, Award, Target } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-8 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse z-0"></div>

                <div className="relative z-10 space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <div className="flex items-center justify-center space-x-4 mb-8">
                        <span className="px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-black tracking-widest uppercase">
                            Hackathon 2025 Finalist
                        </span>
                        <span className="px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-black tracking-widest uppercase">
                            AI-Powered
                        </span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-none drop-shadow-2xl">
                        Level<span className="text-indigo-500">Up</span>Ed
                    </h1>
                    <p className="text-xl md:text-3xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
                        The World's First <span className="text-white font-bold">Gamified Career Accelerator</span> driven by Adaptive AI.
                    </p>

                    <div className="pt-12">
                        <button
                            onClick={onStart}
                            className="group relative px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] font-black text-2xl uppercase tracking-widest shadow-[0_0_60px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center space-x-4">
                                <span>Enter The Arena</span>
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Explore The Vision</p>
                    <div className="w-px h-12 bg-gradient-to-b from-slate-500 to-transparent mx-auto"></div>
                </div>
            </section>

            {/* Value Props Matrix */}
            <section className="py-32 px-8 bg-slate-900/50 backdrop-blur-3xl border-t border-slate-800">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* For Hackathon Judges */}
                    <div className="p-10 rounded-[3rem] bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all group">
                        <div className="w-16 h-16 bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                            <BrainCircuit size={32} className="text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic mb-4">For Judges</h3>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            Demonstrating <strong className="text-white">next-gen Adaptive AI</strong> implementation. We don't just use LLMs; we built a dynamic looping architecture that scales difficulty based on real-time user performance metrics (Speed + Accuracy).
                        </p>
                        <ul className="space-y-3">
                            {[
                                { icon: Zap, text: "Real-time Latency Logic" },
                                { icon: ShieldCheck, text: "Proxy-Secured API" },
                                { icon: Target, text: "Gamified Loop Architecture" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center space-x-3 text-sm text-slate-500 font-bold uppercase tracking-wide">
                                    <item.icon size={16} className="text-indigo-500" /> <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Investors */}
                    <div className="p-10 rounded-[3rem] bg-slate-950 border border-slate-800 hover:border-green-500/50 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp size={120} />
                        </div>
                        <div className="w-16 h-16 bg-green-900/20 rounded-2xl flex items-center justify-center mb-8 border border-green-500/20 group-hover:scale-110 transition-transform">
                            <TrendingUp size={32} className="text-green-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic mb-4">For Investors</h3>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            Targeting the <strong className="text-white">$350B E-Learning market</strong> by solving the #1 problem: <strong className="text-white">Completion Rates</strong>. Our gamified retention loop increases engagement by 400% compared to traditional MOOCs.
                        </p>
                        <ul className="space-y-3">
                            {[
                                { icon: Users, text: "B2B Enterprise Upskilling" },
                                { icon: Award, text: "Verifiable Skill Badges" },
                                { icon: TrendingUp, text: "High LTV / Retention" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center space-x-3 text-sm text-slate-500 font-bold uppercase tracking-wide">
                                    <item.icon size={16} className="text-green-500" /> <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Students */}
                    <div className="p-10 rounded-[3rem] bg-slate-950 border border-slate-800 hover:border-yellow-500/50 transition-all group">
                        <div className="w-16 h-16 bg-yellow-900/20 rounded-2xl flex items-center justify-center mb-8 border border-yellow-500/20 group-hover:scale-110 transition-transform">
                            <Zap size={32} className="text-yellow-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic mb-4">For Students</h3>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            Stop watching boring videos. <strong className="text-white">Start playing.</strong> LevelUpEd turns your career prep into an RPG. Fight bosses (Senior Devs), earn loot (Skills), and get hired by top companies.
                        </p>
                        <ul className="space-y-3">
                            {[
                                { icon: BrainCircuit, text: "AI Personal Mentor" },
                                { icon: Zap, text: "Duolingo-style Streaks" },
                                { icon: Award, text: "Job-Ready Portfolio" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center space-x-3 text-sm text-slate-500 font-bold uppercase tracking-wide">
                                    <item.icon size={16} className="text-yellow-500" /> <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 text-center border-t border-slate-800 text-slate-600 font-mono text-xs uppercase tracking-widest">
                <p>Built with ❤️ by Hackathon Team • Powered by Gemini 2.0</p>
            </footer>
        </div>
    );
};
