
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, World, UserState, Message, WorldId, Bounty, Artifact, League, LeagueUser } from './types';
import { WORLDS, INITIAL_USER_STATE, MASTER_ACHIEVEMENTS } from './constants';
import { WorldCard } from './components/WorldCard';
import { WorldPath } from './components/WorldPath';
import { BossArena } from './components/BossArena';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { Loader } from './components/Loader';
import { Hologram } from './components/Hologram';
import { StreakFlame } from './components/StreakFlame';
import { ShopModal } from './components/ShopModal';
import { LeagueLeaderboard } from './components/LeagueLeaderboard';
import { ResumeView } from './components/ResumeView';
import { CertificateView } from './components/CertificateView';
import { DailyGoal } from './components/DailyGoal';
import { playSound, decode, decodeAudioData } from './services/audioService';
import { generateLessonContent, chatWithCoach, generateCoachSpeech, generateWorldFromTopic } from './services/geminiService';
import { useNotification } from './contexts/NotificationContext';
import { THEMES } from './constants/themes';
import { LayoutDashboard, Map, Sword, Send, BrainCircuit, Menu, X, Volume2, ShieldCheck, Settings, Bell, Zap, Trophy, Activity, Sparkles, ArrowRight, AlertTriangle, RefreshCcw, Clock, RotateCcw, Power, Plus, Gem, FileText, Award, Linkedin } from 'lucide-react';

