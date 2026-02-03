
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface HologramProps {
    content: string; // The mermaid syntax
    caption?: string;
}

export const Hologram: React.FC<HologramProps> = ({ content, caption }) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (elementRef.current) {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'dark',
                securityLevel: 'loose',
                fontFamily: 'monospace'
            });

            const render = async () => {
                try {
                    // Clear previous content
                    elementRef.current!.innerHTML = '';

                    // Unique ID for this diagram
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

                    // Render
                    const { svg } = await mermaid.render(id, content);
                    elementRef.current!.innerHTML = svg;
                } catch (error) {
                    console.error('Hologram Render Error:', error);
                    elementRef.current!.innerHTML = '<div class="text-red-500 font-mono text-xs p-4 border border-red-500/30 bg-red-900/10">HOLOGRAPHIC PROJECTION FAILED</div>';
                }
            };

            render();
        }
    }, [content]);

    return (
        <div className="my-8 animate-in fade-in zoom-in duration-700">
            <div className="bg-slate-900/50 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl shadow-[0_0_40px_rgba(79,70,229,0.1)] group hover:shadow-[0_0_80px_rgba(79,70,229,0.2)] transition-shadow">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

                {/* Holographic Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center space-y-4">
                    <div ref={elementRef} className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"></div>
                    {caption && (
                        <p className="text-indigo-300 font-mono text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">{caption}</p>
                    )}
                </div>

                {/* Corner Accents */}
                <div className="absolute top-4 left-4 w-2 h-2 border-t-2 border-l-2 border-indigo-500"></div>
                <div className="absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2 border-indigo-500"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 border-b-2 border-l-2 border-indigo-500"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 border-b-2 border-r-2 border-indigo-500"></div>
            </div>
        </div>
    );
};
