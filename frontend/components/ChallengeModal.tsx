import React, { useState } from 'react';
import { Sword, Trophy, Zap, Target, X, Users, Loader2 } from 'lucide-react';

interface ChallengeModalProps {
    friend: { id: string; username: string; level: number };
    topics: string[];
    onSendChallenge: (friendId: string, topic: string) => void;
    onClose: () => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
    friend,
    topics,
    onSendChallenge,
    onClose
}) => {
    const [selectedTopic, setSelectedTopic] = useState(topics[0] || '');
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!selectedTopic) return;
        setSending(true);
        await onSendChallenge(friend.id, selectedTopic);
        setSending(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border-2 border-red-500/30 rounded-[3rem] max-w-md w-full overflow-hidden shadow-[0_0_80px_rgba(239,68,68,0.2)]">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 p-6 border-b border-red-500/20">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-red-500/20 rounded-2xl border border-red-500/30 animate-pulse">
                                <Sword size={32} className="text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">PvP Challenge</h2>
                                <p className="text-red-400 text-sm font-medium">Interview Battle Mode</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Opponent */}
                <div className="p-6 border-b border-slate-800">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Challenging</p>
                    <div className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                            {friend.username[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg">{friend.username}</p>
                            <p className="text-slate-500 text-sm">Level {friend.level}</p>
                        </div>
                    </div>
                </div>

                {/* Topic Selection */}
                <div className="p-6">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Battle Topic</p>
                    <div className="grid grid-cols-2 gap-3">
                        {topics.map(topic => (
                            <button
                                key={topic}
                                onClick={() => setSelectedTopic(topic)}
                                className={`p-4 rounded-xl border text-left transition-all ${selectedTopic === topic
                                        ? 'bg-red-500/20 border-red-500/50 text-white'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <p className="font-bold text-sm">{topic}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rewards Preview */}
                <div className="px-6 pb-6">
                    <div className="flex items-center justify-around p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                        <div className="flex items-center space-x-2">
                            <Zap size={18} className="text-yellow-400" />
                            <span className="font-bold text-white">+100 XP</span>
                        </div>
                        <div className="w-px h-8 bg-slate-700" />
                        <div className="flex items-center space-x-2">
                            <Trophy size={18} className="text-amber-400" />
                            <span className="font-bold text-white">+10 Gems</span>
                        </div>
                    </div>
                </div>

                {/* Send Button */}
                <div className="p-6 pt-0">
                    <button
                        onClick={handleSend}
                        disabled={!selectedTopic || sending}
                        className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
                    >
                        {sending ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <>
                                <Sword size={24} />
                                <span>Send Challenge</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Challenge notification/request card
interface ChallengeRequestProps {
    challenge: {
        id: string;
        topic: string;
        sender: { username: string; level: number };
        xpReward: number;
        gemReward: number;
    };
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
}

export const ChallengeRequest: React.FC<ChallengeRequestProps> = ({
    challenge,
    onAccept,
    onDecline
}) => (
    <div className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl animate-pulse-subtle">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-500/20 rounded-xl">
                    <Sword size={24} className="text-red-400" />
                </div>
                <div>
                    <p className="font-bold text-white">
                        <span className="text-red-400">{challenge.sender.username}</span> challenges you!
                    </p>
                    <p className="text-sm text-slate-400">Topic: {challenge.topic}</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => onAccept(challenge.id)}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-400 font-bold text-sm transition-colors"
                >
                    Accept
                </button>
                <button
                    onClick={() => onDecline(challenge.id)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 font-bold text-sm transition-colors"
                >
                    Decline
                </button>
            </div>
        </div>
    </div>
);

export default ChallengeModal;
