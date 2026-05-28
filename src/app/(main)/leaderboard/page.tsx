import React from 'react';
import { Trophy, Medal, Star, Globe } from 'lucide-react';

export default function LeaderboardPage() {
  const leaderboards = [
    { rank: 1, name: 'S1mple', elo: 2450, wins: 342, isPro: true, flag: 'kz' },
    { rank: 2, name: 'Magnus', elo: 2310, wins: 289, isPro: true, flag: 'no' },
    { rank: 3, name: 'ConnectMaster', elo: 2190, wins: 210, isPro: false, flag: 'us' },
    { rank: 4, name: 'GuestUser99', elo: 1980, wins: 156, isPro: false, flag: 'gb' },
    { rank: 5, name: 'AlphaZero', elo: 1850, wins: 120, isPro: true, flag: 'kz' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 backdrop-blur-md text-blue-300 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
            <Globe className="w-6 h-6 drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white drop-shadow-md">Global Leaderboard</h1>
            <p className="text-white/70 font-medium">Top ranked players worldwide</p>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl flex overflow-hidden border border-white/10 shadow-lg p-1">
          <button className="px-4 py-2 bg-white/20 text-white rounded-xl text-sm font-bold shadow-sm">Global</button>
          <button className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl text-sm font-bold transition-colors">Almaty</button>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs font-bold text-white/50 uppercase tracking-wider bg-black/10">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-5">Player</div>
          <div className="col-span-3 text-right">Rating</div>
          <div className="col-span-2 text-right">Wins</div>
        </div>
        
        <div className="divide-y divide-white/10">
          {leaderboards.map((player) => (
            <div key={player.rank} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
              <div className="col-span-2 flex justify-center">
                {player.rank === 1 ? <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" /> : 
                 player.rank === 2 ? <Medal className="w-6 h-6 text-slate-300 drop-shadow-md" /> :
                 player.rank === 3 ? <Medal className="w-6 h-6 text-amber-600 drop-shadow-md" /> :
                 <span className="text-white/50 font-bold">#{player.rank}</span>}
              </div>
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white/80 shadow-inner">
                  {player.name[0]}
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2 drop-shadow-sm">
                    {player.name}
                    {player.isPro && <Star className="w-3 h-3 text-yellow-400 fill-current drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />}
                  </div>
                </div>
              </div>
              <div className="col-span-3 text-right font-black text-white text-lg drop-shadow-sm">
                {player.elo}
              </div>
              <div className="col-span-2 text-right font-medium text-white/70">
                {player.wins}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
