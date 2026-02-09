import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, TrendingUp, Award, LogOut, ChevronDown, FileText, Users, MessageCircle, Trophy } from 'lucide-react';
import { UserState, ViewState } from '../types';

interface UserAvatarDropdownProps {
    user: UserState;
    onNavigate: (view: ViewState) => void;
    onLogout: () => void;
    onShowResume?: () => void;
    onShowFriends?: () => void;
    onShowGroups?: () => void;
    onShowLeaderboard?: () => void;
}

export const UserAvatarDropdown: React.FC<UserAvatarDropdownProps> = ({
    user, onNavigate, onLogout, onShowResume,
    onShowFriends, onShowGroups, onShowLeaderboard
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { icon: User, label: 'My Profile', action: () => onNavigate(ViewState.USER_PROFILE) },
        { icon: Users, label: 'My Squad', action: () => onShowFriends?.() },
        { icon: MessageCircle, label: 'Study Groups', action: () => onShowGroups?.() },
        { icon: Trophy, label: 'Leaderboard', action: () => onShowLeaderboard?.() },
        { icon: FileText, label: 'My Resume', action: () => onShowResume?.() },
        { icon: TrendingUp, label: 'My Progress', action: () => onNavigate(ViewState.DASHBOARD) },
        { icon: Settings, label: 'Settings', action: () => onNavigate(ViewState.ADMIN) },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-2xl bg-slate-900/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all group"
            >
                {/* Avatar */}
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-lg ring-2 ring-slate-800 group-hover:ring-indigo-500/50 transition-all">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>

                {/* User Info */}
                <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-bold text-white">{user.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Level {user.level}</span>
                </div>

                {/* Dropdown Arrow */}
                <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    {/* User Info Header */}
                    <div className="p-6 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-b border-slate-700">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-xl shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{user.name}</h3>
                                <p className="text-sm text-slate-400">Level {user.level} • {user.xp.toLocaleString()} XP</p>
                            </div>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="mt-4">
                            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                <span>PROGRESS TO LEVEL {user.level + 1}</span>
                                <span>{((user.xp % 1000) / 10).toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                    style={{ width: `${(user.xp % 1000) / 10}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.action();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl hover:bg-slate-800 transition-colors text-left group"
                            >
                                <item.icon size={20} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Logout Button */}
                    <div className="p-2 border-t border-slate-700">
                        <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl hover:bg-red-500/10 transition-colors text-left group"
                        >
                            <LogOut size={20} className="text-red-400 group-hover:text-red-300 transition-colors" />
                            <span className="text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
