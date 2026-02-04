import React, { useState } from 'react';
import { Users, Plus, Search, MessageCircle, Crown, X, UserPlus, Loader2 } from 'lucide-react';

interface StudyGroup {
    id: string;
    name: string;
    topic: string;
    description?: string;
    owner: { username: string };
    _count: { members: number };
    maxMembers: number;
    myRole?: string;
}

interface StudyGroupListProps {
    groups: StudyGroup[];
    myGroups: StudyGroup[];
    onJoinGroup: (groupId: string) => void;
    onLeaveGroup: (groupId: string) => void;
    onCreateGroup: (data: { name: string; topic: string; description?: string }) => void;
    onOpenGroup: (groupId: string) => void;
    onClose: () => void;
}

export const StudyGroupList: React.FC<StudyGroupListProps> = ({
    groups,
    myGroups,
    onJoinGroup,
    onLeaveGroup,
    onCreateGroup,
    onOpenGroup,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState<'discover' | 'my' | 'create'>('my');
    const [searchQuery, setSearchQuery] = useState('');
    const [creating, setCreating] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', topic: '', description: '' });

    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = async () => {
        if (!newGroup.name || !newGroup.topic) return;
        setCreating(true);
        await onCreateGroup(newGroup);
        setNewGroup({ name: '', topic: '', description: '' });
        setCreating(false);
        setActiveTab('my');
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-700 rounded-[3rem] max-w-2xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-purple-600/20 rounded-2xl">
                            <Users size={24} className="text-purple-400" />
                        </div>
                        <h2 className="text-xl font-black text-white">Study Groups</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    {[
                        { id: 'my', label: 'My Groups', count: myGroups.length },
                        { id: 'discover', label: 'Discover' },
                        { id: 'create', label: 'Create New' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === tab.id
                                    ? 'text-purple-400 border-b-2 border-purple-500'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-purple-600/30 rounded-full text-xs">{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    {activeTab === 'my' && (
                        <div className="space-y-3">
                            {myGroups.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <Users size={40} className="mx-auto mb-3 opacity-50" />
                                    <p>No groups yet. Join or create one!</p>
                                </div>
                            ) : (
                                myGroups.map(group => (
                                    <div
                                        key={group.id}
                                        onClick={() => onOpenGroup(group.id)}
                                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700 cursor-pointer hover:border-purple-500/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                                                {group.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <p className="font-bold text-white">{group.name}</p>
                                                    {group.myRole === 'owner' && <Crown size={14} className="text-yellow-400" />}
                                                </div>
                                                <p className="text-xs text-slate-500">{group.topic} • {group._count?.members || 0} members</p>
                                            </div>
                                        </div>
                                        <MessageCircle size={20} className="text-slate-500" />
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'discover' && (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search groups..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="space-y-3">
                                {filteredGroups.map(group => (
                                    <div
                                        key={group.id}
                                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                                                {group.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{group.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {group.topic} • {group._count?.members || 0}/{group.maxMembers} members
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onJoinGroup(group.id)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl text-purple-400 text-sm font-bold transition-colors"
                                        >
                                            <UserPlus size={16} />
                                            <span>Join</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'create' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">Group Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., React Mastery Cohort"
                                    value={newGroup.name}
                                    onChange={e => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">Topic/Focus</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Frontend Engineering"
                                    value={newGroup.topic}
                                    onChange={e => setNewGroup(prev => ({ ...prev, topic: e.target.value }))}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">Description (Optional)</label>
                                <textarea
                                    placeholder="What's this group about?"
                                    value={newGroup.description}
                                    onChange={e => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                                />
                            </div>
                            <button
                                onClick={handleCreate}
                                disabled={!newGroup.name || !newGroup.topic || creating}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {creating ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        <span>Create Group</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyGroupList;
