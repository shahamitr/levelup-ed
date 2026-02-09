import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, TrendingUp, Clock } from 'lucide-react';

const data = [
    { month: 'Month 0', traditional: 10, levelup: 10 },
    { month: 'Month 1', traditional: 20, levelup: 35 },
    { month: 'Month 2', traditional: 30, levelup: 66 },
    { month: 'Month 3', traditional: 40, levelup: 120 },
    { month: 'Month 4', traditional: 50, levelup: 240 },
    { month: 'Month 5', traditional: 60, levelup: 380 },
    { month: 'Month 6', traditional: 70, levelup: 500 },
];

export const PlatformShowcase: React.FC = () => {
    return (
        <div className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] -z-10"></div>

            <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <Zap className="text-yellow-400 fill-yellow-400" size={20} />
                        <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs">AI-Accelerated Learning</span>
                    </div>
                    <h3 className="text-3xl font-black text-white italic">Skill Velocity</h3>
                    <p className="text-slate-400 text-sm mt-2">Compare potential mastery speed vs traditional methods</p>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                        <span className="text-slate-300 text-xs font-bold uppercase">LevelUpEd</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                        <span className="text-slate-500 text-xs font-bold uppercase">Traditional</span>
                    </div>
                </div>
            </div>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorLevelup" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorTrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#475569" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#475569" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#64748b"
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="traditional"
                            stroke="#475569"
                            fillOpacity={1}
                            fill="url(#colorTrad)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="levelup"
                            stroke="#6366f1"
                            fillOpacity={1}
                            fill="url(#colorLevelup)"
                            strokeWidth={4}
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-800">
                <div className="text-center">
                    <div className="text-2xl font-black text-white flex justify-center items-center gap-2">
                        <TrendingUp size={20} className="text-green-400" />
                        <span>10x</span>
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Faster Skill Acquisition</div>
                </div>
                <div className="text-center border-l border-slate-800">
                    <div className="text-2xl font-black text-white flex justify-center items-center gap-2">
                        <Clock size={20} className="text-indigo-400" />
                        <span>-60%</span>
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Time Spent Debugging</div>
                </div>
                <div className="text-center border-l border-slate-800">
                    <div className="text-2xl font-black text-white flex justify-center items-center gap-2">
                        <Zap size={20} className="text-yellow-400" />
                        <span>24/7</span>
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Real-time Mentorship</div>
                </div>
            </div>
        </div>
    );
};
