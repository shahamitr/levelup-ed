
import React from 'react';
import { UserState, World, SkillProfile } from '../types';
import { MASTER_ACHIEVEMENTS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Activity, Award, Flame, Zap, Target, Brain, ShieldCheck, Package, TrendingUp, Lock, Flag } from 'lucide-react';

interface DashboardProps {
  user: UserState;
  courses: World[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, courses }) => {
  const chartData = courses.map(world => {
    const completedCount = user.completedWorlds[world.id]?.length || 0;
    return {
      name: world.name.split(' ')[0],
      xp: (completedCount * 500) + 100,
      color: world.primaryColor.includes('blue') ? '#60a5fa' :
        world.primaryColor.includes('green') ? '#4ade80' :
          world.primaryColor.includes('red') ? '#f87171' : '#c084fc'
    };
  });

  const radarData = [
    { subject: 'Logic', A: user.skillProfile.logic, fullMark: 100 },
    { subject: 'Arch', A: user.skillProfile.architecture, fullMark: 100 },
    { subject: 'Syntax', A: user.skillProfile.syntax, fullMark: 100 },
    { subject: 'Security', A: user.skillProfile.security, fullMark: 100 },
  ];

  const totalMastery = courses.reduce((acc, w) => acc + (user.completedWorlds[w.id]?.length || 0), 0);
  const masteryRatio = Math.round((totalMastery / (courses.length * 5)) * 100);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap size={24} />;
      case 'Brain': return <Brain size={24} />;
      case 'Flag': return <Flag size={24} />;
      case 'Award': return <Award size={24} />;
      case 'Flame': return <Flame size={24} />;
      default: return <Award size={24} />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Career Analytics</h2>
          <p className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.2em] mt-2 opacity-70">SKILL GAP ANALYSIS // STUDENT {user.name.toUpperCase()}</p>
        </div>
        <div className="bg-slate-900/40 px-6 py-4 rounded-3xl border border-slate-800 backdrop-blur-3xl flex items-center space-x-4 shadow-xl">
          <Activity className="text-green-500 animate-pulse" size={24} />
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Engagement</p>
            <p className="text-xl font-bold text-white tracking-tighter">OPTIMAL</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Zap size={20} fill="currentColor" />} label="TOTAL XP" value={user.xp.toLocaleString()} color="text-indigo-400" />
        <StatCard icon={<Award size={20} />} label="PROFICIENCY" value={user.level} color="text-yellow-400" />
        <StatCard icon={<Flame size={20} fill="currentColor" />} label="DAY STREAK" value={`${user.streak} DAYS`} color="text-orange-500" />
        <StatCard icon={<Target size={20} />} label="COMPLETION" value={`${masteryRatio}%`} color="text-green-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Radar Chart: Neural Profile */}
        {/* Radar Chart: Neural Profile */}
        <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/40 p-8 rounded-[2rem] backdrop-blur-3xl shadow-xl flex flex-col items-center">
          <h3 className="text-lg font-black text-white flex items-center uppercase italic mb-6 w-full">
            <Brain className="mr-3 text-purple-500" size={20} /> Skill Profile
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                <Radar name="Student" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Main Line Chart: Focus Tracking */}
        <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800/40 p-8 rounded-[2rem] backdrop-blur-3xl shadow-xl">
          <h3 className="text-lg font-black text-white flex items-center uppercase italic mb-6">
            <TrendingUp className="mr-3 text-indigo-500" size={20} /> Learning Focus History
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={user.focusHistory} margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '24px', padding: '20px' }} />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={5} dot={{ r: 6, fill: '#6366f1' }} activeDot={{ r: 10 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Inventory Gallery */}
        <div className="bg-slate-900/30 border border-slate-800/40 p-8 rounded-[2rem] backdrop-blur-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-white flex items-center uppercase italic">
              <Package className="mr-3 text-yellow-500" size={20} /> Equipment & Badges
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.inventory.length} ITEMS</span>
          </div>
          <div className="grid grid-cols-5 gap-6">
            {user.inventory.map(item => (
              <div key={item.id} className="relative group">
                <div className={`w-full aspect-square rounded-[1.5rem] border-2 flex items-center justify-center transition-all cursor-help ${item.rarity === 'Legendary' ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'bg-slate-950 border-slate-800 hover:border-indigo-500'}`}>
                  <Zap size={24} className={item.rarity === 'Legendary' ? 'text-yellow-400' : 'text-indigo-400'} />
                </div>
                <div className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-64 p-6 bg-slate-900 border border-slate-800 rounded-[2rem] text-xs shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                  <p className="font-black uppercase tracking-widest mb-2 text-white">{item.name}</p>
                  <p className="text-slate-400 leading-relaxed mb-4">{item.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                    <span className="text-indigo-400 font-black tracking-widest uppercase">{item.rarity}</span>
                    {item.statBoost && <span className="text-green-400 font-bold">+{item.statBoost.value} {item.statBoost.skill}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Mastery Chart */}
        <div className="bg-slate-900/30 border border-slate-800/40 p-8 rounded-[2rem] backdrop-blur-3xl">
          <h3 className="text-lg font-black text-white flex items-center uppercase italic mb-8">
            <TrendingUp className="mr-3 text-green-500" size={20} /> Course Progress
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Bar dataKey="xp" radius={[15, 15, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Milestones Gallery */}
      {user.milestones && user.milestones.length > 0 && (
        <div className="bg-slate-900/30 border border-slate-800/40 p-12 rounded-[4rem] backdrop-blur-3xl">
          <h3 className="text-3xl font-black text-white flex items-center uppercase italic mb-12">
            <Flag className="mr-4 text-purple-500" /> Career Milestones
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {user.milestones.map(mid => {
              const allMilestones: any[] = JSON.parse(localStorage.getItem('leveluped_milestones_v1') || '[]');
              const m = allMilestones.find((am: any) => am.id === mid);
              if (!m) return null;
              return (
                <div key={mid} className="bg-slate-950 border border-purple-500/30 p-8 rounded-[2rem] flex flex-col items-center text-center gap-4 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                  <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                  <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                    {m.badgeUrl === 'Trophy' ? '🏆' : m.badgeUrl === 'Medal' ? '🥇' : m.badgeUrl === 'Star' ? '⭐' : m.badgeUrl === 'Crown' ? '👑' : '💎'}
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase tracking-tighter text-lg">{m.name}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{m.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hall of Records (Achievements) */}
      <div className="bg-slate-900/30 border border-slate-800/40 p-12 rounded-[4rem] backdrop-blur-3xl">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-3xl font-black text-white flex items-center uppercase italic">
            <Award className="mr-4 text-indigo-500" /> Achievements
          </h3>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
            {user.achievements.length} / {MASTER_ACHIEVEMENTS.length} UNLOCKED
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MASTER_ACHIEVEMENTS.map(achievement => {
            const isUnlocked = user.achievements.includes(achievement.id);
            const rarityColor = achievement.rarity === 'Legendary' ? 'text-yellow-400 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
              : achievement.rarity === 'Rare' ? 'text-purple-400 border-purple-500/50'
                : 'text-indigo-400 border-indigo-500/50';

            return (
              <div
                key={achievement.id}
                className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 ${isUnlocked
                  ? `bg-slate-900/80 ${rarityColor} scale-100 opacity-100`
                  : 'bg-slate-950/50 border-slate-800 text-slate-600 scale-95 opacity-60 grayscale'
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 rounded-2xl ${isUnlocked ? 'bg-white/10' : 'bg-slate-900'}`}>
                    {isUnlocked ? getIcon(achievement.icon) : <Lock size={24} />}
                  </div>
                  {isUnlocked && (
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${achievement.rarity === 'Legendary' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                      : achievement.rarity === 'Rare' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                        : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                      }`}>
                      {achievement.rarity}
                    </span>
                  )}
                </div>
                <h4 className={`text-xl font-black uppercase tracking-tight mb-2 ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                  {achievement.title}
                </h4>
                <p className="text-sm font-medium opacity-80 leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) => (
  <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-3xl shadow-lg transition-all hover:scale-[1.02] group">
    <div className={`flex items-center space-x-3 ${color} mb-3`}>
      <div className="p-2 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">{label}</span>
    </div>
    <p className="text-4xl font-black text-white tracking-tight leading-none">{value}</p>
  </div>
);
