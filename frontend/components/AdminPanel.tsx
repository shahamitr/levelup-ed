
import React, { useState, useEffect } from 'react';
import { Milestone, WorldId, World } from '../types';
import { WORLDS } from '../constants';
import { Save, Plus, Trash2, ShieldCheck, Award, Users, BookOpen, Map, Settings, CheckCircle, XCircle, AlertCircle, Edit2, Loader, RefreshCw } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { aiService } from '../services/api';

interface AdminPanelProps {
  onExit: () => void;
  milestones: Milestone[];
  onSaveMilestone: (m: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
}

type AdminTab = 'milestones' | 'users' | 'courses' | 'paths' | 'system';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  createdAt: string;
  status: 'Active' | 'Inactive';
}

interface CourseFormData {
  name: string;
  description: string;
  totalLevels: number;
  bossName: string;
  primaryColor: string;
}

const MOCK_USERS: AdminUser[] = [
  { id: '1', username: 'Admin', email: 'admin@leveluped.com', role: 'ADMIN', level: 25, xp: 25000, createdAt: '2024-01-01', status: 'Active' },
  { id: '2', username: 'John Doe', email: 'john@example.com', role: 'STUDENT', level: 12, xp: 12000, createdAt: '2024-06-15', status: 'Active' },
  { id: '3', username: 'Jane Smith', email: 'jane@test.com', role: 'STUDENT', level: 8, xp: 8000, createdAt: '2024-09-20', status: 'Inactive' },
  { id: '4', username: 'Mike Johnson', email: 'mike@test.com', role: 'STUDENT', level: 15, xp: 15000, createdAt: '2024-03-10', status: 'Active' },
  { id: '5', username: 'Sarah Wilson', email: 'sarah@test.com', role: 'STUDENT', level: 5, xp: 5200, createdAt: '2024-11-01', status: 'Active' },
  { id: '6', username: 'Alex Chen', email: 'alex@test.com', role: 'STUDENT', level: 20, xp: 20500, createdAt: '2024-02-28', status: 'Active' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExit, milestones, onSaveMilestone, onDeleteMilestone }) => {
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<AdminTab>('courses');
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    name: '',
    description: '',
    levelThreshold: 5,
    worldId: WorldId.WEB,
    badgeUrl: 'Trophy'
  });

  // User Management
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Course Management
  const [editingCourse, setEditingCourse] = useState<CourseFormData | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);

  // System Status
  const [geminiStatus, setGeminiStatus] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle');
  const [apiTestResult, setApiTestResult] = useState<string>('');

  const handleSave = () => {
    if (!newMilestone.name || !newMilestone.description) {
      addNotification("Please fill all fields", 'error');
      return;
    }

    const milestone: Milestone = {
      id: `ms-${Date.now()}`,
      name: newMilestone.name!,
      description: newMilestone.description!,
      levelThreshold: newMilestone.levelThreshold || 5,
      worldId: newMilestone.worldId as string,
      badgeUrl: newMilestone.badgeUrl || 'Trophy'
    };

    onSaveMilestone(milestone);
    addNotification(`MILESTONE CONFIGURED: ${milestone.name.toUpperCase()}`, 'success');
    setNewMilestone({ name: '', description: '', levelThreshold: 5, worldId: WorldId.WEB, badgeUrl: 'Trophy' });
  };

  // Fetch Users
  const fetchUsers = () => {
    setLoadingUsers(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(MOCK_USERS);
      setLoadingUsers(false);
      addNotification("User data loaded", 'success');
    }, 800);
  };

  // Test Gemini API
  const testGeminiAPI = async () => {
    setGeminiStatus('checking');
    setApiTestResult('Testing connection to Gemini AI...');

    try {
      const response = await aiService.chat(
        "Respond with exactly: 'SYSTEM OK'",
        [],
        "System health check"
      );

      if (response.data && response.data.reply) {
        setGeminiStatus('online');
        setApiTestResult(`✅ Response: "${response.data.reply.substring(0, 100)}"`);
        addNotification("Gemini API is operational!", 'success');
      } else {
        setGeminiStatus('offline');
        setApiTestResult('⚠️ Unexpected response format');
      }
    } catch (error: any) {
      setGeminiStatus('offline');
      const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Connection failed';
      setApiTestResult(`❌ ${msg}`);
      addNotification("Gemini API test failed", 'error');
    }
  };

  // Load users on tab switch
  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) fetchUsers();
  }, [activeTab]);

  // Course Form Handlers
  const openAddCourse = () => {
    setEditingCourse({ name: '', description: '', totalLevels: 5, bossName: '', primaryColor: 'text-indigo-400' });
    setEditingCourseId(null);
    setShowCourseForm(true);
  };

  const openEditCourse = (w: World) => {
    setEditingCourse({ name: w.name, description: w.description, totalLevels: w.totalLevels, bossName: w.bossName, primaryColor: w.primaryColor });
    setEditingCourseId(w.id);
    setShowCourseForm(true);
  };

  // ──────────────────────── RENDER TABS ────────────────────────

  const renderMilestonesTab = () => (
    <>
      <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <ShieldCheck className="text-green-500" /> Configure New Milestone
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500">Milestone Name</label>
            <input value={newMilestone.name} onChange={e => setNewMilestone({ ...newMilestone, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-indigo-500 outline-none" placeholder="e.g. Frontend Master" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500">Track / World</label>
            <select value={newMilestone.worldId} onChange={e => setNewMilestone({ ...newMilestone, worldId: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-indigo-500 outline-none">
              {WORLDS.map(w => (<option key={w.id} value={w.id}>{w.name}</option>))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500">Level Threshold</label>
            <input type="number" min="1" max="5" value={newMilestone.levelThreshold} onChange={e => setNewMilestone({ ...newMilestone, levelThreshold: parseInt(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500">Badge Icon</label>
            <select value={newMilestone.badgeUrl} onChange={e => setNewMilestone({ ...newMilestone, badgeUrl: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-indigo-500 outline-none">
              <option value="Trophy">🏆 Trophy</option>
              <option value="Medal">🥇 Medal</option>
              <option value="Star">⭐ Star</option>
              <option value="Crown">👑 Crown</option>
              <option value="Diamond">💎 Diamond</option>
            </select>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500">Description</label>
            <textarea value={newMilestone.description} onChange={e => setNewMilestone({ ...newMilestone, description: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-indigo-500 outline-none h-24" placeholder="Description of the achievement..." />
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button onClick={handleSave} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition-all active:scale-95">
            <Save size={18} /> Save Configuration
          </button>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><Award className="text-yellow-500" /> Active Milestones</h3>
        {milestones.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-600 uppercase font-mono text-sm">No milestones configured</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestones.map(ms => (
              <div key={ms.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center group hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-2xl">
                    {ms.badgeUrl === 'Trophy' ? '🏆' : ms.badgeUrl === 'Medal' ? '🥇' : ms.badgeUrl === 'Star' ? '⭐' : ms.badgeUrl === 'Crown' ? '👑' : '💎'}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{ms.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{ms.worldId} • Level {ms.levelThreshold}</p>
                  </div>
                </div>
                <button onClick={() => onDeleteMilestone(ms.id)} className="p-3 hover:bg-red-900/20 text-slate-600 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderUsersTab = () => (
    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-200 flex items-center gap-3"><Users className="text-indigo-400" /> User Management</h3>
        <button onClick={fetchUsers} disabled={loadingUsers} className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-2">
          {loadingUsers ? <Loader className="animate-spin" size={14} /> : <RefreshCw size={14} />} Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-white">{users.length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Total Users</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-green-400">{users.filter(u => u.status === 'Active').length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Active</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-red-400">{users.filter(u => u.status === 'Inactive').length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Inactive</p>
        </div>
      </div>

      {loadingUsers ? (
        <div className="text-center py-12"><Loader className="animate-spin mx-auto text-indigo-400 mb-4" size={48} /><p className="text-slate-400">Loading users...</p></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/80 text-slate-200 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">XP</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{u.username.charAt(0)}</div>
                      <div><p className="font-bold text-white">{u.username}</p><p className="text-xs text-slate-500">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}>{u.role}</span></td>
                  <td className="px-6 py-4 font-bold text-white">{u.level}</td>
                  <td className="px-6 py-4">{u.xp.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>{u.status}</span></td>
                  <td className="px-6 py-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4"><button className="text-indigo-400 hover:text-white flex items-center gap-1 transition-colors"><Edit2 size={14} /> Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderCoursesTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-200 flex items-center gap-3"><BookOpen className="text-indigo-400" /> Course Management</h3>
            <p className="text-xs text-slate-500 mt-1">{WORLDS.length} courses in the catalog</p>
          </div>
          <button onClick={openAddCourse} className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 flex items-center gap-2">
            <Plus size={16} /> Add Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORLDS.slice(0, 12).map(w => (
            <div key={w.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <h4 className={`font-bold ${w.primaryColor}`}>{w.name}</h4>
                <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400">{w.totalLevels} Levels</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mb-2">{w.description}</p>
              <p className="text-[10px] text-slate-600 mb-4">Boss: {w.bossName}</p>
              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditCourse(w)} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-white flex items-center gap-1 transition-colors"><Edit2 size={12} /> Edit</button>
              </div>
            </div>
          ))}
        </div>

        {WORLDS.length > 12 && (
          <p className="text-center text-slate-500 text-sm mt-6">Showing 12 of {WORLDS.length} courses</p>
        )}
      </div>

      {/* Course Form Modal */}
      {showCourseForm && editingCourse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-8" onClick={() => setShowCourseForm(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6 text-white">{editingCourseId ? 'Edit Course' : 'Add New Course'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-slate-500 block mb-2">Course Name</label>
                <input value={editingCourse.name} onChange={e => setEditingCourse({ ...editingCourse, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-indigo-500 outline-none" placeholder="e.g. Advanced React Patterns" />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-slate-500 block mb-2">Description</label>
                <textarea value={editingCourse.description} onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-indigo-500 outline-none h-20 resize-none" placeholder="Course description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-slate-500 block mb-2">Total Levels</label>
                  <input type="number" min="1" max="20" value={editingCourse.totalLevels} onChange={e => setEditingCourse({ ...editingCourse, totalLevels: parseInt(e.target.value) || 5 })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-slate-500 block mb-2">Boss Name</label>
                  <input value={editingCourse.bossName} onChange={e => setEditingCourse({ ...editingCourse, bossName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-indigo-500 outline-none" placeholder="e.g. Code Architect" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowCourseForm(false)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-colors">Cancel</button>
              <button onClick={() => { addNotification(`Course "${editingCourse.name}" saved!`, 'success'); setShowCourseForm(false); }} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center gap-2 transition-colors"><Save size={18} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPathsTab = () => (
    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md text-center">
      <Map size={48} className="mx-auto text-slate-600 mb-4" />
      <h3 className="text-2xl font-bold text-slate-400 mb-2">Custom Learning Paths</h3>
      <p className="text-slate-500 mb-8">Create tailored curriculums for enterprise clients or specific cohorts.</p>
      <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 hover:border-indigo-500/50 transition-colors cursor-pointer group">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600 transition-colors">
          <Plus className="text-slate-400 group-hover:text-white" size={32} />
        </div>
        <h4 className="text-lg font-bold text-white">Create New Path</h4>
        <p className="text-sm text-slate-500 mt-2">Combine existing modules into a linear track</p>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md">
        <h3 className="text-2xl font-bold text-slate-200 flex items-center gap-3 mb-6"><Settings className="text-purple-400" /> System Status</h3>

        {/* Gemini Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                Gemini AI Provider
                {geminiStatus === 'online' && <CheckCircle className="text-green-500" size={20} />}
                {geminiStatus === 'offline' && <XCircle className="text-red-500" size={20} />}
                {geminiStatus === 'checking' && <Loader className="animate-spin text-indigo-400" size={20} />}
              </h4>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">AI Backend Service</p>
            </div>
            <button onClick={testGeminiAPI} disabled={geminiStatus === 'checking'} className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-50 transition-colors">
              Test Connection
            </button>
          </div>
          {apiTestResult && (
            <div className={`p-4 rounded-xl font-mono text-sm whitespace-pre-wrap break-all ${geminiStatus === 'online' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
              geminiStatus === 'offline' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                'bg-slate-800 text-slate-400'
              }`}>{apiTestResult}</div>
          )}
        </div>

        {/* Config */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Configuration</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Backend API</span><span className="font-mono text-indigo-400">{import.meta.env.VITE_API_URL || 'Not configured'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Model</span><span className="font-mono text-purple-400">gemini-pro</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Total Courses</span><span className="font-mono text-white">{WORLDS.length}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Environment</span><span className="font-mono text-green-400">Development</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  // ──────────────────────── MAIN LAYOUT ────────────────────────

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'courses', label: 'Courses', icon: <BookOpen size={16} /> },
    { key: 'users', label: 'Users', icon: <Users size={16} /> },
    { key: 'milestones', label: 'Milestones', icon: <Award size={16} /> },
    { key: 'paths', label: 'Learning Paths', icon: <Map size={16} /> },
    { key: 'system', label: 'System', icon: <Settings size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white p-8 overflow-y-auto pointer-events-auto">
      <div className="max-w-6xl mx-auto space-y-8 pt-20">

        {/* Header */}
        <div className="flex justify-between items-center pb-8 border-b border-slate-800">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase text-slate-200">System Admin</h2>
            <p className="text-indigo-400 font-mono text-xs tracking-widest uppercase mt-2">Configuration & Governance</p>
          </div>
          <button onClick={onExit} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-xs uppercase tracking-widest transition-colors">Exit Console</button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-slate-800 pb-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-t-xl font-bold uppercase tracking-widest text-xs transition-colors whitespace-nowrap ${activeTab === tab.key ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {activeTab === 'milestones' && renderMilestonesTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'courses' && renderCoursesTab()}
          {activeTab === 'paths' && renderPathsTab()}
          {activeTab === 'system' && renderSystemTab()}
        </div>

      </div>
    </div>
  );
};
