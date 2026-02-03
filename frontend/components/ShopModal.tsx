import React from 'react';
import { Gem, Snowflake, X, Layers } from 'lucide-react';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    gems: number;
    freezeCount: number;
    onBuyFreeze: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose, gems, freezeCount, onBuyFreeze }) => {
    if (!isOpen) return null;

    const FREEZE_COST = 50;
    const canAffordFreeze = gems >= FREEZE_COST;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <header className="mb-8 text-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Item Shop
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-cyan-400 bg-slate-800/50 py-1 px-4 rounded-full mx-auto w-fit">
                        <Gem size={18} className="fill-cyan-400" />
                        <span className="font-bold">{gems} Gems Available</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Streak Freeze Item */}
                    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex flex-col items-center text-center hover:border-cyan-500 transition-all group">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Snowflake size={40} className="text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Streak Freeze</h3>
                        <p className="text-slate-400 text-sm mb-6 flex-grow">
                            Miss a day of practice without losing your streak. You can hold up to 2 freezes.
                        </p>

                        <div className="text-sm text-slate-500 mb-2">
                            Inventory: <span className="text-white">{freezeCount} / 2</span>
                        </div>

                        <button
                            onClick={onBuyFreeze}
                            disabled={!canAffordFreeze || freezeCount >= 2}
                            className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${canAffordFreeze && freezeCount < 2
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            <Gem size={16} />
                            {freezeCount >= 2 ? 'Max Capacity' : `${FREEZE_COST}`}
                        </button>
                    </div>

                    {/* Theme Pack Item (Placeholder) */}
                    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex flex-col items-center text-center opacity-75">
                        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                            <Layers size={40} className="text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Cyber Theme</h3>
                        <p className="text-slate-400 text-sm mb-6 flex-grow">
                            Customize your profile with a futuristic Cyberpunk visual theme.
                        </p>

                        <button disabled className="w-full py-2 bg-slate-700 text-slate-500 rounded-lg font-bold cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
