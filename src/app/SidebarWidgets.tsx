'use client';

import React, { useState } from 'react';
import { Crown, Users, X, ChevronRight, Check, Settings, Image as ImageIcon, Sparkles, Lock } from 'lucide-react';
import { usePro, AppTheme, PieceStyle } from '@/context/ProContext';
import Link from 'next/link';

export function SidebarWidgets({ isMobile = false }: { isMobile?: boolean }) {
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const { isPro: isProActive, setIsPro: setIsProActive, appTheme, setAppTheme, pieceStyle, setPieceStyle, isSettingsOpen, setIsSettingsOpen } = usePro();
  const [friendTag, setFriendTag] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddFriend = () => {
    if (!friendTag.trim()) return;
    setToastMessage('Friend request sent!');
    setFriendTag('');
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUnlockPro = () => {
    setIsProActive(true);
    setIsProModalOpen(false);
  };

  return (
    <>
      <div className={`${isMobile ? 'flex md:hidden mt-8' : 'hidden md:flex mt-auto'} flex-col gap-6 px-4`}>
        
        {/* Friends Online Section */}
        <div>
          <button 
            onClick={() => setIsFriendsModalOpen(true)}
            className="flex items-center gap-1 text-xs text-slate-400 font-semibold tracking-wider uppercase mb-3 hover:text-white transition-colors group cursor-pointer w-full text-left"
          >
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
            FRIENDS
            <ChevronRight className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
          
          <div className="flex flex-col gap-1">
            {/* Friend 1 (Online) */}
            <Link href="/profile/Bakhitbek" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-slate-700 relative shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bakhitbek" alt="Bakhitbek" className="w-full h-full rounded-full opacity-80" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1f2e]"></div>
              </div>
              <span className="text-sm text-slate-200 font-medium truncate">Bakhitbek</span>
            </Link>
          </div>
        </div>

        {/* Premium / Pro Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/20 blur-2xl rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Crown className={`w-4 h-4 ${isProActive ? 'text-teal-400' : 'text-yellow-400'}`} />
              <h4 className={`text-sm font-bold ${isProActive ? 'text-teal-400' : 'text-white'}`}>
                {isProActive ? 'PRO Active' : 'Connect PRO'}
              </h4>
            </div>
            {!isProActive && (
              <>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">Unlock custom Pixel Art pieces & emojis</p>
                <button 
                  onClick={() => setIsProModalOpen(true)}
                  className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all shadow-sm active:scale-[0.98]"
                >
                  Upgrade
                </button>
              </>
            )}
            {isProActive && (
              <p className="text-xs text-slate-400 leading-relaxed mt-2">All premium features unlocked!</p>
            )}
          </div>
        </div>

        {/* Settings Button */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-slate-400 hover:text-white"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>

      {/* --- ALL FRIENDS MODAL --- */}
      {isFriendsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl w-full max-w-md shadow-[0_24px_64px_rgba(0,0,0,0.6)] relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-white/80" />
                <h2 className="text-lg font-bold text-white/90">All Friends</h2>
              </div>
              <button onClick={() => setIsFriendsModalOpen(false)} className="text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add Friend Section */}
            <div className="p-4 border-b border-white/10 relative">
              {toastMessage && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 animate-bounce z-20">
                  <Check className="w-3 h-3" /> {toastMessage}
                </div>
              )}
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Add Friend</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={friendTag}
                  onChange={(e) => setFriendTag(e.target.value)}
                  placeholder="Enter Friend Tag (e.g., Player#4921)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button 
                  onClick={handleAddFriend}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors active:scale-95"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Friends List */}
            <div className="p-4 flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
              {/* Online */}
              <Link href="/profile/Bakhitbek" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-700 relative shrink-0">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bakhitbek" alt="Bakhitbek" className="w-full h-full rounded-full opacity-80" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1f2e]"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-200 font-bold">Bakhitbek</span>
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </Link>

              {/* Offline */}
              <Link href="/profile/Aybatyr" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer opacity-70">
                <div className="w-10 h-10 rounded-full bg-slate-700 relative shrink-0">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aybatyr" alt="Aybatyr" className="w-full h-full rounded-full opacity-60 grayscale" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-slate-500 rounded-full border-2 border-[#1a1f2e]"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-200 font-bold">Aybatyr</span>
                  <span className="text-xs text-slate-500">Offline</span>
                </div>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* --- CONNECT PRO MODAL --- */}
      {isProModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] border border-yellow-500/30 rounded-3xl w-full max-w-sm shadow-[0_32px_128px_rgba(234,179,8,0.2)] relative overflow-hidden text-center">
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow-500/20 blur-[64px] rounded-full pointer-events-none"></div>

            <button onClick={() => setIsProModalOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors z-20">
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl mb-6">
                <Crown className="w-10 h-10 text-white -rotate-12 drop-shadow-md" />
              </div>

              <h2 className="text-2xl font-black text-white mb-2 drop-shadow-md">Unlock Connect PRO</h2>
              <p className="text-sm text-slate-400 mb-8">Take your game to the next level with exclusive features.</p>

              <div className="w-full flex flex-col gap-4 text-left mb-8">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-xl">✨</div>
                  <div className="text-sm text-white/90 font-medium">Exclusive 2D Pixel Art skins (Pug, Rabbit, Cat)</div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-xl">🚀</div>
                  <div className="text-sm text-white/90 font-medium">No-Limits in Blitz Mode</div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-xl">😎</div>
                  <div className="text-sm text-white/90 font-medium">Custom animated taunts</div>
                </div>
              </div>

              <button 
                onClick={handleUnlockPro}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-[#1a1f2e] font-black rounded-2xl text-lg transition-all shadow-[0_0_32px_rgba(251,191,36,0.4)] hover:shadow-[0_0_48px_rgba(251,191,36,0.6)] active:scale-95"
              >
                Unlock for $4.99
              </button>
            </div>
            
          </div>
        </div>
      )}
      {/* --- SETTINGS MODAL --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl w-full max-w-md shadow-[0_24px_64px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col max-h-[80vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-white/80" />
                <h2 className="text-lg font-bold text-white/90">Settings</h2>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">
              
              {/* Theme Selection */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Choose Theme / Background
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {(['deep_slate', 'midnight', 'cyberpunk', 'minimalist'] as AppTheme[]).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setAppTheme(theme)}
                      className={`relative p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        appTheme === theme 
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-lg border border-white/10 mb-2 ${
                        theme === 'deep_slate' ? 'bg-gradient-to-br from-slate-900 to-slate-800' :
                        theme === 'midnight' ? 'bg-black' :
                        theme === 'cyberpunk' ? 'bg-gradient-to-br from-[#12002b] to-[#35014c]' :
                        'bg-slate-100'
                      }`} />
                      <span className={`text-xs font-bold capitalize ${appTheme === theme ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {theme.replace('_', ' ')}
                      </span>
                      {appTheme === theme && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-[#1a1f2e]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Piece Style Selection */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Piece Style
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  
                  {/* Classic */}
                  <button
                    onClick={() => setPieceStyle('classic')}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      pieceStyle === 'classic' 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-inner border border-rose-400/60 flex-shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-white/90">Classic Glass</span>
                      <span className="text-xs text-slate-400">Standard 3D spheres</span>
                    </div>
                  </button>

                  {/* Neon (Requires PRO) */}
                  <button
                    onClick={() => isProActive ? setPieceStyle('neon') : setIsProModalOpen(true)}
                    className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      pieceStyle === 'neon' 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {!isProActive && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-xl flex items-center justify-end px-4 z-10 cursor-pointer">
                        <span className="text-xs font-bold text-yellow-400 flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-md border border-yellow-500/30">
                          <Lock className="w-3 h-3" /> PRO
                        </span>
                      </div>
                    )}
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] bg-transparent flex-shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-white/90">Neon Rings</span>
                      <span className="text-xs text-slate-400">Cyberpunk aesthetic</span>
                    </div>
                  </button>

                  {/* Pixel Pets (Requires PRO) */}
                  <button
                    onClick={() => isProActive ? setPieceStyle('pixel_pets') : setIsProModalOpen(true)}
                    className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      pieceStyle === 'pixel_pets' 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {!isProActive && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-xl flex items-center justify-end px-4 z-10 cursor-pointer">
                        <span className="text-xs font-bold text-yellow-400 flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-md border border-yellow-500/30">
                          <Lock className="w-3 h-3" /> PRO
                        </span>
                      </div>
                    )}
                    <div className="text-3xl flex-shrink-0 leading-none">🐶</div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-white/90">Pixel Pets</span>
                      <span className="text-xs text-slate-400">Cute emoji avatars</span>
                    </div>
                  </button>

                  {/* Brick Builder (Requires PRO) */}
                  <button
                    onClick={() => isProActive ? setPieceStyle('brick_builder') : setIsProModalOpen(true)}
                    className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      pieceStyle === 'brick_builder' 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {!isProActive && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-xl flex items-center justify-end px-4 z-10 cursor-pointer">
                        <span className="text-xs font-bold text-yellow-400 flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-md border border-yellow-500/30">
                          <Lock className="w-3 h-3" /> PRO
                        </span>
                      </div>
                    )}
                    <div className="w-8 h-8 rounded-sm bg-red-600 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center flex-shrink-0 relative">
                      <div className="w-4 h-4 rounded-full bg-red-600 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.3),inset_1px_1px_2px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.5)]"></div>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-white/90">Brick Builder</span>
                      <span className="text-xs text-slate-400">Lego style plastic bricks</span>
                    </div>
                  </button>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
