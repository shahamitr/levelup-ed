import React, { useState, useEffect, useRef, Suspense } from 'react';
import { ViewState, World, UserState, Message, WorldId, Bounty, Artifact, League, LeagueUser } from './types';
import { WORLDS, INITIAL_USER_STATE, MASTER_ACHIEVEMENTS } from './constants';
import { WorldCard } from './components/WorldCard';
import { WorldPath } from './components/WorldPath';
import { BossArena } from './components/BossArena';
// Lazy Load Heavy Views
const Dashboard = React.lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const AdminPanel = React.lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })));
const LandingPage = React.lazy(() => import('./components/LandingPage').then(module => ({ default: module.LandingPage })));

import { LoginPage } from './components/LoginPage';
import { Loader } from './components/Loader';
import { Hologram } from './components/Hologram';
import { StreakFlame } from './components/StreakFlame';
import { ShopModal } from './components/ShopModal';
import { LeagueLeaderboard } from './components/LeagueLeaderboard';
import { ResumeView } from './components/ResumeView';
import { CertificateView } from './components/CertificateView';
import { CourseDrawer } from './components/CourseDrawer';
import { DailyGoal } from './components/DailyGoal';
import { AdventureMap } from './components/AdventureMap';
import { LessonView } from './components/LessonView';
import { CelebrationModal } from './components/CelebrationModal';
import { UserAvatarDropdown } from './components/UserAvatarDropdown';
import { UserProfile } from './components/UserProfile';
import { StudentHome } from './components/StudentHome';
import { DailyLoginModal } from './components/DailyLoginModal';
import { FriendsList } from './components/FriendsList';
import { StudyGroupList } from './components/StudyGroupList';
import { HeartsCompact } from './components/HeartsDisplay';
import { playSound, decode, decodeAudioData } from './services/audioService';
import { generateLessonContent, chatWithCoach, generateCoachSpeech, generateWorldFromTopic } from './services/geminiService';
import { useNotification } from './contexts/NotificationContext';
import { THEMES } from './constants/themes';
import { LayoutDashboard, Map, BrainCircuit, Menu, X, Settings, Gem, FileText, Power } from 'lucide-react';

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
    const token = localStorage.getItem('token');
    return (saved && token) ? ViewState.HOME : ViewState.LANDING;
  });

  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  // Social Modals State
  const [showFriends, setShowFriends] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

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
    if (signedInUser.email === 'admin@leveluped.com') {
      setView(ViewState.ADMIN);
    } else {
      setView(ViewState.HOME);
    }
    addNotification(`IDENTITY VERIFIED: ${signedInUser.username.toUpperCase()}`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('leveluped_state_v1');
    setUser(INITIAL_USER_STATE);
    setView(ViewState.LANDING);
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

  // --- Daily Reward Logic ---
  const [showDailyReward, setShowDailyReward] = useState(false);

  useEffect(() => {
    // Only check on HOME and if user is logged in (skip for Admin)
    const isAdmin = user.name.toLowerCase().includes('admin');
    if (view === ViewState.HOME && user.name !== 'Incognito' && !isAdmin) {
      const today = new Date().toDateString();
      const lastClaim = localStorage.getItem('leveluped_daily_claim');

      if (lastClaim !== today) {
        // Delay slightly for effect
        const timer = setTimeout(() => {
          setShowDailyReward(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [view, user.name]);

  const handleClaimDailyReward = () => {
    const today = new Date().toDateString();
    localStorage.setItem('leveluped_daily_claim', today);

    setUser(prev => ({
      ...prev,
      xp: prev.xp + 50,
      gems: prev.gems + 10,
      streak: prev.streak + 1 // Simple streak increment
    }));

    addNotification("DAILY REWARD CLAIMED! +50 XP, +10 GEMS", 'success');
    playSound('levelUp');
    setShowDailyReward(false);
  };

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

    // Trigger Certificate if Mastery Awarded
    if (masteryAwarded) {
      setTimeout(() => {
        setCurrentCertificate({
          id: `cert-${Date.now()}`,
          recipientName: user.name,
          courseName: selectedWorld.name,
          issueDate: new Date().toLocaleDateString(),
          skills: [selectedWorld.name, 'Problem Solving', 'Critical Thinking'],
          certificateNumber: `LUE-${Math.floor(Math.random() * 100000)}`,
          verificationUrl: `https://levelup-ed.com/verify/${Date.now()}`
        });
        setShowCertificate(true);
        addNotification("CERTIFICATE EARNED! Check your profile.", 'success');
        playSound('levelUp');
      }, 2000);
    }

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
        return <LoginPage onLogin={handleLogin} onBack={() => setView(ViewState.LANDING)} />;

      case ViewState.HOME:
        return (
          <StudentHome
            user={user}
            courses={courses}
            onNavigate={setView}
            onStartLesson={startLesson}
          />
        );

      case ViewState.WORLD_MAP:
        return (
          <AdventureMap
            courses={courses}
            user={user}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            setSelectedWorld={setSelectedWorld}
            setView={setView}
            isWorldLocked={isWorldLocked}
            generateWorldFromTopic={generateWorldFromTopic}
            addNotification={addNotification}
            setCourses={setCourses}
            startLesson={startLesson}
          />
        );

      case ViewState.LESSON:
        return (
          <LessonView
            selectedWorld={selectedWorld}
            currentLevel={currentLevel}
            user={user}
            showDriftAlert={showDriftAlert}
            showTimeUpOverlay={showTimeUpOverlay}
            isResyncing={isResyncing}
            timeLeft={timeLeft}
            formatTime={formatTime}
            lessonContent={lessonContent}
            chatHistory={chatHistory}
            ttsEnabled={ttsEnabled}
            setTtsEnabled={setTtsEnabled}
            chatLoading={chatLoading}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendMessage={handleSendMessage}
            handleContinueSync={handleContinueSync}
            setView={setView}
            addNotification={addNotification}
          />
        );

      case ViewState.BOSS_FIGHT:
        return selectedWorld ? (
          <div className="h-full p-12 bg-slate-950 flex items-center justify-center">
            <BossArena world={selectedWorld} onVictory={handleBossVictory} onDefeat={() => { addNotification("INTERVIEW FAILED: TRY AGAIN", 'error'); setView(ViewState.WORLD_MAP); }} onExit={() => setView(ViewState.LESSON)} />
          </div>
        ) : null;

      case ViewState.CELEBRATION:
        return (
          <CelebrationModal
            stats={lastVictoryStats}
            selectedWorld={selectedWorld}
            currentLevel={currentLevel}
            setView={setView}
          />
        );

      case ViewState.DASHBOARD:
        return <Dashboard user={user} courses={courses} />;

      case ViewState.ADMIN:
        return (
          <AdminPanel
            onExit={() => setView(ViewState.HOME)}
            milestones={milestones}
            onSaveMilestone={(m) => setMilestones([...milestones, m])}
            onDeleteMilestone={(id) => setMilestones(milestones.filter(m => m.id !== id))}
          />
        );

      case ViewState.USER_PROFILE:
        return <UserProfile user={user} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {view !== ViewState.LOGIN && view !== ViewState.LANDING && (
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
              { name: 'Analytics', view: ViewState.DASHBOARD, icon: LayoutDashboard }
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

            {/* Gamification HUD */}
            <div className="flex items-center space-x-6 mr-8">
              <HeartsCompact hearts={user.hearts} maxHearts={user.maxHearts} onClick={() => setShowShop(true)} />
              <button onClick={() => setShowShop(true)} className="flex items-center space-x-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-full hover:border-cyan-500 transition-colors group">
                <Gem size={18} className="text-cyan-400 group-hover:animate-pulse" />
                <span className="font-bold text-slate-300 group-hover:text-white">{user.gems}</span>
              </button>
              <div className="flex items-center space-x-2">
                <StreakFlame streak={user.streak} />
              </div>
            </div>

            <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={40} /> : <Menu size={40} />}
            </button>

            {/* User Avatar Dropdown */}
            <UserAvatarDropdown
              user={user}
              onNavigate={setView}
              onLogout={handleLogout}
              onShowResume={() => setShowResume(true)}
              onShowFriends={() => setShowFriends(true)}
              onShowGroups={() => setShowGroups(true)}
              onShowLeaderboard={() => setShowLeaderboard(true)}
            />
          </div>
        </header>
      )}

      <main className="flex-1 relative overflow-hidden">
        <Suspense fallback={<Loader type="app" text="INITIALIZING..." />}>
          {renderContent()}
        </Suspense>

        {/* Gamification Overlays */}
        {showDailyReward && (
          <DailyLoginModal
            onClose={() => setShowDailyReward(false)}
            onClaim={handleClaimDailyReward}
            streak={user.streak}
          />
        )}

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

        {/* SOCIAL MODALS */}
        {showFriends && (
          <FriendsList
            friends={[
              { id: 'f1', username: 'SarahCoder', level: 5, xp: 4500 },
              { id: 'f2', username: 'DevDave', level: 3, xp: 2800 },
              { id: 'f3', username: 'AlgoMaster', level: 8, xp: 7800 }
            ]}
            pendingRequests={[]}
            onClose={() => setShowFriends(false)}
            onSendRequest={() => addNotification('Request Sent!', 'success')}
            onAcceptRequest={() => { }}
            onDeclineRequest={() => { }}
            onChallenge={() => addNotification('Challenge feature coming soon!', 'info')}
            onSearch={async () => []}
          />
        )}

        {showGroups && (
          <StudyGroupList
            groups={[
              { id: 'g1', name: 'React Learners', topic: 'Frontend', members: 12, maxMembers: 20, owner: { username: 'SarahCoder' }, username: 'SarahCoder', _count: { members: 12 } },
              { id: 'g2', name: 'Python Pythons', topic: 'Data Science', members: 8, maxMembers: 15, owner: { username: 'DevDave' }, username: 'DevDave', _count: { members: 8 } }
            ]}
            myGroups={[]}
            onJoinGroup={() => addNotification('Joined group!', 'success')}
            onLeaveGroup={() => { }}
            onCreateGroup={() => addNotification('Group created!', 'success')}
            onOpenGroup={() => { }}
            onClose={() => setShowGroups(false)}
          />
        )}

        {showLeaderboard && (
          <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowLeaderboard(false)}>
            <div onClick={e => e.stopPropagation()}>
              <LeagueLeaderboard
                leagueName="Gold"
                users={[
                  { id: 'u1', username: 'CodeNinja', xp: 15000, rank: 1 },
                  { id: 'u2', username: 'ByteWizard', xp: 14200, rank: 2 },
                  { id: 'u3', username: 'ReactGuru', xp: 13800, rank: 3 },
                  { id: 'me', username: user.name, xp: user.xp, rank: 12, isCurrentUser: true },
                  { id: 'u4', username: 'JavaJedi', xp: 12000, rank: 4 }
                ]}
              />
            </div>
          </div>
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
