'use client';

import React, { useState, useEffect } from 'react';
import { useConnectFour, GameMode, Player } from './useConnectFour';
import { Board } from './Board';
import { Difficulty } from '@/lib/ai';
import { Bot, User, Globe, Trophy, Lightbulb, Zap, Clock, ArrowLeft, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCheatCodes } from './useCheatCodes';
import { useRouter } from 'next/navigation';
import { createOnlineMatch } from './useOnlineMatch';
import { supabase } from '@/lib/supabase';

const EMOJIS = ['😂', '🤔', '🤯', '🥱'];

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode>('ai');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [isBlitzMode, setIsBlitzMode] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  
  const theme = useCheatCodes();
  const router = useRouter();

  const { 
    board, currentPlayer, winner, dropPiece, resetGame, isAiThinking, 
    getHint, hintCol, redTime, yellowTime, activeTaunt, sendTaunt 
  } = useConnectFour(selectedMode, selectedDifficulty, isBlitzMode);

  // Trigger confetti on win
  useEffect(() => {
    if (winner === 'red' || winner === 'yellow') {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: winner === 'red' ? ['#e11d48', '#ffffff'] : ['#f59e0b', '#ffffff'] // rose-600, amber-500
      });
    }
  }, [winner]);

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
    setShowCoach(false);
  };

  const quitGame = () => {
    setIsPlaying(false);
    resetGame();
    setShowCoach(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayOnline = async () => {
    setIsCreatingMatch(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      let userId = sessionData.session?.user?.id;
      
      if (!userId) {
        const { data: signInData, error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.error("Error signing in anonymously:", error.message, error);
          throw error;
        }
        userId = signInData.user?.id;
      }
      
      if (userId) {
        const matchId = await createOnlineMatch(userId);
        if (matchId) {
          router.push(`/play/${matchId}`);
          return;
        } else {
          console.error("createOnlineMatch returned null. Check console for Supabase errors.");
        }
      }
    } catch (e) {
      console.error("Caught error in handlePlayOnline:", e instanceof Error ? e.message : String(e), e);
    }
    setIsCreatingMatch(false);
    alert('Failed to create online match. Please check the browser console for exact Supabase errors.');
  };

  if (!isPlaying) {
    return (
      <div className="min-h-full p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-6 bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
          <div className="text-center">
            <h1 className="text-3xl font-black mb-2 text-white/90 drop-shadow-md">Play Connect Four</h1>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => setSelectedMode('ai')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/5 transition-all border ${selectedMode === 'ai' ? 'border-rose-400/50 shadow-[0_0_15px_rgba(251,113,133,0.2)]' : 'border-white/5'}`}
            >
              <div className="w-12 h-12 flex items-center justify-center text-rose-400 drop-shadow-md">
                <Bot className="w-8 h-8" />
              </div>
              <div className="text-left flex-1">
                <div className="font-bold text-lg text-white/90 drop-shadow-sm">Computer</div>
                <div className="text-sm text-white/50">Play vs AI</div>
              </div>
            </button>

            {selectedMode === 'ai' && (
              <div className="flex gap-2 pl-4 pr-4">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`flex-1 py-2 text-sm font-bold rounded-xl capitalize transition-all border ${selectedDifficulty === diff ? 'bg-white/5 border-white/10 text-white/90 shadow-lg' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/5'}`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            )}

            <button 
              onClick={() => setSelectedMode('pass_and_play')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/5 transition-all border ${selectedMode === 'pass_and_play' ? 'border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-white/5'}`}
            >
              <div className="w-12 h-12 flex items-center justify-center text-amber-400 drop-shadow-md">
                <User className="w-8 h-8" />
              </div>
              <div className="text-left flex-1">
                <div className="font-bold text-lg text-white/90 drop-shadow-sm">Pass & Play</div>
                <div className="text-sm text-white/50">Play a friend locally</div>
              </div>
            </button>

            <button 
              onClick={handlePlayOnline}
              disabled={isCreatingMatch}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/5 transition-all border border-white/5 relative overflow-hidden group disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 group-hover:opacity-10 transition-opacity"></div>
              <div className="w-12 h-12 flex items-center justify-center text-blue-400 drop-shadow-md">
                {isCreatingMatch ? <Clock className="w-8 h-8 animate-pulse" /> : <Globe className="w-8 h-8" />}
              </div>
              <div className="text-left flex-1 relative z-10">
                <div className="font-bold text-lg text-white/90 drop-shadow-sm">{isCreatingMatch ? 'Connecting...' : 'Play Online'}</div>
                <div className="text-sm text-blue-200/60">Real-time Multiplayer</div>
              </div>
            </button>

            {/* Blitz Toggle */}
            <div className="mt-4 p-4 bg-white/5 rounded-2xl flex items-center justify-between border border-white/5 shadow-inner">
              <div className="flex items-center gap-3">
                <Zap className={`w-5 h-5 transition-colors ${isBlitzMode ? 'text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]' : 'text-white/30'}`} />
                <div>
                  <div className="text-white/90 font-bold text-sm">Blitz Mode</div>
                  <div className="text-xs text-white/50">60s total, +2s per move</div>
                </div>
              </div>
              <button 
                onClick={() => setIsBlitzMode(!isBlitzMode)}
                className={`w-12 h-6 rounded-full transition-colors relative border ${isBlitzMode ? 'bg-teal-500/80 border-teal-400/50 shadow-[0_0_12px_rgba(45,212,191,0.4)]' : 'bg-black/30 border-white/10'}`}
              >
                <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow-md ${isBlitzMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          <button 
            onClick={startGame}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/20 border border-white/10 text-white/90 rounded-2xl font-bold text-2xl transition-all shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-md mt-8 active:scale-[0.98]"
          >
            Play
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-full flex flex-col lg:flex-row items-center lg:items-start justify-center p-4 py-8 gap-8 relative transition-colors duration-1000 w-full ${theme === 'matrix' ? 'bg-black text-green-500' : ''}`}>
      
      <button onClick={quitGame} className="absolute top-4 left-4 text-white/50 hover:text-white/90 text-sm font-bold z-10 bg-white/5 hover:bg-white/10 px-4 py-3 min-h-[48px] rounded-full border border-white/10 backdrop-blur-md transition-colors shadow-lg flex items-center">
        &larr; Resign
      </button>

      {/* Board Section */}
      <div className="flex-1 flex justify-center w-full max-w-3xl lg:pt-8 relative z-0">
        <Board board={board} onDropPiece={dropPiece} winner={winner} hintCol={hintCol} theme={theme} />
      </div>

      {/* Right Sidebar UI for Match Info */}
      <div className="w-full lg:w-80 space-y-4 z-10">
        
        {/* Opponent Info */}
        <div className="bg-white/5 backdrop-blur-2xl p-4 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between relative">
          
          {/* Taunt Overlay for Player 2 */}
          {activeTaunt?.player === 'yellow' && (
            <div className="absolute -left-4 -top-6 bg-white/5 backdrop-blur-xl border border-white/10 text-4xl rounded-full p-3 shadow-2xl animate-bounce z-50">
              {activeTaunt.emoji}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border-b-4 transition-colors duration-300 shadow-inner ${currentPlayer === 'yellow' && !winner ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-transparent'}`}>
              {selectedMode === 'ai' ? <Bot className="w-6 h-6 text-white/80" /> : <User className="w-6 h-6 text-white/80" />}
            </div>
            <div>
              <div className="font-bold text-white/90 text-lg drop-shadow-sm">{selectedMode === 'ai' ? `Computer (${selectedDifficulty})` : 'Player 2'}</div>
              <div className="text-sm text-white/60 flex items-center gap-2 font-medium">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div> Yellow
              </div>
            </div>
          </div>
          
          {isBlitzMode && (
            <div className={`px-3 py-1.5 rounded-xl font-bold font-mono text-lg border transition-colors ${yellowTime <= 10 ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 'bg-white/5 border-white/10 text-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.2)]'}`}>
              {formatTime(yellowTime)}
            </div>
          )}
        </div>

        {/* Status Area */}
        <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center min-h-[140px] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
          <div className="relative z-10">
            {winner ? (
              <div>
                <Trophy className={`w-12 h-12 mx-auto mb-3 drop-shadow-lg ${winner === 'red' ? 'text-rose-400' : winner === 'yellow' ? 'text-amber-400' : 'text-white/50'}`} />
                <div className="text-2xl font-black text-white/90 drop-shadow-md">
                  {winner === 'draw' ? 'Draw' : winner === 'red' ? 'You Won!' : 'Opponent Won'}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-white/50 mb-1 uppercase tracking-widest font-bold">Turn</div>
                <div className="text-2xl font-black text-white/90 drop-shadow-md">
                  {isAiThinking ? 'Thinking...' : (currentPlayer === 'red' ? 'Your Turn' : 'Opponent Turn')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Player Info */}
        <div className="bg-white/5 backdrop-blur-2xl p-4 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between relative">
          
          {/* Taunt Overlay for Player 1 */}
          {activeTaunt?.player === 'red' && (
            <div className="absolute -left-4 -top-6 bg-white/5 backdrop-blur-xl border border-white/10 text-4xl rounded-full p-3 shadow-2xl animate-bounce z-50">
              {activeTaunt.emoji}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border-b-4 transition-colors duration-300 shadow-inner ${currentPlayer === 'red' && !winner ? 'border-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(225,29,72,0.2)]' : 'border-transparent'}`}>
              <User className="w-6 h-6 text-white/80" />
            </div>
            <div>
              <div className="font-bold text-white/90 text-lg drop-shadow-sm">You</div>
              <div className="text-sm text-white/60 flex items-center gap-2 font-medium">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-[0_0_8px_rgba(225,29,72,0.6)]"></div> Red
              </div>
            </div>
          </div>

          {isBlitzMode && (
            <div className={`px-3 py-1.5 rounded-xl font-bold font-mono text-lg border transition-colors ${redTime <= 10 ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 'bg-white/5 border-white/10 text-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.2)]'}`}>
              {formatTime(redTime)}
            </div>
          )}
        </div>

        {/* Taunt Bar & Action Buttons */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          
          {/* Emote Buttons */}
          {!winner && EMOJIS.map(emoji => (
            <button 
              key={emoji}
              onClick={() => sendTaunt('red', emoji)}
              className="py-3 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/5 rounded-2xl text-2xl transition-all hover:scale-110 active:scale-95 shadow-lg"
            >
              {emoji}
            </button>
          ))}

          {!winner && (
            <button 
              onClick={getHint}
              disabled={isAiThinking || currentPlayer !== 'red'}
              className="col-span-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/5 disabled:opacity-50 text-white/90 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] mt-2"
            >
              <Lightbulb className="w-5 h-5 text-amber-300 drop-shadow-md" /> Get Hint
            </button>
          )}

          {winner && (
            <div className="col-span-4 flex gap-3">
              <button 
                onClick={resetGame}
                className="flex-1 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border border-emerald-500/30 shadow-lg active:scale-[0.98]"
              >
                <Play className="w-6 h-6" />
                <span className="drop-shadow-sm">Play Again</span>
              </button>
              <button 
                onClick={quitGame}
                className="flex-1 py-4 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white/90 font-bold rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border border-white/10 shadow-lg active:scale-[0.98]"
              >
                <ArrowLeft className="w-6 h-6 text-white/50" />
                <span className="drop-shadow-sm">Main Menu</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Coach Modal */}
      {showCoach && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg">
          <div className="bg-slate-900/80 backdrop-blur-3xl p-8 rounded-3xl max-w-lg w-full border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.6)] relative">
            <button onClick={() => setShowCoach(false)} className="absolute top-4 right-4 text-white/40 hover:text-white/90 bg-white/5 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 transition-colors">✕</button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-blue-400 flex items-center justify-center shadow-inner">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white/90 drop-shadow-sm">AI Coach</h2>
                <p className="text-white/50 text-sm">Post-match analysis</p>
              </div>
            </div>
            
            <div className="space-y-4 text-white/80">
              <p>Analyzing your match...</p>
              <div className="bg-white/5 p-4 rounded-2xl border-l-4 border-rose-500 shadow-sm">
                <strong>Time Management:</strong> &ldquo;В формате Blitz вам нужно думать быстрее. Вы тратили в среднем по 4 секунды на ход.&rdquo;
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border-l-4 border-teal-400 shadow-sm">
                <strong>Great Setup:</strong> &ldquo;Контроль центра поля в Connect Four критически важен, и вы справились с этим.&rdquo;
              </div>
            </div>

            <button onClick={() => setShowCoach(false)} className="w-full mt-8 py-3 bg-white/5 hover:bg-white/20 border border-white/10 text-white/90 rounded-2xl font-bold transition-all shadow-lg active:scale-[0.98]">
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
