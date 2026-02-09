
import React, { useState, useEffect } from 'react';
import { ArrowRight, BrainCircuit, Users, TrendingUp, ShieldCheck, Zap, Award, Target, Code, Cpu, Globe, Rocket, CheckCircle, Menu, X, ChevronRight, Trophy, Briefcase, Star, MessageSquare, Building2, Quote } from 'lucide-react';
import { PlatformShowcase } from './PlatformShowcase';

interface LandingPageProps {
    onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Curriculum', href: '#curriculum' },
        { name: 'AI Mentor', href: '#ai' },
        { name: 'Enterprise', href: '#enterprise' },
        { name: 'Success Stories', href: '#stories' }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">

            {/* Navigation Bar */}
            <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                            <BrainCircuit size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter italic">LEVEL<span className="text-indigo-400">UP</span>ED</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} className="text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={onStart} className="text-sm font-bold text-slate-300 hover:text-white tracking-widest uppercase">Login</button>
                        <button
                            onClick={onStart}
                            className="bg-white text-slate-950 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 p-6 flex flex-col space-y-6 animate-in slide-in-from-top-4">
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} className="text-lg font-bold text-slate-300" onClick={() => setMobileMenuOpen(false)}>{link.name}</a>
                        ))}
                        <div className="pt-4 border-t border-slate-800 flex flex-col space-y-4">
                            <button onClick={onStart} className="w-full py-3 bg-slate-800 rounded-xl font-bold uppercase tracking-widest text-xs">Login</button>
                            <button onClick={onStart} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs">Start Free Trial</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[100px] -z-10"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-indigo-300 text-[10px] font-black tracking-[0.2em] uppercase">Voted #1 EdTech Platform 2025</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Master Coding with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">Adaptive AI Intelligence</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        From college graduate to confident professional. Get personalized AI mentorship, hands-on projects, and industry-recognized certifications that open doors to your dream tech career.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <button
                            onClick={onStart}
                            className="group relative px-10 py-5 bg-white text-slate-950 rounded-full font-black text-sm md:text-base uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all hover:-translate-y-1"
                        >
                            <span className="flex items-center space-x-3">
                                <span>Start Your Journey</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button
                            onClick={onStart}
                            className="px-10 py-5 bg-slate-900 border border-slate-700 hover:border-indigo-500/50 text-white rounded-full font-black text-sm md:text-base uppercase tracking-widest transition-all hover:bg-slate-800"
                        >
                            View Curriculum
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-slate-800/50 pt-12 animate-in fade-in duration-1000 delay-500">
                        {[
                            { label: 'Active Learners', value: '10k+' },
                            { label: 'Lines of Code', value: '5M+' },
                            { label: 'Hiring Partners', value: '500+' },
                            { label: 'Completion Rate', value: '94%' }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Section - Platform Mission & Outcomes */}
            <section className="py-24 px-6 bg-gradient-to-b from-slate-950 via-indigo-950/10 to-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-indigo-400 font-mono text-xs font-black tracking-[0.3em] uppercase mb-4">Transform Your Future</h2>
                        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter max-w-4xl mx-auto leading-tight">
                            Breaking Down Barriers to Tech Careers
                        </h3>
                        <p className="text-lg text-slate-400 max-w-3xl mx-auto mt-6 leading-relaxed">
                            Traditional education leaves you with knowledge but no portfolio. Bootcamps are expensive and inflexible.
                            <span className="text-white font-bold"> LevelUpEd bridges the gap</span> — providing professional-grade training at a fraction of the cost,
                            on your schedule, with AI mentorship available 24/7.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                        {/* Impact Card 1 */}
                        <div className="bg-slate-900/50 border border-indigo-500/20 rounded-3xl p-8 hover:border-indigo-500/40 transition-all">
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="bg-indigo-500/10 p-3 rounded-xl">
                                    <TrendingUp className="text-indigo-400" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white mb-2">Career Acceleration</h4>
                                    <p className="text-indigo-300 font-mono text-sm">For College Students & Fresh Graduates</p>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Stand out in competitive job markets with a portfolio of real projects. Our learners report <span className="text-green-400 font-bold">3x faster interview callbacks</span> compared to traditional graduates.
                            </p>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-start space-x-3">
                                    <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span>Build 10+ portfolio-ready projects in your first 90 days</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span>Learn industry tools used by Google, Meta, and startups</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span>Practice mock interviews with AI that mimics FAANG-level rigor</span>
                                </li>
                            </ul>
                        </div>

                        {/* Impact Card 2 */}
                        <div className="bg-slate-900/50 border border-purple-500/20 rounded-3xl p-8 hover:border-purple-500/40 transition-all">
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="bg-purple-500/10 p-3 rounded-xl">
                                    <ShieldCheck className="text-purple-400" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white mb-2">Career Switching Made Possible</h4>
                                    <p className="text-purple-300 font-mono text-sm">For Working Professionals</p>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Transition into tech without quitting your job. Our flexible, project-based approach lets you <span className="text-purple-400 font-bold">reskill in 6-9 months</span> while maintaining income.
                            </p>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-start space-x-3">
                                    <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span>Self-paced modules fit around your 9-5 schedule</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span>Start with fundamentals, scale to advanced specializations</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span>Earn verifiable certificates recognized by 500+ hiring partners</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Mission Statement */}
                    <div className="text-center bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-indigo-900/30 border border-indigo-500/30 rounded-3xl p-12">
                        <h4 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
                            "Education should be a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">bridge, not a barrier</span>"
                        </h4>
                        <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            We believe every motivated learner deserves access to world-class tech education.
                            LevelUpEd combines cutting-edge AI with proven pedagogy to deliver outcomes that rival $15,000+ bootcamps —
                            at a price point accessible to students and career changers worldwide.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-8 text-center">
                            <div>
                                <div className="text-4xl font-black text-indigo-400 mb-1">89%</div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Job Placement Rate</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-purple-400 mb-1">$68k</div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Avg. Starting Salary</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-cyan-400 mb-1">6 mo</div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Avg. Time to Job Offer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid ("Why Us") */}
            <section className="py-32 bg-slate-900/30 border-y border-slate-800 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-indigo-500 font-mono text-xs font-black tracking-[0.3em] uppercase mb-4">The LevelUpEd Advantage</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Built for the Modern Engineer</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-10 bg-slate-950 border border-slate-800 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group hover:-translate-y-2">
                            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-500/20 transition-colors">
                                <BrainCircuit size={32} className="text-indigo-400" />
                            </div>
                            <h4 className="text-2xl font-black text-white mb-4">Adaptive AI Engine</h4>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Our proprietary algorithm analyzes your code structure, speed, and error patterns to tailor the curriculum in real-time. Too easy? We ramp up the complexity.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    <CheckCircle size={14} className="text-green-500" /> <span>Context-Aware Hints</span>
                                </li>
                                <li className="flex items-center space-x-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    <CheckCircle size={14} className="text-green-500" /> <span>Automated Code Review</span>
                                </li>
                            </ul>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-10 bg-slate-950 border border-slate-800 rounded-[2.5rem] hover:border-purple-500/30 transition-all group hover:-translate-y-2">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-500/20 transition-colors">
                                <Trophy size={32} className="text-purple-400" />
                            </div>
                            <h4 className="text-2xl font-black text-white mb-4">Gamified Progression</h4>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Turn your career growth into an RPG. Earn XP, unlock achievements, maintain streaks, and battle "Bosses" (Senior Dev Interviews) to level up.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    <CheckCircle size={14} className="text-green-500" /> <span>Daily Quests & Loot</span>
                                </li>
                                <li className="flex items-center space-x-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    <CheckCircle size={14} className="text-green-500" /> <span>Global Leaderboards</span>
                                </li>
                            </ul>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-10 bg-slate-950 border border-slate-800 rounded-[2.5rem] hover:border-cyan-500/30 transition-all group hover:-translate-y-2">
                            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-cyan-500/20 transition-colors">
                                <Award size={32} className="text-cyan-400" />
                            </div>
                            <h4 className="text-2xl font-black text-white mb-4">Industry Certification</h4>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Don't just learn. Prove it. Our rigorous capstone assessments generate cryptographically verifiable certificates that hiring managers trust.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    <CheckCircle size={14} className="text-green-500" /> <span>Project-Based Portfolio</span>
                                </li>
                                <li className="flex items-center space-x-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    <CheckCircle size={14} className="text-green-500" /> <span>LinkedIn Integration</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum Preview */}
            <section className="py-32 px-6" id="curriculum">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-8 md:space-y-0">
                        <div>
                            <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Choose Your Path</h2>
                        </div>
                        <button onClick={onStart} className="flex items-center space-x-2 text-indigo-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">
                            <span>View Full Catalog</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { color: 'bg-orange-500', icon: Code, title: 'Frontend Specialist', count: '12 Courses' },
                            { color: 'bg-blue-500', icon: Cpu, title: 'Backend Architect', count: '8 Courses' },
                            { color: 'bg-green-500', icon: Globe, title: 'DevOps & Cloud', count: '15 Courses' },
                            { color: 'bg-pink-500', icon: BrainCircuit, title: 'AI Engineer', count: '10 Courses' },
                        ].map((path, i) => (
                            <div key={i} className="group relative p-8 bg-slate-900 border border-slate-800 rounded-[2rem] hover:bg-slate-800 transition-all cursor-pointer overflow-hidden" onClick={onStart}>
                                <div className={`absolute top-0 right-0 p-32 ${path.color} opacity-5 blur-[80px] group-hover:opacity-10 transition-opacity`}></div>
                                <div className={`w-12 h-12 ${path.color} bg-opacity-20 rounded-xl flex items-center justify-center mb-20 text-whiteGroup-hover:scale-110 transition-transform`}>
                                    <path.icon size={24} className="text-white" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">{path.title}</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{path.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Mentor Section */}
            <section className="py-32 px-6 bg-slate-900/20" id="ai">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-8">
                                <Zap className="text-purple-400" size={16} />
                                <span className="text-purple-300 text-[10px] font-black tracking-[0.2em] uppercase">Powered by Gemini Pro</span>
                            </div>
                            <h2 className="text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
                                Meet Your New <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">24/7 AI Mentor</span>
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Stuck on a bug at 2 AM? Need a mock interview before your Google onsite? Your AI coach is always ready.
                                It doesn't just give answers—it guides you to the solution, adapting to your learning style and pacing.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: 'Real-time Code Analysis', desc: 'Instant feedback on complexity and style as you type.' },
                                    { title: 'Socratic Debugging', desc: 'Guides you to find the root cause instead of fixing it for you.' },
                                    { title: 'Personalized Curriculum', desc: 'Dynamically generates new modules based on your weak points.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start space-x-4">
                                        <div className="bg-slate-800 p-2 rounded-lg mt-1">
                                            <MessageSquare size={18} className="text-indigo-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{item.title}</h4>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <PlatformShowcase />
                        </div>
                    </div>
                </div>
            </section>

            {/* Enterprise Section */}
            <section className="py-32 px-6 relative" id="enterprise">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-indigo-500 font-mono text-xs font-black tracking-[0.3em] uppercase mb-4">For Teams</h2>
                        <h3 className="text-5xl font-black text-white tracking-tighter uppercase italic">Enterprise Solutions</h3>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                            <div className="col-span-1 md:col-span-2 space-y-8">
                                <h4 className="text-3xl font-bold text-white">Upskill your engineering team with data-driven precision.</h4>
                                <p className="text-slate-400 text-lg">
                                    Stop relying on generic video libraries. Give your team a platform that adapts to their skill gaps,
                                    tracks their velocity, and proves ROI through measurable project outcomes.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <button className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-indigo-50 transition-colors uppercase tracking-widest text-xs">
                                        Book a Demo
                                    </button>
                                    <button className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs">
                                        View Case Studies
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
                                    <Building2 className="text-indigo-400 mb-4" size={28} />
                                    <h5 className="text-white font-bold mb-2">Custom Learning Paths</h5>
                                    <p className="text-slate-500 text-sm">Align curriculum with your tech stack and Q4 goals.</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
                                    <Users className="text-indigo-400 mb-4" size={28} />
                                    <h5 className="text-white font-bold mb-2">Team Analytics</h5>
                                    <p className="text-slate-500 text-sm">Track engagement, skill velocity, and project completion rates.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Stories Section */}
            <section className="py-32 px-6 bg-slate-900/20" id="stories">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-indigo-500 font-mono text-xs font-black tracking-[0.3em] uppercase mb-4">Wall of Love</h2>
                        <h3 className="text-5xl font-black text-white tracking-tighter uppercase italic">Success Stories</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah Chen", role: "Software Engineer at Google", text: "I was stuck in tutorial hell for years. LevelUpEd's AI mentor pushed me to build real projects. The mock interviews were harder than the real thing!", image: "https://i.pravatar.cc/150?u=sarah" },
                            { name: "Marcus Johnson", role: "Frontend Lead at Vercel", text: "The gamification kept me addicted. I treated learning React like leveling up in an RPG. 6 months later, I doubled my salary.", image: "https://i.pravatar.cc/150?u=marcus" },
                            { name: "Elena Rodriguez", role: "Full Stack Dev at Airbnb", text: "Traditional bootcamps cost $15k and move too slow. This platform adapted to my pace. The certification actually impressed my hiring manager.", image: "https://i.pravatar.cc/150?u=elena" }
                        ].map((story, i) => (
                            <div key={i} className="bg-slate-950 border border-slate-800 p-8 rounded-3xl relative hover:-translate-y-2 transition-transform">
                                <Quote className="absolute top-8 right-8 text-slate-800" size={48} />
                                <div className="flex items-center space-x-4 mb-6">
                                    <img src={story.image} alt={story.name} className="w-12 h-12 rounded-full border-2 border-indigo-500/30" />
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{story.name}</h4>
                                        <p className="text-indigo-400 text-xs">{story.role}</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 leading-relaxed text-sm relative z-10">"{story.text}"</p>
                                <div className="flex text-yellow-500 mt-6 space-x-1">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-900 to-violet-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">Ready to Level Up?</h2>
                        <p className="text-xl text-indigo-200 max-w-2xl mx-auto">Join 10,000+ engineers who are accelerating their careers with LevelUpEd today.</p>
                        <button
                            onClick={onStart}
                            className="inline-block px-12 py-6 bg-white text-indigo-900 rounded-full font-black text-xl uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform"
                        >
                            Get Started for Free
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-slate-900 py-16 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-50 text-xs font-mono uppercase tracking-widest text-slate-500">
                    <p>&copy; 2026 LevelUpEd Inc. All rights reserved.</p>
                    <div className="flex space-x-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