const App = () => {
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('leveluped_state_v1');
    const parsed = saved ? JSON.parse(saved) : INITIAL_USER_STATE;
    // Ensure new gamification fields exist
    return { ...INITIAL_USER_STATE, ...parsed };
  });

  const [view, setView] = useState<ViewState>(() => {
    // Always start at landing unless deeply authenticated/session restored,
    // but for demo purposes, Landing is the best entry point.
    const saved = localStorage.getItem('leveluped_state_v1');
    return saved ? ViewState.HOME : ViewState.LANDING;
  });

  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [courses, setCourses] = useState<World[]>(WORLDS); // State for Dynamic Course Creation

  // New state to hold data for the celebration modal
  const [lastVictoryStats, setLastVictoryStats] = useState<{
    xpGained: number,
    masteryBonus: boolean,
    levelUp: boolean,
    skills: { name: string, value: number }[]
  } | null>(null);

  // State for Milestone Configuration
  const [milestones, setMilestones] = useState<any[]>(() => {
    const saved = localStorage.getItem('leveluped_milestones_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('leveluped_milestones_v1', JSON.stringify(milestones));
  }, [milestones]);

  // New Gamification State
  const [showShop, setShowShop] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<any>(null);

  // Sync Gems and FreezeCount updates
  const handleBuyFreeze = () => {
    if (user.gems >= 50 && user.freezeCount < 2) {
      setUser(prev => ({
        ...prev,
        gems: prev.gems - 50,
        freezeCount: prev.freezeCount + 1
      }));
      addNotification("STREAK FREEZE ACQUIRED! ❄️", 'success');
      playSound('xp'); // Reuse sound
    } else {
      addNotification("Purchase Failed: Not enough gems or max capacity.", 'error');
    }
  };

  const { addNotification } = useNotification();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [showDriftAlert, setShowDriftAlert] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showTimeUpOverlay, setShowTimeUpOverlay] = useState(false);
  const [isResyncing, setIsResyncing] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const lastInterventionRef = useRef<number>(0);

  useEffect(() => {
    localStorage.setItem('leveluped_state_v1', JSON.stringify(user));
  }, [user]);

  // --- Behavioral Engagement / Idle Monitor ---
  useEffect(() => {
    let idleTimer: any;
    const IDLE_THRESHOLD = 120000; // 2 minutes (for demo purposes)

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(triggerBehavioralNudge, IDLE_THRESHOLD);
    };

    const triggerBehavioralNudge = () => {
      if (view === ViewState.LANDING || view === ViewState.LOGIN) return;

      const techniques = [
        { name: "Pomodoro 🍅", desc: "Let's start a 25m sprint." },
        { name: "Ikigai 🌸", desc: "Remember your purpose." },
        { name: "Kaizen 📉", desc: "One small step." },
        { name: "Eat The Frog 🐸", desc: "Tackle the hard part now." }
      ];
      const technique = techniques[Math.floor(Math.random() * techniques.length)];

      playSound('xp'); // Gentle chime
      addNotification(`FOCUS TIP: ${technique.name}`, 'info');

      // Push to chat
      setChatHistory(prev => [...prev, {
        id: 'nudge-' + Date.now(),
        role: 'model',
        text: `**${technique.name}**: ${technique.desc}`,
        timestamp: Date.now(),
        type: 'intervention'
      }]);
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    resetIdleTimer(); // Init

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      clearTimeout(idleTimer);
    };
  }, [view]);

  // --- Chameleon Theme Engine ---
  useEffect(() => {
    const theme = selectedWorld ? THEMES[selectedWorld.id] : THEMES[WorldId.AI];
    const root = document.documentElement;
    // We Map our distinct Theme colors to generic CSS variables
    // Note: Tailwind arbitrary values will read these.
    // Ideally we'd configure tailwind, but for "Vibe Coding" dynamic runtime injection is cooler.

    // Convert Tailwind-ish colors to actual hex/rgb if needed, but for now let's assume we replace specific classes.
    // ACTUAL STRATEGY: We will add a 'data-theme' attribute and use CSS variables for main colors.
    // But since I can't easily change all 700 lines of Tailwind classes to vars right now...
    // I will use a simpler approach: Apply the `vibe` as a class? No.

    // Let's go with the CSS Variable injection for KEY elements (Backgrounds, Accents).
    // I will update the "Lesson" and "Boss" containers to use these variables.

    // For this specific iteration, let's just log the vibe shift.
    console.log(`%c VIBE SHIFT > ${theme.name}`, `background: ${theme.colors.primary}; color: white; padding: 4px;`);

  }, [selectedWorld]);


  const handleLogin = (signedInUser: any) => {
    setUser(prev => ({
      ...prev,
      name: signedInUser.username,
      xp: signedInUser.xp || 0,
      level: signedInUser.level || 1,
      // If backend has focusScore, use it
      focusScore: signedInUser.focusScore || 100
    }));
    setView(ViewState.HOME);
    addNotification(`IDENTITY VERIFIED: ${signedInUser.username.toUpperCase()}`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('leveluped_state_v1');
    setUser(INITIAL_USER_STATE);
    setView(ViewState.LOGIN);
    addNotification("SESSION TERMINATED", 'info');
  };

  // Check achievements whenever user state changes significantly
  useEffect(() => {
    const checkAchievements = () => {
      let newUnlocks: string[] = [];
      MASTER_ACHIEVEMENTS.forEach(ach => {
        if (!user.achievements.includes(ach.id)) {
          if (ach.condition(user)) {
            newUnlocks.push(ach.id);
          }
        }
      });

      if (newUnlocks.length > 0) {
        setUser(prev => ({
          ...prev,
          achievements: [...prev.achievements, ...newUnlocks]
        }));
        newUnlocks.forEach(id => {
          const ach = MASTER_ACHIEVEMENTS.find(a => a.id === id);
          if (ach) addNotification(`ACHIEVEMENT UNLOCKED: ${ach.title.toUpperCase()}`, 'success');
        });
      }
    };

    checkAchievements();
  }, [user.xp, user.focusScore, user.completedWorlds, user.level, user.streak, addNotification]);

  const playAudio = async (base64Data: string) => {
    if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    const ctx = audioContextRef.current;
    try {
      const bytes = decode(base64Data);
      const audioBuffer = await decodeAudioData(bytes, ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    } catch (e) { console.error(e); }
  };

  const startLesson = async (world: World) => {
    setSelectedWorld(world);
    const completed = user.completedWorlds[world.id] || [];
    const nextLevel = Math.min(world.totalLevels, completed.length + 1);
    setCurrentLevel(nextLevel);

    setTimeLeft(600);
    setShowTimeUpOverlay(false);
    setView(ViewState.LESSON);
    setLessonContent(`## Loading Course Module...\nFetching curriculum for ${world.name} - Module ${nextLevel}...`);

    const content = await generateLessonContent(world.name, nextLevel);
    setLessonContent(content);

    // Pick a random strategy for this session
    const strategies = [
      { name: "Pomodoro 🍅", desc: "Let's start a 25m sprint." },
      { name: "Ikigai 🌸", desc: "Remember your purpose." },
      { name: "Kaizen 📉", desc: "One small step." },
      { name: "Eat The Frog 🐸", desc: "Tackle the hard part now." }
    ];
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];

    const introText = `Welcome, Student ${user.name}. Module ${nextLevel} of ${world.name} is ready. Your AI Mentor is standing by.\n\n**Session Strategy: ${strategy.name}**\n"${strategy.desc}"`;

    setChatHistory([{ id: 'init', role: 'model', text: introText, timestamp: Date.now(), type: 'normal' }]);
    if (ttsEnabled) {
      const audio = await generateCoachSpeech(introText);
      if (audio) playAudio(audio);
    }
  };

  const handleSendMessage = async (customMsg?: string, isInternal: boolean = false) => {
    const msg = customMsg || chatInput;
    if (!msg.trim() || chatLoading) return;
    if (!customMsg) setChatInput('');
    setChatLoading(true);

    if (!isInternal) {
      const newHistory: Message[] = [...chatHistory, { id: Date.now().toString(), role: 'user', text: msg, timestamp: Date.now(), type: 'normal' }];
      setChatHistory(newHistory);
    }

    const response = await chatWithCoach(chatHistory, msg, `Course: ${selectedWorld?.name} Module: ${currentLevel}. Focus: ${user.focusScore}%. Status: ${isInternal ? 'DISTRACTION_DETECTED' : 'FOCUSED'}`);

    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      text: response,
      timestamp: Date.now(),
      type: isInternal ? 'intervention' : 'normal'
    }]);
    setChatLoading(false);
    if (ttsEnabled) {
      const audio = await generateCoachSpeech(response);
      if (audio) playAudio(audio);
    }
  };

  const triggerFocusCoaching = async () => {
    setShowDriftAlert(true);
    setTimeout(() => setShowDriftAlert(false), 3000);
    addNotification("FOCUS LOSS: AI MENTOR ACTIVATED", 'warning');

    // Specific, actionable techniques
    const techniques = [
      "The 'Box Breathing' Method (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s)",
      "The '5-4-3-2-1' Sensory Grounding Technique",
      "A 20-second 'Vision Reset' (Look at a distant object)",
      "A 'Neural Reset' (Stand up and stretch for 15 seconds)",
      "A 'Cognitive Reframing' (Summarize the last sentence learned out loud)"
    ];

    const selectedTechnique = techniques[Math.floor(Math.random() * techniques.length)];

    const prompt = `System Alert: The Student's focus has dropped critically below 70%.
    Immediate Intervention Required:
    1. Acknowledge the distraction warmly but authoritatively.
    2. Instruct the student to perform the following technique immediately: "${selectedTechnique}".
    3. Explain briefly why this helps reset neuro-plasticity.`;

    await handleSendMessage(prompt, true);
  };

  const handleContinueSync = () => {
    setIsResyncing(true);
    setTimeout(() => {
      setTimeLeft(600);
      setShowTimeUpOverlay(false);
      setIsResyncing(false);
      addNotification("SESSION EXTENDED", 'success');
    }, 1500);
  };

  // Lesson Timer Effect
  useEffect(() => {
    if (view === ViewState.LESSON && timeLeft > 0 && !showTimeUpOverlay) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 61) addNotification("SESSION TIME: 60 SECONDS REMAINING", 'warning');
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && view === ViewState.LESSON && !showTimeUpOverlay) {
      setShowTimeUpOverlay(true);
      addNotification("SESSION EXPIRED: TAKE A BREAK", 'warning');

      // Automatic KORE interruption message
      setChatHistory(prev => [...prev, {
        id: 'timeout-' + Date.now(),
        role: 'model',
        text: "Student, you've been working hard. The session time limit has been reached. Please take a short break or restart the session to maintain peak learning efficiency.",
        timestamp: Date.now(),
        type: 'intervention'
      }]);
    }
  }, [view, timeLeft, showTimeUpOverlay, addNotification]);

  useEffect(() => {
    if (view === ViewState.LESSON) {
      const interval = setInterval(() => {
        setIsWatching(prev => !prev);
        const scoreDelta = (Math.random() > 0.65 ? 4 : -4);
        const newScore = Math.min(100, Math.max(30, user.focusScore + scoreDelta));
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        if (newScore < 70 && Date.now() - lastInterventionRef.current > 45000) {
          lastInterventionRef.current = Date.now();
          triggerFocusCoaching();
        }

        setUser(u => ({
          ...u,
          xp: u.xp + 2,
          focusScore: newScore,
          focusHistory: [...u.focusHistory.slice(-19), { time: timeStr, score: newScore }]
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [view, user.focusScore, selectedWorld, chatHistory, chatLoading, ttsEnabled, currentLevel]);

  const handleBossVictory = () => {
    if (!selectedWorld) return;

    // Calculate stats based on current user state
    const worldHistory = user.completedWorlds[selectedWorld.id] || [];
    const isNewCompletion = !worldHistory.includes(currentLevel);

    // Calculate Rewards
    const levelXp = isNewCompletion ? (500 + (currentLevel * 250)) : 100;
    const updatedWorldProgress = isNewCompletion
      ? [...worldHistory, currentLevel].sort((a, b) => a - b)
      : worldHistory;

    const masteryAwarded = (isNewCompletion && updatedWorldProgress.length === selectedWorld.totalLevels);
    const masteryBonus = masteryAwarded ? 2500 : 0;
    const xpGained = levelXp + masteryBonus;

    const finalXp = user.xp + xpGained;
    const newLevel = Math.floor(finalXp / 1000) + 1;
    const rankUp = newLevel > user.level;

    const logicBoost = isNewCompletion ? 15 : 2;
    const archBoost = isNewCompletion ? 10 : 2;

    // Set Victory Stats for Celebration Modal
    setLastVictoryStats({
      xpGained,
      masteryBonus: masteryAwarded,
      levelUp: rankUp,
      skills: [
        { name: 'Logic', value: logicBoost },
        { name: 'Architecture', value: archBoost }
      ]
    });

    // Update User State
    setUser(prev => ({
      ...prev,
      xp: finalXp,
      level: newLevel,
      lastActive: Date.now(),
      completedWorlds: {
        ...prev.completedWorlds,
        [selectedWorld.id]: updatedWorldProgress
      },
      skillProfile: {
        ...prev.skillProfile,
        logic: prev.skillProfile.logic + logicBoost,
        architecture: prev.skillProfile.architecture + archBoost
      }
    }));

    addNotification(`MODULE ${currentLevel} COMPLETED`, 'success');
    setView(ViewState.CELEBRATION);
  };

  const isWorldLocked = (worldId: WorldId) => {
    const checkCompletion = (id: WorldId) => (user.completedWorlds[id] || []).includes(1);
    switch (worldId) {
      case WorldId.WEB: return false;
      case WorldId.DATA: return !checkCompletion(WorldId.WEB);
      case WorldId.CYBER: return !checkCompletion(WorldId.DATA);
      case WorldId.AI: return !checkCompletion(WorldId.CYBER);
      default: return false;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.LANDING:
        return <LandingPage onStart={() => setView(ViewState.LOGIN)} />;

      case ViewState.LOGIN:
        return <LoginPage onLogin={handleLogin} />;

      case ViewState.HOME:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-12 p-10 bg-slate-950">
            <div className="relative group">
              <div className="bg-indigo-600/10 p-20 rounded-full ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/60 transition-all duration-1000 animate-pulse">
                <BrainCircuit size={160} className="text-indigo-500" />
              </div>
              <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full opacity-30"></div>
            </div>
            <div className="space-y-4">
              <h1 className="text-9xl font-black tracking-tighter text-white uppercase italic drop-shadow-2xl">
                LEVEL<span className="text-indigo-500">UP</span>ED
              </h1>
              <p className="text-indigo-400 font-mono text-sm tracking-[0.6em] uppercase font-bold">Career Acceleration Platform v5.0</p>
              <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">Welcome back, {user.name}</p>
            </div>
            <button
              onClick={() => setView(ViewState.WORLD_MAP)}
              className="px-20 py-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[3rem] font-black text-4xl shadow-[0_0_100px_rgba(79,70,229,0.3)] transition-all transform hover:-translate-y-2 active:scale-95 group relative overflow-hidden"
            >
              <span className="relative z-10">RESUME TRAINING</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        );


      case ViewState.WORLD_MAP:
        return (
          <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in">
            <div className="flex justify-between items-end pb-8 border-b border-slate-800">
              <div>
                <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none italic">Adventure Map</h2>
                <p className="text-slate-500 font-mono text-xs tracking-widest uppercase mt-4">Journey through the Codeverse</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-[2.5rem] border border-slate-800 flex items-center space-x-6 backdrop-blur-xl">
                <Activity size={24} className="text-green-500 animate-pulse" />
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Rank</p>
                  <p className="text-xl font-bold text-white tracking-tighter">TOP 5%</p>
                </div>
              </div>
            </div>

            {/* Horizontal Scroll for World Paths */}
            <div className="flex space-x-12 overflow-x-auto pb-12 snap-x scrollbar-hide">
              {courses.map(world => (
                <div key={world.id} className="snap-center shrink-0">
                  <WorldPath
                    world={world}
                    completedLevels={user.completedWorlds[world.id] || []}
                    onStartLevel={(level) => {
                      if (isWorldLocked(world.id)) {
                        addNotification("LOCKED: COMPLETE PREVIOUS WORLD FIRST", 'error');
                      } else {
                        startLesson({ ...world, currentLevel: level } as any); // Hack to pass level
                      }
                    }}
                    onBossFight={() => {
                      setSelectedWorld(world);
                      setView(ViewState.BOSS_FIGHT);
                    }}
                  />
                </div>
              ))}

              {/* Instant World Generator Card */}
              <div className="snap-center shrink-0 flex items-center justify-center p-8">
                <button
                  onClick={async () => {
                    const topic = prompt("What do you want to learn? (e.g. Rust, Astrophysics, GenAI)");
                    if (topic) {
                      addNotification("GENERATING WORLD... STAND BY", 'info');
                      const newWorld = await generateWorldFromTopic(topic);
                      if (newWorld) {
                        setCourses(prev => [...prev, newWorld]);
                        addNotification(`WORLD GENERATED: ${newWorld.name.toUpperCase()}`, 'success');
                      } else {
                        addNotification("GENERATION FAILED", 'error');
                      }
                    }
                  }}
                  className="w-64 h-96 border-2 border-dashed border-slate-700 rounded-[3rem] flex flex-col items-center justify-center space-y-4 hover:border-indigo-500 hover:bg-slate-900/50 transition-all group cursor-pointer"
                >
                  <div className="p-6 bg-slate-800 rounded-full group-hover:bg-indigo-600 transition-colors">
                    <Plus size={32} className="text-slate-400 group-hover:text-white" />
                  </div>
                  <span className="font-black text-slate-500 uppercase tracking-widest text-xs group-hover:text-indigo-400">GENERATE WORLD</span>
                </button>
              </div>

            </div>
          </div>
        );

      case ViewState.LESSON:
        const currentTheme = selectedWorld ? THEMES[selectedWorld.id] : THEMES[WorldId.AI];

        return (
          <div className={`flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden relative transition-colors duration-700 ${currentTheme.colors.background} ${currentTheme.colors.text}`}>
            {/* Ambient Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: currentTheme.backgroundPattern }}></div>

            {/* Focus Alert Overlay */}
            {showDriftAlert && (
              <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none animate-in fade-in zoom-in duration-300">
                <div className="bg-red-600/90 text-white px-12 py-8 rounded-[3rem] shadow-[0_0_80px_rgba(220,38,38,0.5)] border-2 border-red-400 flex flex-col items-center space-y-4">
                  <AlertTriangle size={64} className="animate-bounce" />
                  <div className="text-center">
                    <p className="font-black text-3xl uppercase tracking-tighter italic">Focus Loss Detected</p>
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-80">Reconnecting with AI Mentor...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Time Up Overlay */}
            {showTimeUpOverlay && (
              <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-2xl animate-in fade-in duration-700">
                <div className={`bg-slate-900 border-2 ${currentTheme.colors.accent} p-16 rounded-[4rem] max-w-2xl w-full text-center space-y-12 shadow-2xl relative overflow-hidden`}>
                  <div className="space-y-6">
                    <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Time's Up</h2>
                    <p className="text-slate-400 text-2xl font-medium tracking-tight px-6 leading-relaxed">Great effort! Take a break.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                      onClick={handleContinueSync}
                      disabled={isResyncing}
                      className={`flex-1 px-10 py-8 ${currentTheme.colors.primary} text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center space-x-4`}
                    >
                      <RefreshCcw size={28} className={isResyncing ? 'animate-spin' : ''} />
                      <span className="text-xl">Resume</span>
                    </button>
                    <button
                      onClick={() => setView(ViewState.WORLD_MAP)}
                      className="flex-1 px-10 py-8 bg-slate-800 text-slate-300 rounded-[2.5rem] font-black uppercase tracking-widest border border-slate-700 shadow-xl transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center space-x-4"
                    >
                      <Map size={28} />
                      <span className="text-xl">Exit</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className={`w-full md:w-2/3 p-16 overflow-y-auto relative scrollbar-hide border-r ${currentTheme.colors.accent} border-opacity-20`}>
              <div className="absolute top-16 right-16 flex items-center space-x-6">
                {/* Timer UI */}
                <div className={`flex items-center space-x-4 px-6 py-3 rounded-full border transition-all duration-500 ${timeLeft < 60 ? 'bg-red-500/20 border-red-500/50 text-red-400' : `${currentTheme.colors.primary} bg-opacity-10 ${currentTheme.colors.accent}`}`}>
                  <Clock size={16} className={timeLeft < 60 ? 'animate-pulse' : ''} />
                  <span className={`font-mono text-[10px] tracking-widest font-black uppercase ${currentTheme.colors.text}`}>TIME: {formatTime(timeLeft)}</span>
                </div>

                {/* Focus UI */}
                <div className={`flex items-center space-x-4 px-6 py-3 rounded-full border ${currentTheme.colors.accent} bg-opacity-10`}>
                  <div className={`w-3 h-3 rounded-full ${user.focusScore > 80 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-mono text-[10px] tracking-widest font-bold ${currentTheme.colors.text}`}>FOCUS: {user.focusScore}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-20">
                <div className="space-y-4">
                  <p className={`${currentTheme.colors.text} font-mono text-sm font-bold tracking-[0.5em] uppercase opacity-50`}>TRACK: {selectedWorld?.name} // MODULE: {currentLevel}</p>
                  <h2 className={`text-7xl font-black tracking-tighter leading-none ${currentTheme.colors.text}`}>{selectedWorld?.name}</h2>
                </div>
                <button
                  onClick={() => setView(ViewState.BOSS_FIGHT)}
                  className={`px-14 py-8 ${currentTheme.colors.primary} text-white rounded-[3rem] font-black shadow-2xl transition-all hover:scale-105`}
                >
                  <Sword size={32} className="inline mr-3" />
                  <span className="text-2xl uppercase">INTERVIEW</span>
                </button>
              </div>

              {/* Content Container with Vibe-Specific Styling */}
              <div className={`prose max-w-none p-20 rounded-[5rem] border backdrop-blur-3xl transition-all duration-700
                  ${currentTheme.id === 'cyber-matrix' ? 'prose-invert font-mono border-green-500/30 bg-black/80 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : ''}
                  ${currentTheme.id === 'data-glass' ? 'prose-invert border-cyan-500/20 bg-slate-900/60 shadow-[0_0_50px_rgba(6,182,212,0.1)]' : ''}
                  ${currentTheme.id === 'web-brutalism' ? 'prose-zinc border-black bg-white shadow-[8px_8px_0px_#000]' : ''}
                  ${currentTheme.id === 'ai-ethereal' ? 'prose-invert prose-indigo border-indigo-500/30 bg-slate-900/40 shadow-[0_0_60px_rgba(79,70,229,0.2)]' : ''}
                `}>
                <div className="text-3xl leading-relaxed space-y-12 font-medium tracking-tight">
                  {lessonContent.includes('Loading Course Module')
                    ? <Loader type="app" text={`LOADING ${selectedWorld?.name.toUpperCase()} MODULE ${currentLevel}`} />
                    : lessonContent.split('\n').map((line, i) => <p key={i}>{line}</p>)
                  }
                </div>
              </div>
            </div>

            {/* Chat / Mentor Panel */}
            <div className={`w-full md:w-1/3 flex flex-col border-l backdrop-blur-3xl ${currentTheme.colors.secondary} ${currentTheme.colors.accent} border-opacity-30`}>
              <div className={`p-10 border-b ${currentTheme.colors.accent} border-opacity-30 flex justify-between items-center bg-opacity-90`}>
                <div className="flex items-center space-x-5">
                  <BrainCircuit size={32} className={currentTheme.id === 'web-brutalism' ? 'text-black' : 'text-green-500'} />
                  <div>
                    <span className={`font-black text-sm tracking-[0.2em] uppercase block ${currentTheme.colors.text}`}>AI MENTOR</span>
                    <span className="text-[10px] font-bold opacity-60 uppercase">VIBE: {currentTheme.name}</span>
                  </div>
                </div>
                <button onClick={() => setTtsEnabled(!ttsEnabled)} className={`p-5 rounded-[2rem] transition-all shadow-xl ${ttsEnabled ? currentTheme.colors.primary + ' text-white' : 'bg-slate-800 text-slate-500'}`}>
                  <Volume2 size={30} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
                {chatHistory.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-8 rounded-[2.5rem] text-lg max-w-[90%] shadow-xl border relative overflow-hidden transition-all duration-500 ${msg.role === 'user'
                      ? `${currentTheme.colors.primary} text-white rounded-tr-none`
                      : msg.type === 'intervention'
                        ? 'bg-red-900/20 text-red-500 border-red-500/50 rounded-tl-none'
                        : `${currentTheme.id === 'web-brutalism' ? 'bg-gray-100 text-black border-black' : 'bg-slate-800 text-slate-200 border-slate-700'} rounded-tl-none`
                      }`}>

                      {msg.text.includes('<holodeck') ? (
                        <div className="space-y-6">
                          {msg.text.split(/<holodeck type="mermaid">([\s\S]*?)<\/holodeck>/).map((part, i) =>
                            i % 2 === 1
                              ? <Hologram key={i} content={part.trim()} caption="GENERATED SCHEMATIC" />
                              : <div key={i} className="whitespace-pre-wrap">{part}</div>
                          )}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && <Loader type="ai" text="Mentor is thinking..." className="ml-4" />}
              </div>
              <div className="p-10 bg-opacity-50">
                <div className="relative">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask your mentor..."
                    className={`w-full bg-transparent border-2 rounded-[2.5rem] pl-10 pr-24 py-8 text-xl outline-none transition-all ${currentTheme.colors.text} ${currentTheme.colors.accent} focus:ring-4 focus:ring-opacity-20`}
                  />
                  <button onClick={() => handleSendMessage()} className={`absolute right-6 top-6 bottom-6 px-8 ${currentTheme.colors.primary} text-white rounded-2xl transition-all shadow-xl`}>
                    <Send size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case ViewState.BOSS_FIGHT:
        return selectedWorld ? (
          <div className="h-full p-12 bg-slate-950 flex items-center justify-center">
            <BossArena world={selectedWorld} onVictory={handleBossVictory} onDefeat={() => { addNotification("INTERVIEW FAILED: TRY AGAIN", 'error'); setView(ViewState.WORLD_MAP); }} onExit={() => setView(ViewState.LESSON)} />
          </div>
        ) : null;

      case ViewState.CELEBRATION:
        if (!lastVictoryStats || !selectedWorld) return null;
        return (
          <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="max-w-3xl w-full bg-slate-900 border-2 border-indigo-500/30 rounded-[4rem] p-16 relative overflow-hidden shadow-[0_0_120px_rgba(79,70,229,0.3)] animate-in zoom-in duration-700">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse"></div>
              <div className="flex flex-col items-center text-center space-y-10">
                <div className="p-10 bg-indigo-600/20 rounded-full border border-indigo-500/40 animate-bounce">
                  <Sparkles size={80} className="text-indigo-400" />
                </div>

                <div className="space-y-4">
                  <p className="text-indigo-400 font-mono text-sm font-black tracking-[0.5em] uppercase">MODULE COMPLETE</p>
                  <h2 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-tight">CERTIFIED!</h2>
                  <p className="text-slate-400 text-2xl font-medium tracking-tight">You have mastered {selectedWorld.name} Module {currentLevel}.</p>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full">
                  <div className="bg-slate-950 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center space-y-2 group hover:border-indigo-500/50 transition-all">
                    <Zap size={32} fill="currentColor" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">XP EARNED</span>
                    <span className="text-5xl font-black text-white tabular-nums tracking-tighter">+{lastVictoryStats.xpGained}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center space-y-2 group hover:border-indigo-500/50 transition-all">
                    <ShieldCheck size={32} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PROFICIENCY</span>
                    <span className="text-5xl font-black text-white tabular-nums tracking-tighter">LVL {user.level}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-950/50 border border-slate-800/50 p-8 rounded-[3rem] space-y-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Skills Improved</p>
                  <div className="flex justify-around items-center">
                    {lastVictoryStats.skills.map(skill => (
                      <div key={skill.name} className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-black text-white uppercase tracking-tighter">{skill.name}</span>
                          <span className="text-green-400 font-black text-xl">+{skill.value}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 animate-in slide-in-from-left duration-1000" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setView(ViewState.WORLD_MAP); setLastVictoryStats(null); }}
                  className="w-full py-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[3rem] font-black text-3xl uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-6"
                >
                  <span>BACK TO COURSES</span>
                  <ArrowRight size={32} />
                </button>

                {/* Certificate Button */}
                <button
                  onClick={() => {
                    // Generate mock certificate data for demo
                    const certData = {
                      id: `cert-${Date.now()}`,
                      certificateNumber: `LUE-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                      recipientName: user.name,
                      courseName: selectedWorld.name,
                      issueDate: new Date().toISOString(),
                      skills: lastVictoryStats.skills.map(s => s.name),
                      verificationUrl: `${window.location.origin}/verify/demo`,
                      partner: null
                    };
                    setCurrentCertificate(certData);
                    setShowCertificate(true);
                  }}
                  className="w-full py-8 bg-slate-800 hover:bg-slate-700 text-white rounded-[2.5rem] font-bold text-xl uppercase tracking-widest border border-slate-700 transition-all hover:border-indigo-500/50 flex items-center justify-center space-x-4"
                >
                  <Award size={24} />
                  <span>VIEW CERTIFICATE</span>
                </button>
              </div>
            </div>
          </div>
        );

      case ViewState.DASHBOARD:
        return <Dashboard user={user} courses={courses} />;

      case ViewState.ADMIN:
        return <AdminPanel user={user} setUser={setUser} courses={courses} setCourses={setCourses} chatHistory={chatHistory} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {view !== ViewState.LOGIN && (
        <header className="h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-3xl sticky top-0 z-50 flex items-center justify-between px-16">
          <div className="flex items-center space-x-6 cursor-pointer group" onClick={() => setView(ViewState.HOME)}>
            <div className="bg-indigo-600 p-4 rounded-2xl group-hover:rotate-12 transition-transform shadow-[0_0_40px_rgba(79,70,229,0.5)]">
              <BrainCircuit size={32} className="text-white" />
            </div>
            <span className="font-black text-4xl tracking-tighter text-white">LEVEL<span className="text-indigo-500">UP</span>ED</span>
          </div>

          <nav className="hidden lg:flex items-center space-x-20">
            {[
              { name: 'Courses', view: ViewState.WORLD_MAP, icon: Map },
              { name: 'Analytics', view: ViewState.DASHBOARD, icon: LayoutDashboard },
              { name: 'Settings', view: ViewState.ADMIN, icon: Settings }
            ].map(item => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`flex items-center space-x-4 font-black text-xs tracking-[0.4em] hover:text-indigo-400 transition-colors uppercase ${view === item.view ? 'text-indigo-400' : 'text-slate-500'}`}
              >
                <item.icon size={20} /> <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-12">
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full">Level {user.level}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.xp.toLocaleString()} XP</span>
              </div>
              <div className="w-56 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                <div className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-400 transition-all duration-1000" style={{ width: `${(user.xp % 1000) / 10}%` }}></div>
              </div>
            </div>

            {/* Gamification HUD */}
            <div className="flex items-center space-x-6 mr-8">
              <button onClick={() => setShowShop(true)} className="flex items-center space-x-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-full hover:border-cyan-500 transition-colors group">
                <Gem size={18} className="text-cyan-400 group-hover:animate-pulse" />
                <span className="font-bold text-slate-300 group-hover:text-white">{user.gems}</span>
              </button>
              <button onClick={() => setShowResume(true)} className="flex items-center space-x-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-full hover:border-purple-500 transition-colors group">
                <FileText size={18} className="text-purple-400" />
                <span className="font-bold text-xs uppercase tracking-widest text-slate-400 group-hover:text-white">CV</span>
              </button>
              <div className="flex items-center space-x-2">
                <StreakFlame streak={user.streak} />
              </div>
            </div>

            <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={40} /> : <Menu size={40} />}
            </button>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors" title="Logout">
              <Power size={24} />
            </button>
          </div>
        </header>
      )}

      <main className="flex-1 relative overflow-hidden">
        {renderContent()}

        {/* Gamification Overlays */}
        <ShopModal
          isOpen={showShop}
          onClose={() => setShowShop(false)}
          gems={user.gems}
          freezeCount={user.freezeCount}
          onBuyFreeze={handleBuyFreeze}
        />

        {showResume && (
          <div className="fixed inset-0 z-[100] bg-slate-950/90 overflow-y-auto p-12 backdrop-blur-xl animate-in fade-in duration-300">
            <button onClick={() => setShowResume(false)} className="fixed top-8 right-8 z-[110] p-4 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors">
              <X size={24} />
            </button>
            <ResumeView user={user} />
          </div>
        )}

        {/* Certificate Modal */}
        {showCertificate && currentCertificate && (
          <CertificateView
            certificate={currentCertificate}
            onClose={() => {
              setShowCertificate(false);
              setCurrentCertificate(null);
            }}
          />
        )}
      </main>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
