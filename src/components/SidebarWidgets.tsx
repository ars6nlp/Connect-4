'use client';

import React, { useState } from 'react';
import { Crown, Users, ChevronRight, Settings, X, Image as ImageIcon, Sparkles, Lock, Check } from 'lucide-react';
import { usePro, AppTheme, PieceStyle } from '@/context/ProContext';
import Link from 'next/link';

export function SidebarWidgets({ isMobile = false }: { isMobile?: boolean }) {
  const {
    isPro: isProActive,
    appTheme, setAppTheme,
    pieceStyle, setPieceStyle,
    isSettingsOpen, setIsSettingsOpen,
  } = usePro();

  return (
    <>
      <div className={`${isMobile ? 'flex md:hidden mt-8' : 'hidden md:flex mt-auto'} flex-col gap-6 px-4`}>

        {/* Friends Online Section */}
        <div>
          <Link
            href="/friends"
            className="flex items-center gap-1 text-xs text-zinc-500 font-bold tracking-wider uppercase mb-3 hover:text-white transition-colors group w-full text-left"
          >
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
            FRIENDS
            <ChevronRight className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>

          <div className="flex flex-col gap-1">
            <Link href="/profile/Bakhitbek" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-zinc-800 relative shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bakhitbek" alt="Bakhitbek" className="w-full h-full rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full border-2 border-[#0d0d0d]"></div>
              </div>
              <span className="text-sm text-zinc-300 font-medium truncate group-hover:text-white transition-colors">Bakhitbek</span>
            </Link>
          </div>
        </div>

        {/* PRO Card */}
        <Link href="/pro" className="group block bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-xl p-4 transition-all">
          <div className="flex items-center gap-2 mb-1">
            <Crown className={`w-4 h-4 ${isProActive ? 'text-white' : 'text-zinc-400 group-hover:text-white transition-colors'}`} />
            <h4 className={`text-sm font-bold ${isProActive ? 'text-white' : 'text-zinc-300 group-hover:text-white transition-colors'}`}>
              {isProActive ? 'PRO Active' : 'Connect PRO'}
            </h4>
          </div>
          {!isProActive && (
            <>
              <p className="text-xs text-zinc-500 mb-3 leading-relaxed">Unlock premium features & mentor</p>
              <div className="w-full py-1.5 rounded-lg bg-white text-black text-xs font-bold text-center transition-all shadow-sm group-active:scale-[0.98]">
                View Details
              </div>
            </>
          )}
          {isProActive && (
            <p className="text-xs text-zinc-500 leading-relaxed mt-2">All premium features unlocked!</p>
          )}
        </Link>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-zinc-500 hover:text-white"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-bold">Settings</span>
        </button>
      </div>

      {/* ──────────── SETTINGS MODAL ──────────── */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-md shadow-[0_24px_64px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col max-h-[85vh]">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-white/80" />
                <h2 className="text-lg font-bold text-white">Settings</h2>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">

              {/* Theme Selection */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Background Theme
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {(['deep_slate', 'midnight', 'cyberpunk', 'minimalist'] as AppTheme[]).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setAppTheme(theme)}
                      className={`relative p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        appTheme === theme
                          ? 'border-white bg-white/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-lg border border-white/10 mb-2 ${
                        theme === 'deep_slate' ? 'bg-gradient-to-br from-slate-900 to-slate-800' :
                        theme === 'midnight' ? 'bg-black' :
                        theme === 'cyberpunk' ? 'bg-gradient-to-br from-[#12002b] to-[#35014c]' :
                        'bg-zinc-100'
                      }`} />
                      <span className={`text-xs font-bold capitalize ${appTheme === theme ? 'text-white' : 'text-zinc-400'}`}>
                        {theme.replace('_', ' ')}
                      </span>
                      {appTheme === theme && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Piece Style */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Piece Style
                </h3>
                <div className="grid grid-cols-1 gap-3">

                  {/* Classic */}
                  <button
                    onClick={() => setPieceStyle('classic')}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      pieceStyle === 'classic'
                        ? 'border-white bg-white/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-inner border border-rose-400/60 shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-white">Classic Glass</span>
                      <span className="text-xs text-zinc-500">Standard 3D spheres</span>
                    </div>
                    {pieceStyle === 'classic' && <Check className="w-4 h-4 text-white ml-auto" />}
                  </button>

                  {/* Neon — PRO */}
                  <ProPieceButton
                    isActive={pieceStyle === 'neon'}
                    isPro={isProActive}
                    onClick={() => setPieceStyle('neon')}
                    preview={<div className="w-8 h-8 rounded-full border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] bg-transparent shrink-0" />}
                    title="Neon Rings"
                    desc="Cyberpunk aesthetic"
                  />

                  {/* Pixel Pets — PRO */}
                  <ProPieceButton
                    isActive={pieceStyle === 'pixel_pets'}
                    isPro={isProActive}
                    onClick={() => setPieceStyle('pixel_pets')}
                    preview={<div className="text-3xl shrink-0 leading-none">🐶</div>}
                    title="Pixel Pets"
                    desc="Cute emoji avatars"
                  />

                  {/* Brick Builder — PRO */}
                  <ProPieceButton
                    isActive={pieceStyle === 'brick_builder'}
                    isPro={isProActive}
                    onClick={() => setPieceStyle('brick_builder')}
                    preview={
                      <div className="w-8 h-8 rounded-sm bg-red-600 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center shrink-0">
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                      </div>
                    }
                    title="Brick Builder"
                    desc="Lego style plastic bricks"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProPieceButton({
  isActive, isPro, onClick, preview, title, desc
}: {
  isActive: boolean;
  isPro: boolean;
  onClick: () => void;
  preview: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={isPro ? onClick : undefined}
      className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
        isActive
          ? 'border-white bg-white/10'
          : 'border-white/10 bg-white/5 hover:bg-white/10'
      }`}
    >
      {!isPro && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] rounded-xl flex items-center justify-end px-4 z-10 cursor-pointer">
          <Link
            href="/pro"
            className="text-xs font-bold text-white flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <Lock className="w-3 h-3" /> PRO
          </Link>
        </div>
      )}
      {preview}
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold text-white">{title}</span>
        <span className="text-xs text-zinc-500">{desc}</span>
      </div>
      {isActive && <Check className="w-4 h-4 text-white ml-auto" />}
    </button>
  );
}
