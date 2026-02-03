import React, { useRef } from 'react';
import { UserState } from '../types';
import { WORLDS } from '../constants';
import { BadgeCheck, Download, MapPin, Mail, Github, Linkedin, Briefcase } from 'lucide-react';

interface ResumeViewProps {
    user: UserState;
}

export const ResumeView: React.FC<ResumeViewProps> = ({ user }) => {
    const resumeRef = useRef<HTMLDivElement>(null);

    // Calculate verified skills from completed worlds
    const verifiedSkills = WORLDS.filter(world => {
        // Check if user has "completed" the world (e.g. at least 5 levels done)
        // Using the schema: completedWorlds: Record<string, number[]>
        // If array length >= totalLevels
        return (user.completedWorlds[world.id]?.length || 0) >= world.totalLevels;
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-slate-800 shadow-2xl relative min-h-[1100px]" ref={resumeRef}>
            {/* Header */}
            <header className="border-b-4 border-slate-900 pb-8 mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                        {user.name}
                    </h1>
                    <p className="text-xl font-mono text-slate-600">Full Stack Developer</p>
                </div>
                <div className="text-right text-sm font-mono space-y-1 text-slate-500">
                    <div className="flex items-center justify-end gap-2">
                        <span>san francisco, ca</span>
                        <MapPin size={14} />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <span>{user.name.toLowerCase().replace(/\s/g, '')}@levelup.dev</span>
                        <Mail size={14} />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <span>github.com/{user.name.toLowerCase().replace(/\s/g, '')}</span>
                        <Github size={14} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-3 gap-12">

                {/* Left Column: Skills & Badges */}
                <div className="col-span-1 space-y-12">

                    <section>
                        <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4">
                            Verified Skills
                        </h3>
                        <div className="space-y-4">
                            {verifiedSkills.length > 0 ? (
                                verifiedSkills.map(skill => (
                                    <div key={skill.id} className="flex items-center gap-3">
                                        <BadgeCheck className="text-blue-600" size={20} />
                                        <span className="font-bold text-slate-700">{skill.name}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 italic text-sm">No skills verified yet.</p>
                            )}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4">
                            Stats
                        </h3>
                        <ul className="space-y-2 font-mono text-sm">
                            <li className="flex justify-between">
                                <span>Level</span>
                                <span className="font-bold">{user.level}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>XP</span>
                                <span className="font-bold">{user.xp}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Focus Score</span>
                                <span className="font-bold">{user.focusScore}%</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Streak</span>
                                <span className="font-bold">{user.streak} Days</span>
                            </li>
                        </ul>
                    </section>

                </div>

                {/* Right Column: Experience & Projects */}
                <div className="col-span-2 space-y-12">

                    <section>
                        <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4">
                            Technical Experience
                        </h3>

                        {verifiedSkills.length > 0 ? (
                            verifiedSkills.map(world => (
                                <div key={world.id} className="mb-6">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-lg">{world.name} Specialist</h4>
                                        <span className="font-mono text-xs text-slate-500">2024 - Present</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-2 italic">LevelUpED Certification</p>
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        {world.description} Demonstrated mastery in {world.name} concepts through rigorous AI-driven technical assessments and project-based learning.
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                                Complete learning tracks to populate your experience.
                            </div>
                        )}
                    </section>

                    <section>
                        <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4">
                            Projects
                        </h3>
                        <div className="mb-6">
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold text-lg">Portfolio Generator</h4>
                                <span className="font-mono text-xs text-slate-500">Open Source</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Built a dynamic resume generation tool using React and TypeScript. Implemented automated skill verification systems.
                            </p>
                        </div>
                    </section>

                </div>
            </div>

            {/* Footer / Floating Action */}
            <button
                onClick={handlePrint}
                className="absolute top-8 right-[-100px] print:hidden bg-slate-900 text-white p-4 rounded-full shadow-xl hover:bg-blue-600 transition-colors tooltip"
                title="Download PDF"
            >
                <Download size={24} />
            </button>

            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .tooltip { display: none; }
          .max-w-4xl, .max-w-4xl * {
            visibility: visible;
          }
          .max-w-4xl {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
          }
        }
      `}</style>
        </div>
    );
};
