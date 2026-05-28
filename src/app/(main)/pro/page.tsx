'use client';

import React, { useState } from 'react';
import { Crown, Check, Sparkles, Zap, BrainCircuit, Play, ArrowRight, Loader2 } from 'lucide-react';
import { usePro } from '@/context/ProContext';

export default function ProPage() {
  const { isPro: isProActive, setIsPro: setIsProActive, userId, userEmail } = usePro();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleUnlockPro = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/polar/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId ?? 'guest', email: userEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback for demo
        setIsProActive(true);
      }
    } catch {
      setIsProActive(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (isProActive) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col items-center text-center mt-12">
        <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.2)] mb-8">
          <Crown className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">You are a PRO</h1>
        <p className="text-zinc-400 max-w-lg mb-10 text-lg">
          Thank you for supporting Connect 4. All premium features, skins, and the AI Mentor are unlocked for your account.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col items-center">
            <Sparkles className="w-6 h-6 text-white mb-3" />
            <h3 className="font-bold text-white mb-1">Custom Skins</h3>
            <p className="text-xs text-zinc-500">Pixel Pets, Neon, Brick Builder</p>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col items-center">
            <BrainCircuit className="w-6 h-6 text-white mb-3" />
            <h3 className="font-bold text-white mb-1">AI Mentor</h3>
            <p className="text-xs text-zinc-500">Post-match analysis & hints</p>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col items-center">
            <Zap className="w-6 h-6 text-white mb-3" />
            <h3 className="font-bold text-white mb-1">Priority Queue</h3>
            <p className="text-xs text-zinc-500">Faster matchmaking</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      
      {/* Header */}
      <div className="mb-12 text-center mt-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl mb-6 shadow-inner">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Unlock Connect PRO
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Take your game to the next level with advanced AI analysis, premium themes, and exclusive board customisations.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
        
        {/* Features List */}
        <div className="flex-1 space-y-6 max-w-md">
          <FeatureItem 
            icon={<BrainCircuit className="w-5 h-5 text-black" />}
            title="Post-Match AI Mentor"
            desc="Get detailed analysis of your mistakes and brilliant moves after every game."
          />
          <FeatureItem 
            icon={<Sparkles className="w-5 h-5 text-black" />}
            title="Premium Themes & Skins"
            desc="Play with exclusive piece styles like Neon, Pixel Pets, and Brick Builder."
          />
          <FeatureItem 
            icon={<Zap className="w-5 h-5 text-black" />}
            title="Ad-free & Priority Matchmaking"
            desc="Skip the queue and enjoy a completely distraction-free experience."
          />
        </div>

        {/* Pricing Card */}
        <div className="w-full max-w-sm bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.05] blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex-1">
            <div className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
              Lifetime Access
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-white">$4.99</span>
            </div>
            <p className="text-zinc-500 text-sm mb-8">One-time payment. Yours forever.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <Check className="w-4 h-4 text-white shrink-0" /> Support indie development
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <Check className="w-4 h-4 text-white shrink-0" /> Unlock all current & future skins
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <Check className="w-4 h-4 text-white shrink-0" /> Stand out on the leaderboard
              </li>
            </ul>
          </div>

          <button 
            onClick={handleUnlockPro}
            disabled={checkoutLoading}
            className="w-full py-4 bg-white text-black hover:bg-zinc-200 font-black rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 relative z-10"
          >
            {checkoutLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Unlock PRO Now <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
