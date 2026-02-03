
import React, { useState, useEffect, useRef } from 'react';
import { World, BossState, Message } from '../types';
import { evaluateBossAnswer, generateBossQuestion } from '../services/geminiService';
import { playSound, speak } from '../services/audioService';
import { Briefcase, CheckCircle, AlertCircle, Sparkles, Mic, MicOff } from 'lucide-react';
import { Loader } from './Loader';

interface BossArenaProps {
  world: World;
  onVictory: () => void;
  onDefeat: () => void;
  onExit: () => void;
}

export const BossArena: React.FC<BossArenaProps> = ({ world, onVictory, onDefeat, onExit }) => {
  const [bossState, setBossState] = useState<BossState>({
    active: true,
    bossHp: 100,
    maxBossHp: 100,
    playerHp: 100,
    maxPlayerHp: 100,
    turn: 1,
    messages: [{
      id: 'intro',
      role: 'model',
      timestamp: Date.now(),
      text: `INTERVIEW STARTING... TRACK: ${world.name.toUpperCase()}... CONNECTING TO INTERVIEWER.`
    }],
    status: 'intro'
  });


  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [bossPulse, setBossPulse] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Error", event.error); // Silent fail
        setIsListening(false);
      };

      recognition.onend = () => {
        // Auto-restart if we think we are still listening?
        // For now, simpler toggle behavior is safer.
        // setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput(''); // Clear input for fresh speech
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Adaptation Metrics
  const startTimeRef = useRef<number>(Date.now());
  const [mistakeCount, setMistakeCount] = useState(0);

  // Store the text of the last asked question for adaptation logic
  const lastQuestionText = useRef<string>("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [bossState.messages]);

  useEffect(() => {
    if (bossState.status === 'intro') {
      const startFight = async () => {
        setLoading(true);
        const q = await generateBossQuestion(world.bossName, world.name, 1);
        lastQuestionText.current = q;
        setBossState(prev => ({
          ...prev,
          status: 'fighting',
          messages: [...prev.messages, {
            id: 'q1',
            role: 'model',
            text: q,
            timestamp: Date.now()
          }]
        }));
        setLoading(false);
      };
      setTimeout(startFight, 3000);
    }
  }, []);

  const handleAttack = async () => {
    if (!input.trim() || loading || bossState.status !== 'fighting') return;

    const userAns = input;
    setInput('');
    setLoading(true);

    setBossState(prev => ({
      ...prev,
      messages: [...prev.messages, {
        id: Date.now().toString(),
        role: 'user',
        text: userAns,
        timestamp: Date.now()
      }]
    }));

    // Use the stored question text, or fallback to the last message if needed
    const questionAsked = lastQuestionText.current || "General knowledge";

    const result = await evaluateBossAnswer(
      world.bossName,
      world.name,
      questionAsked,
      userAns
    );

    let newBossHp = bossState.bossHp;
    let newPlayerHp = bossState.playerHp;

    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    startTimeRef.current = Date.now(); // Reset for next q

    // --- Dynamic Reaction Logic ---
    let reactionPrefix = "";
    let soundToPlay: 'attack' | 'success' | 'failure' = 'failure';
    let mood: 'happy' | 'sad' | 'neutral' = 'neutral';

    if (result.isCorrect) {
      // Calculate "Quality" based on damage
      if (result.damage >= 30) {
        reactionPrefix = ['🚀 GODLIKE!', '🔥 UNSTOPPABLE!', '🧠 GIGABRAIN!', '⚡ LEGENDARY!'][Math.floor(Math.random() * 4)];
        soundToPlay = 'success'; // Treat high damage as a mini-win sounds
        mood = 'happy';
      } else if (result.damage >= 15) {
        reactionPrefix = ['✨ Excellent!', '💎 Precise!', '🌟 Superb!', '💪 Strong!'][Math.floor(Math.random() * 4)];
        soundToPlay = 'attack';
        mood = 'happy';
      } else {
        reactionPrefix = ['✅ Correct.', '👍 Good.', '👌 Accepted.', '🔵 Logical.'][Math.floor(Math.random() * 4)];
        soundToPlay = 'attack';
        mood = 'neutral';
      }

      newBossHp = Math.max(0, bossState.bossHp - result.damage - (timeTaken < 10 ? 5 : 0)); // Speed bonus
      setBossPulse(true);
      setTimeout(() => setBossPulse(false), 500);
    } else {
      reactionPrefix = ['❌ Incorrect.', '🧊 Cold.', '📉 Error.', '🚧 Debug needed.'][Math.floor(Math.random() * 4)];
      soundToPlay = 'failure';
      mood = 'sad';

      newPlayerHp = Math.max(0, bossState.playerHp - 25);
      setShake(true);
      setMistakeCount(prev => prev + 1);
      setTimeout(() => setShake(false), 500);
    }

    // Audio Feedback
    playSound(soundToPlay);
    const finalDialogue = `${reactionPrefix} ${result.dialogue} ${result.learningResource
        ? `\n\n📚 **Recommended Review:** ${result.learningResource.title} - ${result.learningResource.description}`
        : ''
      }`;
    speak(finalDialogue, mood);

    setBossState(prev => ({
      ...prev,
      bossHp: newBossHp,
      playerHp: newPlayerHp,
      messages: [...prev.messages, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: finalDialogue,
        timestamp: Date.now(),
        isCorrect: result.isCorrect
      }]
    }));

    if (newBossHp <= 0) {
      setBossState(prev => ({ ...prev, status: 'won' }));
      playSound('success'); // Victory Fanfare
      setTimeout(onVictory, 2000);
    } else if (newPlayerHp <= 0) {
      setBossState(prev => ({ ...prev, status: 'lost' }));
      playSound('failure'); // Game Over
      setTimeout(onDefeat, 2000);
    } else {
      // Adaptive Difficulty: Pass context to the generator
      const nextDifficulty = Math.min(bossState.turn + 1, 5);

      const adaptationContext = {
        lastQuestion: questionAsked,
        wasCorrect: result.isCorrect,
        timeTaken,
        totalMistakes: mistakeCount
      };

      const nextQ = await generateBossQuestion(
        world.bossName,
        world.name,
        nextDifficulty,
        adaptationContext as any
      );

      lastQuestionText.current = nextQ;

      setBossState(prev => ({
        ...prev,
        turn: prev.turn + 1,
        messages: [...prev.messages, {
          id: (Date.now() + 2).toString(),
          role: 'model',
          text: nextQ,
          timestamp: Date.now()
        }]
      }));
    }

    setLoading(false);
  };

  return (
    <div className={`flex flex-col h-full w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative transition-transform duration-300 ${shake ? 'animate-subtle-shake' : ''}`}>

      {/* HUD */}
      <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center z-10 backdrop-blur-md bg-opacity-80">
        <div className="flex flex-col w-1/3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">CANDIDATE CONFIDENCE</span>
            <span className="text-[10px] text-slate-500 font-mono">{bossState.playerHp}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-500 ${bossState.playerHp < 30 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-indigo-500 shadow-[0_0_8px_#6366f1]'}`}
              style={{ width: `${(bossState.playerHp / bossState.maxPlayerHp) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center border border-red-500/30 animate-pulse mb-1">
            <AlertCircle className="text-red-500" size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">QUESTION {Math.ceil(bossState.turn / 2)}</span>
        </div>

        <div className="flex flex-col w-1/3 items-end">
          <div className="flex justify-between items-center mb-2 w-full">
            <span className="text-[10px] text-slate-500 font-mono">{bossState.bossHp}% SATISFACTION</span>
            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">HIRING MANAGER</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full bg-indigo-500 transition-all duration-300 ${bossPulse ? 'animate-hp-pulse' : ''}`}
              style={{ width: `${(bossState.bossHp / bossState.maxBossHp) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Arena Display */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {bossState.status === 'intro' && (
          <div className="absolute inset-0 z-20 bg-slate-950/90 flex flex-col items-center justify-center space-y-4">
            <Briefcase size={80} className="text-indigo-500 animate-pulse" />
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Job Interview</h2>
            <div className="h-1 w-48 bg-slate-800 overflow-hidden rounded-full mt-4">
              <div className="h-full bg-indigo-500 animate-[loading_3s_ease-in-out]"></div>
            </div>
            <p className="text-indigo-400 font-mono text-[10px] animate-pulse uppercase tracking-[0.4em] mt-2">Reviewing Resume...</p>
          </div>
        )}

        {bossState.status === 'won' && (
          <div className="absolute inset-0 z-20 bg-indigo-950/90 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500 backdrop-blur-sm">
            <Sparkles size={80} className="text-indigo-400 animate-bounce" />
            <div className="text-center">
              <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Hired!</h2>
              <p className="text-indigo-300 font-mono text-[10px] uppercase tracking-widest mt-4">Assessment Passed. Skills Verified.</p>
            </div>
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-opacity-5"
        >
          {bossState.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-6 rounded-3xl text-sm shadow-2xl relative overflow-hidden ${msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none border border-indigo-400/50'
                : 'bg-slate-900/90 text-slate-300 border border-slate-800 rounded-tl-none backdrop-blur-md'
                }`}>
                {msg.role === 'model' && <Briefcase size={14} className="inline mr-2 text-indigo-400 mb-1" />}
                <div className="leading-relaxed">{msg.text}</div>
                {msg.isCorrect !== undefined && (
                  <div className={`mt-4 pt-4 border-t border-slate-800/50 flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest ${msg.isCorrect ? 'text-green-400' : 'text-red-500'}`}>
                    {msg.isCorrect ? <CheckCircle size={14} fill="currentColor" /> : <AlertCircle size={14} />}
                    <span>{msg.isCorrect ? 'Correct Answer' : 'Incorrect Response'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <Loader type="ai" text="Interviewer is evaluating..." className="border-red-500/30 bg-red-500/5 text-red-500" />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-10 bg-slate-900/70 border-t border-slate-800 backdrop-blur-xl">
        <div className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAttack()}
            disabled={loading || bossState.status !== 'fighting'}
            placeholder={bossState.status === 'fighting' ? "Type your answer..." : "Interview session idle..."}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-[2rem] pl-8 pr-16 py-6 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/50 font-mono text-sm transition-all disabled:opacity-30 placeholder:text-slate-700 shadow-inner"
          />
          <button
            onClick={toggleListening}
            className={`absolute right-16 top-4 bottom-4 px-4 rounded-[1.5rem] transition-all flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:text-white'}`}
            title="Toggle Voice Input"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button
            onClick={handleAttack}
            disabled={loading || bossState.status !== 'fighting'}
            className="absolute right-4 top-4 bottom-4 px-6 bg-red-600 hover:bg-red-500 rounded-[1.5rem] text-white disabled:opacity-30 transition-all active:scale-90 shadow-xl shadow-red-900/40 flex items-center justify-center group"
          >
            <Sparkles size={20} className="group-hover:scale-110 transition-transform" fill="currentColor" />
          </button>
        </div>
        <div className="flex justify-center mt-6">
          <button onClick={onExit} className="text-[10px] font-black text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center space-x-3 group">
            <AlertCircle size={14} className="group-hover:animate-shake" />
            <span>End Interview</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes subtle-shake {
          0%, 100% { transform: translate3d(0, 0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate3d(-3px, 0, 0); }
          20%, 40%, 60%, 80% { transform: translate3d(3px, 0, 0); }
        }
        .animate-subtle-shake {
          animation: subtle-shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes hp-pulse {
          0% { filter: brightness(1) drop-shadow(0 0 0px #ef4444); transform: scaleY(1); }
          50% { filter: brightness(2) drop-shadow(0 0 10px #ef4444); transform: scaleY(1.5); }
          100% { filter: brightness(1) drop-shadow(0 0 0px #ef4444); transform: scaleY(1); }
        }
        .animate-hp-pulse {
          animation: hp-pulse 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
