'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConnectFour, GameMode, Player } from '@/hooks/useConnectFour';
import { Board } from '@/components/Board';
import { Difficulty } from '@/lib/ai';
import { Bot, User, Globe, Lightbulb, Zap, Clock, ArrowLeft, Play } from 'lucide-react';
import { usePro } from '@/context/ProContext';
import confetti from 'canvas-confetti';
import { useCheatCodes } from '@/hooks/useCheatCodes';
import { createOnlineMatch } from '@/hooks/useOnlineMatch';
import { supabase } from '@/lib/supabase';
import { SidebarWidgets } from '@/components/SidebarWidgets';

const EMOJIS = ['😂', '🤔', '🤯', '🥱'];

export default function Home() {
  const { isPro } = usePro();
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

  useEffect(() => {
    if (winner === 'red' || winner === 'yellow') {
      confetti({
        particleCount: 200, spread: 100, origin: { y: 0.6 },
        colors: winner === 'red' ? ['#e11d48', '#ffffff'] : ['#f59e0b', '#ffffff']
      });
    }
  }, [winner]);

  const startGame = () => { resetGame(); setIsPlaying(true); setShowCoach(false); };
  const quitGame = () => { setIsPlaying(false); resetGame(); setShowCoach(false); };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handlePlayOnline = async () => {
    setIsCreatingMatch(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      let userId = sessionData.session?.user?.id;
      if (!userId) {
        const { data: signInData, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        userId = signInData.user?.id;
      }
      if (userId) {
        const matchId = await createOnlineMatch(userId);
        if (matchId) { router.push(`/play/${matchId}`); return; }
      }
    } catch (e) {
      console.error(e);
    }
    setIsCreatingMatch(false);
    alert('Failed to create online match. Check console for details.');
  };

  /* ─── LOBBY SCREEN ─── */
  if (!isPlaying) {
    return (
      <div className="min-h-full p-4 md:p-8 flex flex-col items-center justify-center bg-transparent">
        <div className="max-w-md w-full space-y-3 border border-white/8 bg-white/[0.03] rounded-2xl p-6 md:p-8">
          
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">Play Connect Four</h1>
            <p className="text-zinc-500 text-sm">Choose your game mode below</p>
          </div>

          {/* Mode Buttons */}
          <button 
            onClick={() => setSelectedMode('ai')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
              selectedMode === 'ai'
                ? 'border-white/20 bg-white/8 text-white'
                : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/10 hover:bg-white/5'
            }`}
          >
            <Bot className="w-6 h-6 shrink-0" />
            <div className="text-left">
              <div className="font-bold text-sm">vs Computer</div>
              <div className="text-xs opacity-60">Play against AI</div>
            </div>
            {selectedMode === 'ai' && <div className="ml-auto w-2 h-2 rounded-full bg-white" />}
          </button>

          {selectedMode === 'ai' && (
            <div className="flex gap-2 px-1">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                <button key={diff} onClick={() => setSelectedDifficulty(diff)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all border ${
                    selectedDifficulty === diff
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          )}

          <button 
            onClick={() => setSelectedMode('pass_and_play')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
              selectedMode === 'pass_and_play'
                ? 'border-white/20 bg-white/8 text-white'
                : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/10 hover:bg-white/5'
            }`}
          >
            <User className="w-6 h-6 shrink-0" />
            <div className="text-left">
              <div className="font-bold text-sm">Pass & Play</div>
              <div className="text-xs opacity-60">Two players, one screen</div>
            </div>
            {selectedMode === 'pass_and_play' && <div className="ml-auto w-2 h-2 rounded-full bg-white" />}
          </button>

          <button 
            onClick={handlePlayOnline}
            disabled={isCreatingMatch}
            className="w-full flex items-center gap-4 p-4 rounded-xl transition-all border border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/10 hover:bg-white/5 disabled:opacity-40"
          >
            {isCreatingMatch ? <Clock className="w-6 h-6 shrink-0 animate-pulse" /> : <Globe className="w-6 h-6 shrink-0" />}
            <div className="text-left">
              <div className="font-bold text-sm">{isCreatingMatch ? 'Connecting...' : 'Play Online'}</div>
              <div className="text-xs opacity-60">Real-time multiplayer</div>
            </div>
          </button>

          {/* Blitz Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <Zap className={`w-4 h-4 ${isBlitzMode ? 'text-white' : 'text-zinc-600'}`} />
              <div>
                <div className={`text-sm font-bold ${isBlitzMode ? 'text-white' : 'text-zinc-400'}`}>Blitz Mode</div>
                <div className="text-xs text-zinc-600">60s total, +2s per move</div>
              </div>
            </div>
            <button
              onClick={() => setIsBlitzMode(!isBlitzMode)}
              className={`w-11 h-6 rounded-full transition-all relative ${isBlitzMode ? 'bg-white' : 'bg-white/10'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all shadow ${isBlitzMode ? 'bg-black left-5' : 'bg-zinc-400 left-0.5'}`} />
            </button>
          </div>

          {/* Play Button */}
          <button
            onClick={startGame}
            className="w-full py-4 bg-white hover:bg-zinc-100 text-black font-black rounded-xl transition-all active:scale-[0.98] text-lg mt-4"
          >
            Play
          </button>

          {/* Mobile Sidebar Widgets */}
          <div className="mt-2 md:hidden">
            <SidebarWidgets isMobile={true} />
          </div>
        </div>
      </div>
    );
  }

  /* ─── GAME SCREEN ─── */
  return (
    <div className={`min-h-full flex flex-col lg:flex-row items-center lg:items-start justify-start lg:justify-center p-4 pt-12 md:pt-6 lg:pt-8 pb-8 gap-6 w-full bg-transparent ${theme === 'matrix' ? '!bg-black text-green-500' : ''}`}>
      
      {/* Resign (mobile) */}
      <div className="w-full max-w-3xl flex justify-start lg:hidden mb-2">
        <button onClick={quitGame} className="text-zinc-400 hover:text-white text-sm font-bold bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-full border border-white/10 transition-all">
          ← Resign
        </button>
      </div>
      {/* Resign (desktop) */}
      <button onClick={quitGame} className="hidden lg:flex absolute top-4 left-4 text-zinc-400 hover:text-white text-sm font-bold z-10 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-full border border-white/10 transition-all items-center">
        ← Resign
      </button>

      {/* Board */}
      <div className="flex-1 flex justify-center w-full max-w-3xl lg:pt-8 relative z-0">
        <Board board={board} onDropPiece={dropPiece} winner={winner} hintCol={hintCol} theme={theme} />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-72 space-y-3 z-10">

        {/* Opponent Card */}
        <div className={`p-4 rounded-xl border transition-all ${currentPlayer === 'yellow' && !winner ? 'border-white/20 bg-white/5' : 'border-white/5 bg-white/[0.02]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 shadow-[0_0_12px_rgba(251,191,36,0.4)]" />
              <div>
                <div className="text-sm font-bold text-white">{selectedMode === 'ai' ? `AI (${selectedDifficulty})` : 'Player 2'}</div>
                <div className="text-xs text-zinc-500">Yellow</div>
              </div>
            </div>
            {activeTaunt?.player === 'yellow' && (
              <div className="text-2xl animate-bounce">{activeTaunt.emoji}</div>
            )}
            {isBlitzMode && (
              <div className={`text-sm font-mono font-bold px-2.5 py-1 rounded-lg border ${yellowTime <= 10 ? 'text-rose-400 border-rose-500/40 bg-rose-500/10 animate-pulse' : 'text-zinc-300 border-white/10 bg-white/5'}`}>
                {formatTime(yellowTime)}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] text-center">
          {winner ? (
            <>
              <div className="text-4xl mb-2">
                {winner === 'draw' ? '🤝' : winner === 'red' ? '🏆' : '😔'}
              </div>
              <div className="text-lg font-black text-white">
                {winner === 'draw' ? "It's a Draw!" : winner === 'red' ? 'You Won!' : 'You Lost'}
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-zinc-600 uppercase tracking-widest font-bold mb-1">Turn</div>
              <div className="text-xl font-black text-white">
                {isAiThinking ? 'Thinking...' : currentPlayer === 'red' ? 'Your Turn' : 'Opponent'}
              </div>
            </>
          )}
        </div>

        {/* Player Card */}
        <div className={`p-4 rounded-xl border transition-all ${currentPlayer === 'red' && !winner ? 'border-white/20 bg-white/5' : 'border-white/5 bg-white/[0.02]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-[0_0_12px_rgba(225,29,72,0.4)]" />
              <div>
                <div className="text-sm font-bold text-white">You</div>
                <div className="text-xs text-zinc-500">Red</div>
              </div>
            </div>
            {activeTaunt?.player === 'red' && (
              <div className="text-2xl animate-bounce">{activeTaunt.emoji}</div>
            )}
            {isBlitzMode && (
              <div className={`text-sm font-mono font-bold px-2.5 py-1 rounded-lg border ${redTime <= 10 ? 'text-rose-400 border-rose-500/40 bg-rose-500/10 animate-pulse' : 'text-zinc-300 border-white/10 bg-white/5'}`}>
                {formatTime(redTime)}
              </div>
            )}
          </div>
        </div>

        {/* Emojis & Actions */}
        <div className="space-y-3">
          {!winner && (
            <div className="grid grid-cols-4 gap-2">
              {EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => sendTaunt('red', emoji)}
                  className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xl transition-all hover:scale-110 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {!winner && (
            <button onClick={getHint} disabled={isAiThinking || currentPlayer !== 'red'}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30 text-sm"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" /> Get Hint
            </button>
          )}

          {winner && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button onClick={resetGame}
                  className="flex-1 py-3.5 bg-white hover:bg-zinc-100 text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
                >
                  <Play className="w-4 h-4" /> Play Again
                </button>
                <button onClick={quitGame}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10 active:scale-[0.98] text-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Menu
                </button>
              </div>
              <button onClick={() => setShowCoach(true)}
                className="fixed bottom-6 left-4 right-4 z-50 md:static md:bottom-auto md:left-auto md:right-auto w-full py-3.5 bg-white text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm hover:bg-zinc-100"
              >
                <Bot className="w-4 h-4" /> Analyze Match
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Coach Modal */}
      {showCoach && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-lg w-full relative shadow-2xl">
            <button onClick={() => setShowCoach(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">✕</button>
            
            <div className="p-6 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">AI Coach</h2>
                  <p className="text-zinc-500 text-xs">Post-match analysis</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              <p className="text-sm text-zinc-400 mb-4">Привет! Я твой наставник. Давай разберем твою последнюю партию.</p>
              
              <div className="p-4 rounded-xl border border-white/8 bg-white/[0.03]">
                <div className="font-bold text-white text-sm mb-1 flex items-center gap-2">🎯 Шаг 1: Контроль центра</div>
                <p className="text-xs text-zinc-400 leading-relaxed">В игре «4 в ряд» фишки в центральном столбце самые полезные — из центра можно собрать линию в любую сторону. В этой партии ты отлично занял центр!</p>
              </div>

              <div className="p-4 rounded-xl border border-white/8 bg-white/[0.03]">
                <div className="font-bold text-white text-sm mb-1 flex items-center gap-2">⚠️ Шаг 2: Внимательность</div>
                <p className="text-xs text-zinc-400 leading-relaxed">Ты пропустил ловушку соперника на краю доски. Правило: всегда проверяй линии из 3-х фишек у соперника перед ходом. Видишь три — блокируй!</p>
              </div>

              <div className="p-4 rounded-xl border border-white/8 bg-white/[0.03]">
                <div className="font-bold text-white text-sm mb-1 flex items-center gap-2">⏱️ Шаг 3: Темп игры</div>
                <p className="text-xs text-zinc-400 leading-relaxed">Ты действовал слишком быстро. Иногда лучше остановиться на 5 секунд и осмотреть всю доску целиком.</p>
              </div>
            </div>

            <div className="p-4 border-t border-white/8">
              <button onClick={() => setShowCoach(false)} className="w-full py-3 bg-white hover:bg-zinc-100 text-black font-black rounded-xl transition-all active:scale-[0.98] text-sm">
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
