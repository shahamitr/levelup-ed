import React from 'react';
import { World, UserState, ViewState, WorldId } from '../types';
import { LayoutGrid, List, Menu, Activity, Plus } from 'lucide-react';
import { WorldPath } from './WorldPath';
import { CourseDrawer } from './CourseDrawer';
import { EnhancedCourseCard } from './EnhancedCourseCard';

interface AdventureMapProps {
    courses: World[];
    user: UserState;
    viewMode: 'card' | 'list';
    setViewMode: (mode: 'card' | 'list') => void;
    isDrawerOpen: boolean;
    setIsDrawerOpen: (isOpen: boolean) => void;
    setSelectedWorld: (world: World) => void;
    setView: (view: ViewState) => void;
    isWorldLocked: (worldId: WorldId) => boolean;
    generateWorldFromTopic: (topic: string) => Promise<any>;
    addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
    setCourses: React.Dispatch<React.SetStateAction<World[]>>;
    startLesson: (world: World) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
    courses,
    user,
    viewMode,
    setViewMode,
    isDrawerOpen,
    setIsDrawerOpen,
    setSelectedWorld,
    setView,
    isWorldLocked,
    generateWorldFromTopic,
    addNotification,
    setCourses,
    startLesson
}) => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800/60 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Your Learning Path</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        <p className="text-slate-400 font-medium text-sm">Master the Codeverse one step at a time</p>

                        <div className="h-4 w-px bg-slate-800 hidden md:block"></div>

                        {/* Controls Group */}
                        <div className="flex items-center gap-3">
                            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`p-1.5 rounded ${viewMode === 'card' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    title="Card View"
                                >
                                    <LayoutGrid size={14} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    title="List View"
                                >
                                    <List size={14} />
                                </button>
                            </div>

                            <button
                                onClick={() => setIsDrawerOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-400 hover:text-white hover:border-indigo-500 transition-colors text-[10px] font-mono uppercase tracking-wider"
                            >
                                <Menu size={12} />
                                <span>Quick Nav</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-3 pr-6 rounded-full border border-slate-800 flex items-center space-x-4 backdrop-blur-xl">
                    <div className="p-2 bg-green-500/10 rounded-full">
                        <Activity size={20} className="text-green-500" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Global Rank</p>
                        <p className="text-sm font-black text-white leading-none">Top 5%</p>
                    </div>
                </div>
            </div>

            {/* Course Navigation Drawer */}
            <CourseDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                courses={courses}
                user={user}
                onSelectWorld={(world) => {
                    const completed = user.completedWorlds[world.id] || [];
                    const nextLevel = completed.length < world.totalLevels ? completed.length + 1 : 1;
                    const element = document.getElementById(`world-card-${world.id}`);
                    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    setIsDrawerOpen(false);
                }}
            />

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pb-6">
                <input
                    type="text"
                    placeholder="Search skills..."
                    className="w-full md:w-80 px-5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 text-sm"
                />

                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {['All', 'Web', 'Data', 'Cloud', 'AI', 'Security'].map(filter => (
                        <button
                            key={filter}
                            className="px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Display - Categorized Grid */}
            <div className="space-y-12">
                {/* Featured / In Progress Section */}
                {user.lastActive > 0 && (
                    <div>
                        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                            <Activity className="text-indigo-400" size={18} />
                            <span>Continue Learning</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses
                                .filter(c => (user.completedWorlds[c.id] || []).length > 0 && (user.completedWorlds[c.id] || []).length < c.totalLevels)
                                .map(world => (
                                    <EnhancedCourseCard
                                        key={world.id}
                                        world={world}
                                        completedLevels={user.completedWorlds[world.id] || []}
                                        isLocked={false}
                                        onStart={() => startLesson(world)}
                                        onBossFight={() => {
                                            setSelectedWorld(world);
                                            setView(ViewState.BOSS_FIGHT);
                                        }}
                                    />
                                ))}
                        </div>
                    </div>
                )}

                {/* All Courses Grid */}
                <div>
                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                        <LayoutGrid className="text-slate-400" size={18} />
                        <span>All Learning Paths</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses.map(world => (
                            <div key={world.id} id={`world-card-${world.id}`}>
                                <EnhancedCourseCard
                                    world={world}
                                    completedLevels={user.completedWorlds[world.id] || []}
                                    isLocked={isWorldLocked(world.id)}
                                    onStart={() => {
                                        if (isWorldLocked(world.id)) {
                                            addNotification("LOCKED: COMPLETE PREVIOUS WORLD FIRST", 'error');
                                        } else {
                                            startLesson(world);
                                        }
                                    }}
                                    onBossFight={() => {
                                        setSelectedWorld(world);
                                        setView(ViewState.BOSS_FIGHT);
                                    }}
                                />
                            </div>
                        ))}

                        {/* Instant World Generator Card */}
                        <div className="h-full">
                            <button
                                onClick={async () => {
                                    const topic = prompt("What do you want to learn? (e.g. Rust, Astrophysics, GenAI)");
                                    if (topic) {
                                        addNotification("GENERATING WORLD... STAND BY", 'info');
                                        const newWorld = await generateWorldFromTopic(topic);
                                        if (newWorld) {
                                            setCourses(prev => [...prev, newWorld]);
                                            addNotification(`WORLD GENERATED: ${newWorld.name.toUpperCase()}`, 'success');
                                        } else {
                                            addNotification("GENERATION FAILED", 'error');
                                        }
                                    }
                                }}
                                className="w-full h-full min-h-[16rem] border-2 border-dashed border-slate-700/50 rounded-[2rem] flex flex-col items-center justify-center space-y-3 hover:border-indigo-500/50 hover:bg-slate-900/30 transition-all group cursor-pointer p-6"
                            >
                                <div className="p-4 bg-slate-800/50 rounded-full group-hover:bg-indigo-600 transition-colors shadow-lg group-hover:shadow-indigo-500/25">
                                    <Plus size={24} className="text-slate-400 group-hover:text-white" />
                                </div>
                                <span className="font-black text-slate-500 uppercase tracking-widest text-[10px] group-hover:text-indigo-400 transition-colors text-center w-3/4">Generate Custom Path</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
