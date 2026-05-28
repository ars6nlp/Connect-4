'use client';
import React, { useEffect, useState } from 'react';
import { useConnectFour } from '@/app/useConnectFour';
import { useOnlineMatch } from '@/app/useOnlineMatch';
import { Board } from '@/app/Board';
import { useCheatCodes } from '@/app/useCheatCodes';
import { Globe, User, Clock, AlertCircle, Copy, Check, Trophy, Zap, Palette } from 'lucide-react';
import { usePro } from '@/context/ProContext';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { GameChat } from './GameChat';

const EMOJIS = ['😂', '🤔', '🤯', '🥱'];

export default function OnlinePlayPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = React.use(params);
  const { isPro } = usePro();
  const { match, userId, isPlayer1, error, sendMove, broadcastTaunt, incomingTaunt, broadcastChat, incomingChat } = useOnlineMatch(matchId);
  const theme = useCheatCodes();
  const [copied, setCopied] = useState(false);

  const {
    board, currentPlayer, winner, dropPiece, syncWithRemoteMoves, moves,
    redTime, yellowTime, activeTaunt, sendTaunt
  } = useConnectFour('online', 'medium', true); // Force Blitz Mode ON for online showcase

  // Sync incoming realtime taunts to local state
  useEffect(() => {
    if (incomingTaunt) {
      sendTaunt(incomingTaunt.player, incomingTaunt.emoji);
    }
  }, [incomingTaunt, sendTaunt]);

  const handleSendTaunt = (emoji: string) => {
    const myPlayer = isPlayer1 ? 'red' : 'yellow';
    sendTaunt(myPlayer, emoji); // Show locally
    broadcastTaunt(myPlayer, emoji); // Broadcast to opponent
  };

  // Trigger confetti on win
  useEffect(() => {
    if (winner === 'red' || winner === 'yellow') {
      confetti({
        particleCount: 250,
        spread: 120,
        origin: { y: 0.6 },
        colors: winner === 'red' ? ['#e11d48', '#ffffff'] : ['#f59e0b', '#ffffff']
      });
    }
  }, [winner]);

  // Sync state from remote match
  useEffect(() => {
    if (match?.moves) {
      syncWithRemoteMoves(match.moves);
    }
  }, [match, syncWithRemoteMoves]);

  // Send local moves to remote
  useEffect(() => {
    if (match && moves.length > match.moves.length) {
       sendMove(moves, winner ? 'completed' : 'in_progress');
    }
  }, [moves, match, sendMove, winner]);

  const handleDropPiece = (col: number) => {
    if (!match) return;
    if (!match.player2_id) return; // Cannot play if no opponent
    
    // Check if it's my turn
    if (isPlayer1 && currentPlayer !== 'red') return;
    if (!isPlayer1 && currentPlayer !== 'yellow') return;

    // We make local move which triggers the sendMove useEffect!
    dropPiece(col);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white p-4">
        <div className="bg-slate-900/80 backdrop-blur-3xl p-8 rounded-3xl text-center max-w-md w-full shadow-[0_24px_64px_rgba(0,0,0,0.6)] border border-rose-500/30">
           <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4 drop-shadow-md" />
           <h2 className="text-2xl font-black mb-2 text-white/90 drop-shadow-sm">Connection Error</h2>
           <p className="text-white/60 mb-6">{error}</p>
           <Link href="/" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white/90 font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98] border border-white/20">
              Return Home
           </Link>
        </div>
      </div>
    );
  }

  if (!match || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
           <Globe className="w-12 h-12 text-blue-400 mb-4 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
           <p className="text-xl font-bold text-white/80 tracking-wide">Connecting to Match...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-full flex flex-col lg:flex-row items-center lg:items-start justify-start lg:justify-center p-4 pt-12 md:pt-6 lg:pt-8 pb-8 gap-6 relative transition-colors duration-1000 w-full ${theme === 'matrix' ? 'bg-black text-green-500' : ''}`}>
      
      <div className="w-full max-w-3xl flex justify-start lg:hidden mb-2">
        <Link href="/" className="text-white/70 hover:text-white/100 text-sm font-bold bg-white/10 hover:bg-white/20 px-5 py-3 rounded-full border border-white/20 backdrop-blur-md transition-colors shadow-lg flex items-center gap-2 mt-safe">
          &larr; Leave Match
        </Link>
      </div>
      <Link href="/" className="hidden lg:flex absolute top-4 left-4 text-white/50 hover:text-white/90 text-sm font-bold z-10 bg-white/5 hover:bg-white/10 px-4 py-3 min-h-[48px] rounded-full border border-white/10 backdrop-blur-md transition-colors shadow-lg items-center gap-2">
        &larr; Leave Match
      </Link>

      <div className="flex-1 flex justify-center w-full max-w-3xl lg:pt-8 relative z-0">
        <Board board={board} onDropPiece={handleDropPiece} winner={winner} theme={theme} />
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-4 z-10">
        {!match.player2_id && (
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-dashed border-blue-400/50">
            <h3 className="text-white/90 font-bold text-lg mb-2 text-center drop-shadow-sm">Waiting for Opponent...</h3>
            <p className="text-sm text-white/60 text-center mb-4">Share this link to invite a friend.</p>
            <button 
              onClick={copyLink}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/90 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all border border-white/10 shadow-inner active:scale-[0.98]"
            >
              {copied ? <Check className="w-5 h-5 text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]" /> : <Copy className="w-5 h-5 text-white/60" />}
              {copied ? 'Copied Link!' : 'Copy Invite Link'}
            </button>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl flex flex-col border border-white/10">
          
          {/* Player 1 (Red) */}
          <div className={`p-4 rounded-2xl flex items-center gap-4 relative transition-colors ${currentPlayer === 'red' && !winner ? 'bg-rose-500/10 border border-rose-400/30 shadow-[0_0_15px_rgba(225,29,72,0.2)]' : 'border border-transparent'}`}>
            {activeTaunt?.player === 'red' && (
              <div className="absolute -left-4 -top-6 bg-white/10 backdrop-blur-xl border border-white/20 text-4xl rounded-full p-3 shadow-2xl animate-bounce z-50">
                {activeTaunt.emoji}
              </div>
            )}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-[0_0_10px_rgba(225,29,72,0.5)]">
               <User className="w-6 h-6 text-white/90 drop-shadow-md" />
            </div>
            <div className="flex-1">
              <div className="text-white/90 font-bold flex items-center justify-between drop-shadow-sm">
                <span>Player 1 {isPlayer1 && '(You)'}</span>
                {winner === 'red' && <Trophy className="w-4 h-4 text-amber-400 drop-shadow-md" />}
              </div>
            </div>
            <div className={`px-2 py-1 rounded-lg font-bold font-mono text-sm border transition-colors ${redTime <= 10 ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse' : 'bg-white/5 border-white/10 text-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.2)]'}`}>
              <Zap className="w-3 h-3 inline mr-1 text-teal-400"/>
              {formatTime(redTime)}
            </div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
          
          {/* Player 2 (Yellow) */}
          <div className={`p-4 rounded-2xl flex items-center gap-4 relative transition-colors ${currentPlayer === 'yellow' && !winner ? 'bg-amber-400/10 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border border-transparent'}`}>
            {activeTaunt?.player === 'yellow' && (
              <div className="absolute -left-4 -top-6 bg-white/10 backdrop-blur-xl border border-white/20 text-4xl rounded-full p-3 shadow-2xl animate-bounce z-50">
                {activeTaunt.emoji}
              </div>
            )}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.5)]">
               {match.player2_id ? <Globe className="w-6 h-6 text-white/90 drop-shadow-md" /> : <Clock className="w-6 h-6 text-white/90 animate-pulse drop-shadow-md" />}
            </div>
            <div className="flex-1">
              <div className="text-white/90 font-bold flex items-center justify-between drop-shadow-sm">
                <span>{match.player2_id ? `Player 2 ${!isPlayer1 ? '(You)' : ''}` : 'Waiting...'}</span>
                {winner === 'yellow' && <Trophy className="w-4 h-4 text-amber-400 drop-shadow-md" />}
              </div>
            </div>
            <div className={`px-2 py-1 rounded-lg font-bold font-mono text-sm border transition-colors ${yellowTime <= 10 ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse' : 'bg-white/5 border-white/10 text-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.2)]'}`}>
              <Zap className="w-3 h-3 inline mr-1 text-teal-400"/>
              {formatTime(yellowTime)}
            </div>
          </div>
        </div>

        {/* Emoji Taunt Interaction Area */}
        {match.player2_id && !winner && (
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl border border-white/10 flex items-center justify-between">
            <span className="text-white/50 text-xs font-bold uppercase tracking-wider ml-2">Taunts</span>
            <div className="flex gap-2">
              {EMOJIS.map(emoji => (
                <button 
                  key={emoji}
                  onClick={() => handleSendTaunt(emoji)}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/20 rounded-xl text-xl md:text-2xl transition-all hover:scale-110 active:scale-95 shadow-md min-w-[48px] min-h-[48px]"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Real-time Chat Box */}
        {match.player2_id && !winner && (
          <GameChat 
            incomingChat={incomingChat} 
            broadcastChat={broadcastChat} 
            myPlayer={isPlayer1 ? 'red' : 'yellow'} 
          />
        )}

        {winner && (
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white/90 mb-2 drop-shadow-md">
                {winner === 'draw' ? "It's a Draw!" : `${winner === 'red' ? 'Player 1' : 'Player 2'} Wins!`}
              </h2>
              <Link href="/" className="inline-block mt-4 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 font-bold rounded-2xl transition-all w-full shadow-lg active:scale-[0.98]">
                Main Menu
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
