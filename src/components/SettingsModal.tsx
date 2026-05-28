'use client';

import React, { useState } from 'react';
import { Settings, X, Image as ImageIcon, Sparkles, Lock, Check, Loader2 } from 'lucide-react';
import { usePro, AppTheme, PieceStyle } from '@/context/ProContext';

export function SettingsModal() {
  const {
    isSettingsOpen, setIsSettingsOpen,
    appTheme, setAppTheme,
    pieceStyle, setPieceStyle,
    isPro: isProActive,
    userEmail,
  } = usePro();

  if (!isSettingsOpen) return null;

  const themes: { id: AppTheme; label: string; bg: string }[] = [
    { id: 'deep_slate', label: 'Deep Slate', bg: 'bg-gradient-to-br from-slate-900 to-slate-800' },
    { id: 'midnight', label: 'Midnight', bg: 'bg-black' },
    { id: 'cyberpunk', label: 'Cyberpunk', bg: 'bg-gradient-to-br from-[#12002b] to-[#35014c]' },
    { id: 'minimalist', label: 'Minimalist', bg: 'bg-zinc-100' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={() => setIsSettingsOpen(false)}
    >
      <div
        className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-md shadow-[0_24px_64px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
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

        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-8">

          {/* ── Background Theme ── */}
          <section>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Background Theme
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setAppTheme(t.id)}
                  className={`relative p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    appTheme === t.id
                      ? 'border-white bg-white/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-full h-12 rounded-lg border border-white/10 ${t.bg}`} />
                  <span className={`text-xs font-bold ${appTheme === t.id ? 'text-white' : 'text-zinc-400'}`}>
                    {t.label}
                  </span>
                  {appTheme === t.id && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ── Piece Style ── */}
          <section>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Piece Style
            </h3>
            <div className="flex flex-col gap-3">

              {/* Classic — free */}
              <button
                type="button"
                onClick={() => setPieceStyle('classic')}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  pieceStyle === 'classic' ? 'border-white bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
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
              <ProStyleButton
                label="Neon Rings"
                desc="Cyberpunk aesthetic"
                isActive={pieceStyle === 'neon'}
                isPro={isProActive}
                email={userEmail}
                onSelect={() => setPieceStyle('neon')}
                preview={<div className="w-8 h-8 rounded-full border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] bg-transparent shrink-0" />}
              />

              {/* Pixel Pets — PRO */}
              <ProStyleButton
                label="Pixel Pets"
                desc="Cute emoji avatars"
                isActive={pieceStyle === 'pixel_pets'}
                isPro={isProActive}
                email={userEmail}
                onSelect={() => setPieceStyle('pixel_pets')}
                preview={<div className="text-3xl shrink-0 leading-none">🐶</div>}
              />

              {/* Brick Builder — PRO */}
              <ProStyleButton
                label="Brick Builder"
                desc="Lego style plastic bricks"
                isActive={pieceStyle === 'brick_builder'}
                isPro={isProActive}
                email={userEmail}
                onSelect={() => setPieceStyle('brick_builder')}
                preview={
                  <div className="w-8 h-8 rounded-sm bg-red-600 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                  </div>
                }
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── PRO piece button ─────────────────────────────────────────────────────────
interface ProStyleButtonProps {
  label: string;
  desc: string;
  isActive: boolean;
  isPro: boolean;
  email: string | null;
  onSelect: () => void;
  preview: React.ReactNode;
}

function ProStyleButton({ label, desc, isActive, isPro, email, onSelect, preview }: ProStyleButtonProps) {
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const handleClick = async () => {
    if (isPro) {
      onSelect();
      return;
    }
    // Redirect to Polar checkout
    setUpgradeLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || '' }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        alert('Could not create checkout: ' + (json.error || 'unknown error'));
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Checkout error: ' + err.message);
    } finally {
      setUpgradeLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={upgradeLoading}
      className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer disabled:opacity-60 ${
        isActive ? 'border-white bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
      }`}
    >
      {preview}
      <div className="flex flex-col text-left flex-1">
        <span className="text-sm font-bold text-white">{label}</span>
        <span className="text-xs text-zinc-500">{desc}</span>
      </div>
      {isActive && <Check className="w-4 h-4 text-white shrink-0" />}
      {!isPro && !isActive && (
        upgradeLoading
          ? <Loader2 className="w-4 h-4 text-white/60 animate-spin shrink-0" />
          : <div className="flex items-center gap-1 bg-white/10 border border-white/20 px-2 py-0.5 rounded-md shrink-0">
              <Lock className="w-3 h-3 text-white/70" />
              <span className="text-xs font-bold text-white/70">PRO</span>
            </div>
      )}
    </button>
  );
}
