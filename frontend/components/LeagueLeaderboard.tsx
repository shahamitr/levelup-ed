import React from 'react';
import { Shield, Trophy, ArrowUp, ArrowDown, User } from 'lucide-react';

interface LeagueUser {
    id: string;
    username: string;
    xp: number;
    rank: number;
    isCurrentUser?: boolean;
}

interface LeagueLeaderboardProps {
    leagueName: string;
    users: LeagueUser[];
}

export const LeagueLeaderboard: React.FC<LeagueLeaderboardProps> = ({ leagueName, users }) => {
    const getLeagueColor = (name: string) => {
        switch (name.toLowerCase()) {
            case 'bronze': return 'text-amber-700 border-amber-700';
            case 'silver': return 'text-slate-400 border-slate-400';
            case 'gold': return 'text-yellow-500 border-yellow-500';
            default: return 'text-blue-500 border-blue-500';
        }
    };

    const sortedUsers = [...users].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));

    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-xl p-4 w-full max-w-md">
            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${getLeagueColor(leagueName)}`}>
                <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    <h2 className="text-xl font-bold uppercase tracking-wider">{leagueName} League</h2>
                </div>
                <span className="text-xs text-slate-400">Time left: 2d 5h</span>
            </div>

            <div className="space-y-2">
                {sortedUsers.slice(0, 10).map((user) => (
                    <div
                        key={user.id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${user.isCurrentUser ? 'bg-indigo-600/20 border border-indigo-500' : 'bg-slate-800/50 border border-transparent hover:bg-slate-800'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`font-mono font-bold w-6 text-center ${user.rank <= 3 ? 'text-yellow-400' : 'text-slate-500'
                                }`}>
                                {user.rank}
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                    <User size={16} />
                                </div>
                                <span className={user.isCurrentUser ? 'text-indigo-200 font-bold' : 'text-slate-300'}>
                                    {user.username} {user.isCurrentUser && '(You)'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-bold text-slate-200">{user.xp} XP</span>
                            {user.rank <= 3 && <ArrowUp size={16} className="text-green-400" />}
                            {user.rank > 25 && <ArrowDown size={16} className="text-red-400" />}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 text-center text-xs text-slate-500">
                Top 3 promote • Bottom 5 demote
            </div>
        </div>
    );
};
