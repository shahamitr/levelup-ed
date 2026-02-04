import React, { useState } from 'react';
import { Users, UserPlus, Search, Check, X, Sword, MessageCircle, Crown, Loader2 } from 'lucide-react';

interface Friend {
    id: string;
    username: string;
    level: number;
    xp: number;
}

interface PendingRequest {
    id: string;
    sender: { id: string; username: string; level: number };
}

interface FriendsListProps {
    friends: Friend[];
    pendingRequests: PendingRequest[];
    onSendRequest: (userId: string) => void;
    onAcceptRequest: (requestId: string) => void;
    onDeclineRequest: (requestId: string) => void;
    onChallenge: (friendId: string) => void;
    onSearch: (query: string) => Promise<Friend[]>;
    onClose: () => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({
    friends,
    pendingRequests,
    onSendRequest,
    onAcceptRequest,
    onDeclineRequest,
    onChallenge,
    onSearch,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'search'>('friends');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Friend[]>([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const results = await onSearch(searchQuery);
            setSearchResults(results);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-700 rounded-[3rem] max-w-lg w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-indigo-600/20 rounded-2xl">
                            <Users size={24} className="text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-black text-white">Friends</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    {[
                        { id: 'friends', label: 'Friends', count: friends.length },
                        { id: 'pending', label: 'Requests', count: pendingRequests.length },
                        { id: 'search', label: 'Add Friend' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === tab.id
                                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-indigo-600/30 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    {activeTab === 'friends' && (
                        <div className="space-y-3">
                            {friends.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <Users size={40} className="mx-auto mb-3 opacity-50" />
                                    <p>No friends yet. Add some!</p>
                                </div>
                            ) : (
                                friends.map(friend => (
                                    <div
                                        key={friend.id}
                                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {friend.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{friend.username}</p>
                                                <p className="text-xs text-slate-500">Level {friend.level} • {friend.xp.toLocaleString()} XP</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onChallenge(friend.id)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 text-sm font-bold transition-colors"
                                        >
                                            <Sword size={16} />
                                            <span>Challenge</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'pending' && (
                        <div className="space-y-3">
                            {pendingRequests.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <MessageCircle size={40} className="mx-auto mb-3 opacity-50" />
                                    <p>No pending requests</p>
                                </div>
                            ) : (
                                pendingRequests.map(req => (
                                    <div
                                        key={req.id}
                                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {req.sender.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{req.sender.username}</p>
                                                <p className="text-xs text-slate-500">Level {req.sender.level}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onAcceptRequest(req.id)}
                                                className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-400 transition-colors"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDeclineRequest(req.id)}
                                                className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div className="space-y-4">
                            <div className="flex space-x-2">
                                <div className="flex-1 relative">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Search by username..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    disabled={searching}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold transition-colors disabled:opacity-50"
                                >
                                    {searching ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
                                </button>
                            </div>

                            <div className="space-y-3">
                                {searchResults.map(user => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{user.username}</p>
                                                <p className="text-xs text-slate-500">Level {user.level}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onSendRequest(user.id)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-indigo-400 text-sm font-bold transition-colors"
                                        >
                                            <UserPlus size={16} />
                                            <span>Add</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendsList;
