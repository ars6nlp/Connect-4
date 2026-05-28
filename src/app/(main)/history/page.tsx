'use client';
import React, { useState } from 'react';
import { History as HistoryIcon, Trophy, User, Bot, Clock } from 'lucide-react';
import { MatchHistoryEntry } from '../useConnectFour';

export default function HistoryPage() {
  const [history] = useState<MatchHistoryEntry[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem('connectFourHistory');
        return data ? JSON.parse(data) : [];
      }
    } catch {}
    return [];
  });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-white/5 backdrop-blur-md text-blue-300 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
          <HistoryIcon className="w-6 h-6 drop-shadow-sm" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white drop-shadow-md">Match History</h1>
          <p className="text-white/70 font-medium">Your recent games saved locally</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs font-bold text-white/50 uppercase tracking-wider bg-black/10">
          <div className="col-span-4">Mode / Date</div>
          <div className="col-span-4 text-center">Result</div>
          <div className="col-span-4 text-right">Moves</div>
        </div>
        
        <div className="divide-y divide-white/10">
          {history.length === 0 ? (
            <div className="p-8 text-center text-white/60 font-medium">No games played yet.</div>
          ) : history.map((match) => (
            <div key={match.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white/80 shadow-inner">
                  {match.mode === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-white capitalize drop-shadow-sm">
                    {match.mode === 'ai' ? `Vs Computer (${match.difficulty})` : 'Pass & Play'}
                  </div>
                  <div className="text-xs text-white/60 flex items-center gap-1 font-medium mt-0.5">
                    <Clock className="w-3 h-3" /> {new Date(match.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="col-span-4 flex justify-center">
                <div className={`px-3 py-1.5 rounded-xl font-bold text-sm flex items-center gap-2 border ${
                  match.winner === 'red' ? 'bg-pink-500/20 text-pink-300 border-pink-500/30 shadow-[0_0_10px_rgba(244,114,182,0.2)]' :
                  match.winner === 'yellow' ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30 shadow-[0_0_10px_rgba(250,204,21,0.2)]' :
                  'bg-white/5 text-white/70 border-white/10'
                }`}>
                  {match.winner === 'draw' ? 'Draw' : 
                   match.winner === 'red' ? <><Trophy className="w-4 h-4 drop-shadow-md"/> Red Won</> : 
                   <><Trophy className="w-4 h-4 drop-shadow-md"/> Yellow Won</>}
                </div>
              </div>
              <div className="col-span-4 text-right font-bold text-white/80">
                {match.moves} moves
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
