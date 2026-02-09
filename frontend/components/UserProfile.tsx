import React from 'react';
import { UserState } from '../types';
import { Trophy, TrendingUp, Flame, Target, Award, Calendar, Zap, Brain, Code, Layers, Shield } from 'lucide-react';

interface UserProfileProps {
    user: UserState;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const skillsData = [
        { name: 'Logic & Problem Solving', value: user.skillProfile.logic, icon: Brain, color: 'from-blue-500 to-cyan-500' },
        { name: 'Code Architecture', value: user.skillProfile.architecture, icon: Layers, color: 'from-purple-500 to-pink-500' },
        { name: 'Security & Best Practices', value: user.skillProfile.security, icon: Shield, color: 'from-green-500 to-emerald-500' },
        { name: 'Algorithms & Data Structures', value: user.skillProfile.algorithms, icon: Code, color: 'from-orange-500 to-red-500' },
    ];

    const stats = [
        { label: 'Total XP', value: user.xp.toLocaleString(), icon: Zap, color: 'text-yellow-400' },
        { label: 'Current Level', value: user.level, icon: TrendingUp, color: 'text-indigo-400' },
        { label: 'Day Streak', value: user.streak, icon: Flame, color: 'text-orange-400' },
        { label: 'Achievements', value: user.achievements.length, icon: Trophy, color: 'text-green-400' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-slate-700 rounded-[3rem] p-12 backdrop-blur-xl">
                    <div className="flex items-center space-x-8">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-6xl shadow-2xl ring-4 ring-indigo-500/50">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-2 -right-2 px-4 py-2 bg-indigo-600 rounded-full text-white text-sm font-black shadow-xl">
                                LVL {user.level}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h1 className="text-5xl font-black text-white mb-2">{user.name}</h1>
                            <p className="text-slate-400 text-lg mb-6">Code Apprentice • Learning Path Explorer</p>

                            {/* XP Progress */}
                            <div>
                                <div className="flex justify-between text-sm text-slate-400 mb-2">
                                    <span>Progress to Level {user.level + 1}</span>
                                    <span>{user.xp % 1000} / 1000 XP</span>
                                </div>
                                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000"
                                        style={{ width: `${(user.xp % 1000) / 10}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 hover:border-indigo-500/50 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon size={32} className={stat.color} />
                                <div className="text-right">
                                    <p className="text-3xl font-black text-white">{stat.value}</p>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skills Breakdown */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-[3rem] p-8">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center space-x-3">
                        <Target className="text-indigo-400" size={28} />
                        <span>Skill Breakdown</span>
                    </h2>

                    <div className="space-y-6">
                        {skillsData.map((skill, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <skill.icon size={20} className="text-slate-400" />
                                        <span className="text-slate-300 font-medium">{skill.name}</span>
                                    </div>
                                    <span className="text-white font-bold">{skill.value}</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                                        style={{ width: `${Math.min(100, (skill.value / 100) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievements */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-[3rem] p-8">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center space-x-3">
                        <Award className="text-yellow-400" size={28} />
                        <span>Achievements ({user.achievements.length}) </span>
                    </h2>

                    {user.achievements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {user.achievements.map((achievementId, index) => (
                                <div key={index} className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-yellow-500/50 transition-all">
                                    <div className="flex items-center space-x-3">
                                        <Trophy className="text-yellow-400" size={24} />
                                        <div>
                                            <p className="text-white font-bold text-sm">{achievementId}</p>
                                            <p className="text-slate-400 text-xs">Unlocked</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Trophy size={64} className="text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg">No achievements yet. Keep learning!</p>
                        </div>
                    )}
                </div>

                {/* Activity Heatmap Placeholder */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-[3rem] p-8">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center space-x-3">
                        <Calendar className="text-green-400" size={28} />
                        <span>Learning Activity</span>
                    </h2>

                    <div className="text-center py-12">
                        <Calendar size={64} className="text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500">Activity heatmap coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
