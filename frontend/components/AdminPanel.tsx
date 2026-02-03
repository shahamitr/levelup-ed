
import React, { useState } from 'react';
import { Milestone, WorldId } from '../types';
import { WORLDS } from '../constants';
import { Save, Plus, Trash2, ShieldCheck, Award } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

interface AdminPanelProps {
  onExit: () => void;
  milestones: Milestone[];
  onSaveMilestone: (m: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExit, milestones, onSaveMilestone, onDeleteMilestone }) => {
  const { addNotification } = useNotification();
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    name: '',
    description: '',
    levelThreshold: 5,
    worldId: WorldId.WEB,
    badgeUrl: 'Trophy'
  });

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

    // Reset form
    setNewMilestone({
      name: '',
      description: '',
      levelThreshold: 5,
      worldId: WorldId.WEB,
      badgeUrl: 'Trophy'
    });
  };

  return (
    <div className="h-full bg-slate-950 text-white p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center pb-8 border-b border-slate-800">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase text-slate-200">System Admin</h2>
            <p className="text-indigo-400 font-mono text-xs tracking-widest uppercase mt-2">Configuration & Governance</p>
          </div>
          <button onClick={onExit} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-xs uppercase tracking-widest transition-colors">
            Exit Console
          </button>
        </div>

        {/* Configuration Form */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <ShieldCheck className="text-green-500" />
            Configure New Milestone
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500">Milestone Name</label>
              <input
                value={newMilestone.name}
                onChange={e => setNewMilestone({ ...newMilestone, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-indigo-500 outline-none"
                placeholder="e.g. Frontend Master"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500">Track / World</label>
              <select
                value={newMilestone.worldId}
                onChange={e => setNewMilestone({ ...newMilestone, worldId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-indigo-500 outline-none"
              >
                {WORLDS.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500">Level Threshold</label>
              <input
                type="number"
                min="1"
                max="5"
                value={newMilestone.levelThreshold}
                onChange={e => setNewMilestone({ ...newMilestone, levelThreshold: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500">Badge Icon</label>
              <select
                value={newMilestone.badgeUrl}
                onChange={e => setNewMilestone({ ...newMilestone, badgeUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-indigo-500 outline-none"
              >
                <option value="Trophy">🏆 Trophy</option>
                <option value="Medal">🥇 Medal</option>
                <option value="Star">⭐ Star</option>
                <option value="Crown">👑 Crown</option>
                <option value="Diamond">💎 Diamond</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500">Description</label>
              <textarea
                value={newMilestone.description}
                onChange={e => setNewMilestone({ ...newMilestone, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-indigo-500 outline-none h-24"
                placeholder="Description of the achievement..."
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button onClick={handleSave} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition-all active:scale-95">
              <Save size={18} />
              Save Configuration
            </button>
          </div>
        </div>

        {/* List of Milestones */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Award className="text-yellow-500" />
            Active Milestones
          </h3>

          {milestones.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-600 uppercase font-mono text-sm">
              No milestones configured
            </div>
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
                  <button onClick={() => onDeleteMilestone(ms.id)} className="p-3 hover:bg-red-900/20 text-slate-600 hover:text-red-500 rounded-xl transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
