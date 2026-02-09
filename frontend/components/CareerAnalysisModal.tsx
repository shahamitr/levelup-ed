import React, { useState } from 'react';
import { FileText, Search, ArrowRight, Sparkles, AlertCircle, Briefcase, CheckCircle2, X } from 'lucide-react';
import { aiService } from '../services/api'; // Or use geminiService directly if exposed
import { generateWorldFromTopic } from '../services/geminiService';
import { World } from '../types';

interface CareerAnalysisModalProps {
    onClose: () => void;
    onStartCourse: (topic: string) => void;
}

export const CareerAnalysisModal: React.FC<CareerAnalysisModalProps> = ({ onClose, onStartCourse }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<{
        missingSkills: string[];
        strengths: string[];
        recommendedTopic: string;
        salaryRange: string;
    } | null>(null);

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) return;
        setLoading(true);

        try {
            // We use the general chat endpoint for this analysis
            const prompt = `Act as a Senior Tech Recruiter. Analyze this job description/resume snippet:
            "${jobDescription.substring(0, 500)}..."

            Identify key technical gaps.
            Return ONLY valid JSON:
            {
                "missingSkills": ["Skill 1", "Skill 2", "Skill 3"],
                "strengths": ["Skill A", "Skill B"],
                "recommendedTopic": "The most important single topic to learn (e.g. 'Advanced React Patterns' or 'Kubernetes Security')",
                "salaryRange": "$120k - $160k"
            }`;

            const response = await aiService.chat(prompt, [], "Career Analyst");
            let text = response.data.reply;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) text = jsonMatch[0];

            setAnalysis(JSON.parse(text));
        } catch (error) {
            console.error("Analysis failed", error);
            // Mock fallback for demo if AI fails
            setAnalysis({
                missingSkills: ['System Design', 'Graph databases', 'CI/CD Pipelines'],
                strengths: ['Frontend Basics', 'React'],
                recommendedTopic: 'System Design at Scale',
                salaryRange: '$130k - $150k'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl relative">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-10">
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-900/50 to-slate-900 p-8 border-b border-indigo-500/20">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                            <Briefcase className="text-indigo-400" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Career Pulse Check</h2>
                            <p className="text-indigo-300 font-medium">AI Gap Analysis & Course Recommender</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {!analysis ? (
                        <div className="space-y-6">
                            <p className="text-slate-400 text-sm">Paste a job description you want, or your resume summary. Expected output: We'll tell you what you're missing and build a custom course for it.</p>

                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste Job Description here (e.g., 'Looking for a Senior Frontend Engineer with experience in Next.js, GraphQL, and AWS...')"
                                className="w-full h-40 bg-slate-950/50 border border-slate-700 rounded-2xl p-4 text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none resize-none font-mono text-sm"
                            />

                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !jobDescription}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Sparkles className="animate-spin" size={20} />
                                        <span>Analyzing Market Data...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search size={20} />
                                        <span>Analyze Gaps</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Gaps */}
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                                    <h3 className="text-red-400 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                                        <AlertCircle size={16} /> Missing Skills
                                    </h3>
                                    <ul className="space-y-2">
                                        {analysis.missingSkills.map((skill, i) => (
                                            <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                                <span className="text-red-500 mt-1">•</span> {skill}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Strengths */}
                                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
                                    <h3 className="text-green-400 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                                        <CheckCircle2 size={16} /> Detected Strengths
                                    </h3>
                                    <ul className="space-y-2">
                                        {analysis.strengths.map((skill, i) => (
                                            <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                                <span className="text-green-500 mt-1">•</span> {skill}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Sparkles size={100} />
                                </div>

                                <h3 className="text-indigo-400 font-bold uppercase tracking-wider text-xs mb-2">Recommended Learning Path</h3>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="text-2xl font-black text-white mb-2">{analysis.recommendedTopic}</h4>
                                        <p className="text-slate-400 text-sm">Est. Salary Impact: <span className="text-green-400 font-bold">{analysis.salaryRange}</span></p>
                                    </div>
                                    <button
                                        onClick={() => onStartCourse(analysis.recommendedTopic)}
                                        className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-wide flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                                    >
                                        <span>Generate Course</span>
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
