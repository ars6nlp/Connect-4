'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, AlertCircle, ArrowRight, LogOut, Trophy, Hash, History, Swords } from 'lucide-react';

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

export default function ProfilePage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchRecord[]>([]);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const router = useRouter();

  // Check auth state on mount
  useEffect(() => {
    async function loadSession() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setSessionUser(session.user);
        
        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileData) {
          setProfile(profileData);
          
          // Fetch Match History
          const { data: matches } = await supabase
            .from('matches')
            .select('*')
            .or(`player1_id.eq.${session.user.id},player2_id.eq.${session.user.id}`)
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(10);
            
          if (matches) {
            // Fetch opponent usernames
            const historyWithOpponents = await Promise.all(matches.map(async (m) => {
              const isP1 = m.player1_id === session.user.id;
              const oppId = isP1 ? m.player2_id : m.player1_id;
              
              if (!oppId) return m;
              
              const { data: oppProfile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', oppId)
                .single();
                
              return {
                ...m,
                opponent_username: oppProfile?.username || 'Guest'
              };
            }));
            
            setMatchHistory(historyWithOpponents);
          }
        }
      }
      setInitialLoad(false);
    }
    
    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        loadSession();
      } else if (event === 'SIGNED_OUT') {
        setSessionUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
        });
        if (error) throw error;
        
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            username: username || email.split('@')[0],
            elo_rating: 1200
          });
          if (profileError) {
             console.error('Error creating profile', profileError);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (initialLoad) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="animate-pulse w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // --- PROFILE DASHBOARD ---
  if (sessionUser && profile) {
    const playerTag = `#${profile.id.substring(0, 4).toUpperCase()}`;
    const wins = matchHistory.filter(m => m.winner_id === profile.id).length;
    
    return (
      <div className="min-h-full flex items-center justify-center p-4 py-8 relative transition-colors duration-1000 w-full">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.6)] relative z-10 flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)] border border-emerald-300/30">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white/90 drop-shadow-md flex items-center gap-2">
                  {profile.username}
                </h1>
                <p className="text-emerald-400/80 font-mono text-sm flex items-center gap-1 mt-1">
                  <Hash className="w-4 h-4" /> {playerTag}
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-[0.98] text-sm font-bold"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
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

  // --- LOGIN / SIGN UP FORM ---
  return (
    <div className="min-h-full flex items-center justify-center p-4 py-8 relative transition-colors duration-1000 w-full">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.6)] relative z-10">
        
        <h1 className="text-3xl font-black text-white/90 mb-2 drop-shadow-md text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-white/50 text-center mb-8 text-sm">
          {isLogin ? 'Sign in to access your stats and rank.' : 'Join the Connect Four community!'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                type="text" 
                placeholder="Username" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white/90 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all placeholder:text-white/30"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white/90 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all placeholder:text-white/30"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white/90 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all placeholder:text-white/30"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-600 border border-emerald-400/50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-white/50 hover:text-white/90 text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
