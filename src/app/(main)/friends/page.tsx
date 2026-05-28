'use client';

import React, { useState } from 'react';
import { Users, Search, Check, UserPlus, Clock } from 'lucide-react';
import Link from 'next/link';

export default function FriendsPage() {
  const [friendTag, setFriendTag] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendTag.trim()) return;
    setToastMessage(`Friend request sent to ${friendTag}`);
    setFriendTag('');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Users className="w-8 h-8" />
          Friends
        </h1>
        <p className="text-zinc-500 mt-2">Manage your friends list, add new players, and see who is online.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Friends List */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Online Now</h2>
            <div className="flex flex-col gap-2">
              <Link href="/profile/Bakhitbek" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-zinc-800 relative shrink-0">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bakhitbek" alt="Bakhitbek" className="w-full h-full rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-white rounded-full border-2 border-[#0a0a0a]"></div>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-base text-white font-bold">Bakhitbek</span>
                  <span className="text-sm text-zinc-400">In a Match (Blitz Mode)</span>
                </div>
                <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-colors">
                  Spectate
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Offline</h2>
            <div className="flex flex-col gap-2">
              <Link href="/profile/Aybatyr" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer group opacity-60 hover:opacity-100">
                <div className="w-12 h-12 rounded-full bg-zinc-800 relative shrink-0">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aybatyr" alt="Aybatyr" className="w-full h-full rounded-full opacity-50 grayscale" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-base text-white font-bold">Aybatyr</span>
                  <span className="text-sm text-zinc-500">Last seen 2h ago</span>
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column: Add Friend & Requests */}
        <div className="space-y-6">
          
          {/* Add Friend Box */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative">
            {toastMessage && (
              <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 bg-white text-black text-sm font-bold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20 whitespace-nowrap animate-in fade-in slide-in-from-bottom-4">
                <Check className="w-4 h-4" /> {toastMessage}
              </div>
            )}
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Add Friend
            </h2>
            <form onSubmit={handleAddFriend} className="flex flex-col gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={friendTag}
                  onChange={(e) => setFriendTag(e.target.value)}
                  placeholder="Player Tag (e.g. John#123)"
                  className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white focus:bg-white/5 transition-colors"
                />
              </div>
              <button 
                type="submit"
                disabled={!friendTag.trim()}
                className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white font-bold py-3 rounded-xl text-sm transition-colors active:scale-95"
              >
                Send Request
              </button>
            </form>
          </div>

          {/* Pending Requests */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Pending Requests
            </h2>
            <div className="text-center py-6 text-zinc-500 text-sm">
              No pending requests.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
