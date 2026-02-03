
import { WorldId } from '../types';

export type Theme = {
    id: string;
    name: string;
    colors: {
        primary: string; // Tailwind class mostly, or hex
        secondary: string;
        background: string;
        text: string;
        accent: string;
    };
    font: string; // Tailwind font class
    backgroundPattern: string; // CSS-ready string (url or gradient)
    vibe: string; // Description for AI context
};

export const THEMES: Record<WorldId, Theme> = {
    [WorldId.WEB]: {
        id: 'web-brutalism',
        name: 'Neo-Brutalism',
        colors: {
            primary: 'bg-yellow-400',
            secondary: 'bg-black',
            background: 'bg-white',
            text: 'text-black',
            accent: 'border-black'
        },
        font: 'font-sans',
        backgroundPattern: 'radial-gradient(#000 1px, transparent 1px) 0 0 / 20px 20px', // Dotted
        vibe: 'Bold, High Contrast, Structural'
    },
    [WorldId.DATA]: {
        id: 'data-glass',
        name: 'Minority Report',
        colors: {
            primary: 'bg-cyan-500',
            secondary: 'bg-slate-800',
            background: 'bg-slate-900',
            text: 'text-cyan-50',
            accent: 'border-cyan-500/30'
        },
        font: 'font-mono',
        backgroundPattern: 'linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px) 0 0 / 40px 40px', // Grid
        vibe: 'Analytical, Clean, Futuristic'
    },
    [WorldId.CYBER]: {
        id: 'cyber-matrix',
        name: 'The Construct',
        colors: {
            primary: 'bg-green-500',
            secondary: 'bg-black',
            background: 'bg-black',
            text: 'text-green-500',
            accent: 'border-green-500'
        },
        font: 'font-mono',
        backgroundPattern: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(34, 197, 94, 0.1) 20px)', // Scanlines
        vibe: 'Hacker, Terminal, Underground'
    },
    [WorldId.AI]: {
        id: 'ai-ethereal',
        name: 'Neural Correlate',
        colors: {
            primary: 'bg-indigo-600',
            secondary: 'bg-purple-900',
            background: 'bg-slate-950',
            text: 'text-slate-200',
            accent: 'border-indigo-500/50'
        },
        font: 'font-sans',
        backgroundPattern: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.1) 0%, transparent 50%)', // Glow
        vibe: 'Mysterious, Intelligent, Fluid'
    },
    [WorldId.SOC]: {
        id: 'cyber-matrix',
        name: 'Blue Team Ops',
        colors: {
            primary: 'bg-blue-600',
            secondary: 'bg-slate-900',
            background: 'bg-slate-950',
            text: 'text-blue-400',
            accent: 'border-blue-500/50'
        },
        font: 'font-mono',
        backgroundPattern: 'repeating-linear-gradient(45deg, rgba(37, 99, 235, 0.05) 0px, rgba(37, 99, 235, 0.05) 2px, transparent 2px, transparent 10px)',
        vibe: 'Secure, Vigilant, Tactical'
    },
    [WorldId.RED_TEAM]: {
        id: 'cyber-matrix',
        name: 'Red Team Ops',
        colors: {
            primary: 'bg-red-600',
            secondary: 'bg-black',
            background: 'bg-black',
            text: 'text-red-500',
            accent: 'border-red-600'
        },
        font: 'font-mono',
        backgroundPattern: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 1px, transparent 1px) 0 0 / 20px 20px',
        vibe: 'Aggressive, Stealth, Exploit'
    },
    [WorldId.MARKETING]: {
        id: 'web-brutalism',
        name: 'Growth Hacking',
        colors: {
            primary: 'bg-pink-500',
            secondary: 'bg-yellow-300',
            background: 'bg-white',
            text: 'text-black',
            accent: 'border-black'
        },
        font: 'font-sans',
        backgroundPattern: 'linear-gradient(to right, rgba(236, 72, 153, 0.1), rgba(234, 179, 8, 0.1))',
        vibe: 'Vibrant, Viral, Bold'
    },
    [WorldId.PROMPT]: {
        id: 'ai-ethereal',
        name: 'Prompt Palace',
        colors: {
            primary: 'bg-fuchsia-500',
            secondary: 'bg-purple-900',
            background: 'bg-slate-900',
            text: 'text-fuchsia-300',
            accent: 'border-fuchsia-500/50'
        },
        font: 'font-serif',
        backgroundPattern: 'conic-gradient(from 0deg at 50% 50%, rgba(217, 70, 239, 0.1), transparent)',
        vibe: 'Artistic, Linguistic, Magic'
    },
    [WorldId.GENAI]: {
        id: 'data-glass',
        name: 'Genesis Lab',
        colors: {
            primary: 'bg-orange-500',
            secondary: 'bg-orange-900/20',
            background: 'bg-slate-900',
            text: 'text-orange-200',
            accent: 'border-orange-500/30'
        },
        font: 'font-sans',
        backgroundPattern: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 25%, transparent 25%) -20px 0',
        vibe: 'Creative, Generative, Infinite'
    },
    [WorldId.AGENTS]: {
        id: 'cyber-matrix',
        name: 'The Hive',
        colors: {
            primary: 'bg-emerald-500',
            secondary: 'bg-slate-900',
            background: 'bg-black',
            text: 'text-emerald-400',
            accent: 'border-emerald-500/50'
        },
        font: 'font-mono',
        backgroundPattern: 'radial-gradient(circle at center, transparent 0%, rgba(16, 185, 129, 0.1) 100%)',
        vibe: 'Autonomous, Swarm, Efficient'
    }
};
