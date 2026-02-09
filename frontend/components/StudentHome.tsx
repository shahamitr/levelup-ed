import React from 'react';
import { UserState, World, ViewState } from '../types';
import {
    Flame, Zap, Target, Trophy, BookOpen, ArrowRight,
    TrendingUp, ChevronRight, Sparkles, Star
} from 'lucide-react';

interface StudentHomeProps {
    user: UserState;
    courses: World[];
    onNavigate: (view: ViewState) => void;
    onStartLesson: (world: World) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ user, courses, onNavigate, onStartLesson }) => {

    // Calculate stats
    const completedWorldValues = Object.values(user.completedWorlds) as number[][];
    const totalCompleted = completedWorldValues.reduce((sum: number, arr: number[]) => sum + arr.length, 0);
    const totalPossible = courses.length * 5;
    const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    const xpToNext = 1000 - (user.xp % 1000);
    const xpProgress = ((user.xp % 1000) / 1000) * 100;

    // Find courses in progress (started but not finished)
    const inProgressCourses = courses.filter(c => {
        const completed = user.completedWorlds[c.id] || [];
        return completed.length > 0 && completed.length < c.totalLevels;
    });

    // Find recently started / easy next courses
    const suggestedCourses = courses.filter(c => {
        const completed = user.completedWorlds[c.id] || [];
        return completed.length === 0;
    }).slice(0, 4);

    // Daily Goals
    const todayXP = Math.min(user.xp % 500, 300); // Simulate daily XP
    const dailyGoal = 300;
    const dailyProgress = Math.round((todayXP / dailyGoal) * 100);

    // Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ─── Welcome Hero ─── */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-slate-950 border border-slate-800 p-10 md:p-14">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <p className="text-indigo-400 font-mono text-xs uppercase tracking-[0.3em] font-bold mb-2">{getGreeting()}</p>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
                            Welcome back, <span className="text-indigo-400">{user.name}</span> 👋
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            {user.streak > 0
                                ? `You're on a ${user.streak}-day streak! Keep the momentum going.`
                                : "Let's start building your streak. Every day counts!"}
                        </p>

                        {/* Quick Stats Row */}
                        <div className="flex flex-wrap gap-4 mt-8">
                            <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 px-5 py-3 rounded-2xl">
                                <div className="p-2 bg-yellow-500/20 rounded-xl"><Zap size={18} className="text-yellow-400" /></div>
                                <div>
                                    <p className="text-xl font-black text-white leading-none">{user.xp.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total XP</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 px-5 py-3 rounded-2xl">
                                <div className="p-2 bg-indigo-500/20 rounded-xl"><TrendingUp size={18} className="text-indigo-400" /></div>
                                <div>
                                    <p className="text-xl font-black text-white leading-none">Level {user.level}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Current Rank</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 px-5 py-3 rounded-2xl">
                                <div className="p-2 bg-orange-500/20 rounded-xl"><Flame size={18} className="text-orange-400" /></div>
                                <div>
                                    <p className="text-xl font-black text-white leading-none">{user.streak} Days</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Streak</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 px-5 py-3 rounded-2xl">
                                <div className="p-2 bg-green-500/20 rounded-xl"><Trophy size={18} className="text-green-400" /></div>
                                <div>
                                    <p className="text-xl font-black text-white leading-none">{user.achievements.length}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Achievements</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Main Grid ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ─── Left Column (2/3) ─── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Continue Learning */}
                        {inProgressCourses.length > 0 && (
                            <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                        <BookOpen className="text-indigo-400" size={22} /> Continue Learning
                                    </h2>
                                    <button onClick={() => onNavigate(ViewState.WORLD_MAP)} className="text-indigo-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                                        View All <ChevronRight size={14} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {inProgressCourses.slice(0, 3).map(course => {
                                        const completed = user.completedWorlds[course.id] || [];
                                        const progress = Math.round((completed.length / course.totalLevels) * 100);
                                        return (
                                            <button
                                                key={course.id}
                                                onClick={() => onStartLesson(course)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center gap-5 hover:border-indigo-500/50 transition-all group text-left"
                                            >
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                    <BookOpen className={course.primaryColor} size={24} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-white truncate">{course.name}</h4>
                                                    <p className="text-xs text-slate-500">Module {completed.length + 1} of {course.totalLevels}</p>
                                                    <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full" style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-indigo-400 group-hover:text-white transition-colors flex-shrink-0">
                                                    <span className="text-xs font-bold uppercase">{progress}%</span>
                                                    <ArrowRight size={18} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Suggested Courses */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                    <Sparkles className="text-purple-400" size={22} /> {inProgressCourses.length > 0 ? 'Explore New Courses' : 'Start Your Journey'}
                                </h2>
                                <button onClick={() => onNavigate(ViewState.WORLD_MAP)} className="text-indigo-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                                    Browse All <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {suggestedCourses.map(course => (
                                    <button
                                        key={course.id}
                                        onClick={() => onStartLesson(course)}
                                        className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left hover:border-indigo-500/40 transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                <BookOpen className={course.primaryColor} size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`font-bold ${course.primaryColor} truncate mb-1`}>{course.name}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">{course.totalLevels} Modules</span>
                                                    <span className="text-[10px] text-slate-600">•</span>
                                                    <span className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">Boss: {course.bossName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-end gap-1 text-indigo-400 group-hover:text-white transition-colors">
                                            <span className="text-xs font-bold uppercase">Start Course</span>
                                            <ArrowRight size={14} />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {inProgressCourses.length === 0 && suggestedCourses.length === 0 && (
                                <div className="text-center py-12">
                                    <Trophy size={48} className="mx-auto text-yellow-500 mb-4" />
                                    <h3 className="text-2xl font-black text-white mb-2">All courses explored!</h3>
                                    <p className="text-slate-400">You've started every available course. Amazing!</p>
                                </div>
                            )}
                        </div>

                        {/* Big CTA to Courses */}
                        <button
                            onClick={() => onNavigate(ViewState.WORLD_MAP)}
                            className="w-full p-8 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-[2rem] text-left hover:from-indigo-600/30 hover:to-purple-600/30 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-1">Explore All Courses</h3>
                                    <p className="text-slate-400">{courses.length} courses available across all categories</p>
                                </div>
                                <ArrowRight size={32} className="text-indigo-400 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </button>
                    </div>

                    {/* ─── Right Column (1/3) ─── */}
                    <div className="space-y-6">

                        {/* Level Progress Card */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Level Progress</h3>
                            <div className="text-center mb-4">
                                <div className="relative inline-flex items-center justify-center w-28 h-28">
                                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="44" fill="none" strokeWidth="8" stroke="#1e293b" />
                                        <circle cx="50" cy="50" r="44" fill="none" strokeWidth="8" stroke="url(#xpGrad)" strokeLinecap="round" strokeDasharray={`${xpProgress * 2.76} 276`} />
                                        <defs>
                                            <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#a855f7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black text-white">{user.level}</span>
                                        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Level</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-slate-400"><span className="text-white font-bold">{xpToNext}</span> XP to Level {user.level + 1}</p>
                            </div>
                        </div>

                        {/* Daily Goal */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Daily Goal</h3>
                                <Target size={18} className="text-green-400" />
                            </div>
                            <div className="mb-3">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">{todayXP} / {dailyGoal} XP</span>
                                    <span className="text-white font-bold">{Math.min(dailyProgress, 100)}%</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${Math.min(dailyProgress, 100)}%` }}></div>
                                </div>
                            </div>
                            {dailyProgress >= 100 ? (
                                <p className="text-green-400 text-xs font-bold flex items-center gap-1"><Star size={14} fill="currentColor" /> Goal Achieved!</p>
                            ) : (
                                <p className="text-slate-500 text-xs">Complete a lesson to earn more XP today</p>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button onClick={() => onNavigate(ViewState.WORLD_MAP)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-colors text-left">
                                    <BookOpen size={18} className="text-indigo-400" />
                                    <span className="text-sm text-slate-300 font-medium">Browse Courses</span>
                                </button>
                                <button onClick={() => onNavigate(ViewState.DASHBOARD)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-colors text-left">
                                    <TrendingUp size={18} className="text-green-400" />
                                    <span className="text-sm text-slate-300 font-medium">View Analytics</span>
                                </button>
                                <button onClick={() => onNavigate(ViewState.USER_PROFILE)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-colors text-left">
                                    <Trophy size={18} className="text-yellow-400" />
                                    <span className="text-sm text-slate-300 font-medium">My Profile</span>
                                </button>
                            </div>
                        </div>

                        {/* Overall Progress */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Overall Progress</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Courses Started</span>
                                    <span className="text-white font-bold">{Object.keys(user.completedWorlds).filter((k: string) => ((user.completedWorlds as Record<string, number[]>)[k] || []).length > 0).length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Modules Completed</span>
                                    <span className="text-white font-bold">{totalCompleted}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Mastery Rate</span>
                                    <span className="text-white font-bold">{completionRate}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
