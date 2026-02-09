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
        <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in">
            <div className="flex justify-between items-center pb-6 border-b border-slate-800/60">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Your Learning Path</h2>
                    <div className="flex items-center gap-3 mt-2">
                        <p className="text-slate-400 font-medium text-sm">Master the Codeverse one step at a time</p>

                        {/* View Toggles */}
                        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-2 rounded ${viewMode === 'card' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                title="Card View"
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                title="List View"
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-400 hover:text-white hover:border-indigo-500 transition-colors text-xs font-mono uppercase tracking-wider mt-4 md:mt-0 md:ml-4 inline-flex"
                    >
                        <Menu size={14} />
                        <span>Quick Nav</span>
                    </button>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-[2.5rem] border border-slate-800 flex items-center space-x-6 backdrop-blur-xl">
                    <Activity size={24} className="text-green-500 animate-pulse" />
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Rank</p>
                        <p className="text-lg font-bold text-white">Top 5%</p>
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
                    // Jump logic: Find first incomplete level or start from 1
                    const completed = user.completedWorlds[world.id] || [];
                    const nextLevel = completed.length < world.totalLevels ? completed.length + 1 : 1;
                    const element = document.getElementById(`world-card-${world.id}`);
                    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    setIsDrawerOpen(false);
                }}
            />

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pb-8 border-b border-slate-800/50">
                <input
                    type="text"
                    placeholder="Search skills, languages, or concepts..."
                    className="w-full md:w-96 px-6 py-3 bg-slate-900 border border-slate-700 rounded-full text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />

                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {['All', 'Web', 'Data', 'Cloud', 'AI', 'Security'].map(filter => (
                        <button
                            key={filter}
                            className="px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Display - Categorized Grid */}
            <div className="space-y-16">
                {/* Featured / In Progress Section */}
                {user.lastActive > 0 && (
                    <div>
                        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                            <Activity className="text-indigo-400" size={20} />
                            <span>Continue Learning</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                        <LayoutGrid className="text-slate-400" size={20} />
                        <span>All Learning Paths</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                        <div className="h-full min-h-[400px]">
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
                                className="w-full h-full border-2 border-dashed border-slate-700/50 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 hover:border-indigo-500/50 hover:bg-slate-900/30 transition-all group cursor-pointer p-8"
                            >
                                <div className="p-6 bg-slate-800/50 rounded-full group-hover:bg-indigo-600 transition-colors shadow-lg group-hover:shadow-indigo-500/25">
                                    <Plus size={32} className="text-slate-400 group-hover:text-white" />
                                </div>
                                <span className="font-black text-slate-500 uppercase tracking-widest text-xs group-hover:text-indigo-400 transition-colors text-center w-3/4">Generate Custom Learning Path</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
