'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User as UserIcon, Trophy, Hash, History, Swords, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  username: string;
  elo_rating: number;
}

interface MatchRecord {
  id: string;
  created_at: string;
  player1_id: string;
  player2_id: string;
  winner_id: string | null;
  status: string;
  opponent_username?: string;
}

export default function FriendProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const decodedId = decodeURIComponent(id);
      
      // Mock data for hardcoded friends from Sidebar
      if (decodedId === 'Bakhitbek' || decodedId === 'Aybatyr') {
        setProfile({
          id: decodedId === 'Bakhitbek' ? 'bakh-1234' : 'ayba-5678',
          username: decodedId,
          elo_rating: decodedId === 'Bakhitbek' ? 1450 : 1200,
        });
        
        // Mock match history
        setMatchHistory([
          { id: '1', created_at: new Date().toISOString(), player1_id: 'bakh-1234', player2_id: 'some', winner_id: 'bakh-1234', status: 'completed', opponent_username: 'Guest' },
          { id: '2', created_at: new Date(Date.now() - 86400000).toISOString(), player1_id: 'bakh-1234', player2_id: 'some', winner_id: 'some', status: 'completed', opponent_username: 'Player1' },
        ]);
        setLoading(false);
        return;
      }

      // Real Supabase Fetch for UUIDs
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', decodedId)
          .single();
          
        if (profileData) {
          setProfile(profileData);
          
          const { data: matches } = await supabase
            .from('matches')
            .select('*')
            .or(`player1_id.eq.${decodedId},player2_id.eq.${decodedId}`)
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(10);
            
          if (matches) {
            const historyWithOpponents = await Promise.all(matches.map(async (m) => {
              const isP1 = m.player1_id === decodedId;
              const oppId = isP1 ? m.player2_id : m.player1_id;
              
              if (!oppId) return m;
              const { data: oppProfile } = await supabase.from('profiles').select('username').eq('id', oppId).single();
              return { ...m, opponent_username: oppProfile?.username || 'Guest' };
            }));
            setMatchHistory(historyWithOpponents);
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
      setLoading(false);
    }
    
    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="animate-pulse w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-4 gap-4 text-white">
        <div className="text-2xl font-bold">Profile not found</div>
        <Link href="/" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">Return Home</Link>
      </div>
    );
  }

  const playerTag = `#${profile.id.substring(0, 4).toUpperCase()}`;
  const wins = matchHistory.filter(m => m.winner_id === profile.id).length;
  const isOnline = profile.username === 'Bakhitbek';

  return (
    <div className="min-h-full flex items-center justify-center p-4 py-8 relative transition-colors duration-1000 w-full overflow-y-auto">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.6)] relative z-10 flex flex-col gap-8">
        
        <Link href="/" className="self-start px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/50 hover:text-white/90 text-sm font-bold transition-colors flex items-center gap-2 border border-white/10">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/10 relative">
              {['Bakhitbek', 'Aybatyr'].includes(profile.username) ? (
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt={profile.username} className={`w-full h-full rounded-2xl ${!isOnline && 'grayscale opacity-60'}`} />
              ) : (
                <UserIcon className="w-10 h-10 text-white/50" />
              )}
              {isOnline && <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-[#1a1f2e]"></div>}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-white/90 drop-shadow-md">
                  {profile.username}
                </h1>
                {isOnline ? (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-md border border-green-500/30">ONLINE</span>
                ) : (
                  <span className="px-2 py-0.5 bg-slate-500/20 text-slate-400 text-xs font-bold rounded-md border border-slate-500/30">OFFLINE</span>
                )}
              </div>
              <p className="text-emerald-400/80 font-mono text-sm flex items-center gap-1 mt-1">
                <Hash className="w-4 h-4" /> {playerTag}
              </p>
              <div className="text-sm text-yellow-400/90 font-medium mt-1">
                🏆 Rank: #{Math.floor(Math.random() * 10) + 1} Local
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-400 mb-2 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
            <div className="text-2xl font-black text-white/90">{profile.elo_rating}</div>
            <div className="text-xs text-white/50 uppercase tracking-widest font-bold">Rating</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
            <Swords className="w-6 h-6 text-blue-400 mb-2" />
            <div className="text-2xl font-black text-white/90">{matchHistory.length}</div>
            <div className="text-xs text-white/50 uppercase tracking-widest font-bold">Matches</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
            <div className="text-emerald-400 mb-2 font-black text-2xl">W</div>
            <div className="text-2xl font-black text-white/90">{wins}</div>
            <div className="text-xs text-white/50 uppercase tracking-widest font-bold">Wins</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
            <div className="text-rose-400 mb-2 font-black text-2xl">L</div>
            <div className="text-2xl font-black text-white/90">{matchHistory.length - wins}</div>
            <div className="text-xs text-white/50 uppercase tracking-widest font-bold">Losses</div>
          </div>
        </div>

        {/* Match History */}
        <div>
          <h2 className="text-xl font-bold text-white/90 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-white/50" /> Recent Matches
          </h2>
          <div className="space-y-3">
            {matchHistory.length === 0 ? (
              <div className="text-white/30 text-sm italic py-4">No recent matches played.</div>
            ) : (
              matchHistory.map(match => {
                const isWin = match.winner_id === profile.id;
                const isDraw = match.winner_id === 'draw';
                const resultText = isDraw ? 'DRAW' : isWin ? 'VICTORY' : 'DEFEAT';
                const resultColor = isDraw ? 'text-gray-400' : isWin ? 'text-emerald-400' : 'text-rose-400';
                const bgColor = isDraw ? 'bg-gray-500/10 border-gray-500/20' : isWin ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20';
                
                return (
                  <div key={match.id} className={`flex items-center justify-between p-4 rounded-2xl border ${bgColor} transition-colors`}>
                    <div>
                      <div className={`font-black text-sm tracking-wider ${resultColor}`}>{resultText}</div>
                      <div className="text-white/60 text-xs mt-1">vs {match.opponent_username}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/40 text-xs">{new Date(match.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
