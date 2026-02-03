

import React, { useState } from 'react';
import { BrainCircuit, ArrowRight, Terminal, ShieldCheck, Lock, UserPlus, LogIn } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { authService } from '../services/api';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState(''); // Username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim() || (isRegister && !name.trim())) return;

    setLoading(true);
    addNotification(isRegister ? "CREATING IDENTITY..." : "VERIFYING CREDENTIALS...", 'info');

    try {
      let response;
      if (isRegister) {
        response = await authService.register(name, email, password);
      } else {
        response = await authService.login(email, password);
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token); // Store JWT

      addNotification("ACCESS GRANTED", 'success');
      setTimeout(() => {
        onLogin(user);
      }, 500);

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "AUTHENTICATION FAILED";
      addNotification(msg.toUpperCase(), 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-0 mix-blend-overlay"></div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10 space-y-6 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="inline-flex p-8 bg-slate-900 rounded-[2.5rem] shadow-[0_0_60px_rgba(79,70,229,0.15)] border border-slate-800 ring-1 ring-inset ring-slate-800 relative group">
            <BrainCircuit size={80} className="text-indigo-500 relative z-10" />
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-[2.5rem] group-hover:bg-indigo-500/30 transition-all duration-500"></div>
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none mb-2">
              LEVEL<span className="text-indigo-500">UP</span>ED
            </h1>
            <p className="text-indigo-400 font-mono text-xs tracking-[0.4em] uppercase font-bold">Career Acceleration OS</p>
          </div>
        </div>

        {/* Auth Form */}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 rounded-[3rem] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="space-y-6">

            {/* Mode Toggle */}
            <div className="flex bg-slate-950/50 p-1 rounded-full border border-slate-800/50 relative">
              <div className={`absolute top-1 bottom-1 w-[48%] bg-indigo-600 rounded-full transition-all duration-300 ${isRegister ? 'left-[51%]' : 'left-1'}`}></div>
              <button onClick={() => setIsRegister(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest relative z-10 text-white text-center">Login</button>
              <button onClick={() => setIsRegister(true)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest relative z-10 text-white text-center">Register</button>
            </div>

            {isRegister && (
              <div className="space-y-2">
                <div className="relative group">
                  <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="USERNAME"
                    className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-[1.5rem] py-4 pl-14 pr-6 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-700 font-mono text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative group">
                <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL ACCESS"
                  className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-[1.5rem] py-4 pl-14 pr-6 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-700 font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="SECURITY KEY"
                  className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-[1.5rem] py-4 pl-14 pr-6 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-700 font-mono text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-3 shadow-xl"
            >
              {loading ? (
                <span className="animate-pulse">PROCESSING...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Initialize User' : 'Authenticate'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
