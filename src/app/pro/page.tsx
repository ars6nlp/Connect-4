import React from 'react';
import { Star, Check, Shield } from 'lucide-react';

export default function ProPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto flex flex-col items-center w-full">
      
      <div className="text-center mb-12 mt-8">
        <div className="inline-flex items-center justify-center p-4 bg-white/5 backdrop-blur-md text-yellow-300 rounded-2xl mb-6 border border-yellow-400/30 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
          <Star className="w-8 h-8 fill-current drop-shadow-md" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-md">Level up with Premium</h1>
        <p className="text-xl text-white/70 max-w-xl mx-auto font-medium">
          Unlock unlimited Game Review, Custom Tokens, and ad-free experience.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        
        {/* Basic Tier */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl flex flex-col shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">Basic</h3>
          <div className="text-4xl font-black text-white mb-6 drop-shadow-md">Free</div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-white/70 font-medium">
              <Check className="w-5 h-5 text-green-400 drop-shadow-sm" /> Play vs Computer
            </li>
            <li className="flex items-center gap-3 text-white/70 font-medium">
              <Check className="w-5 h-5 text-green-400 drop-shadow-sm" /> Pass & Play
            </li>
            <li className="flex items-center gap-3 text-white/70 font-medium">
              <Check className="w-5 h-5 text-green-400 drop-shadow-sm" /> Basic Themes
            </li>
          </ul>
          <button className="w-full py-4 rounded-2xl font-bold bg-white/5 border border-white/10 text-white/50 cursor-not-allowed">
            Current Plan
          </button>
        </div>

        {/* Pro Tier */}
        <div className="bg-white/5 backdrop-blur-3xl border-2 border-yellow-400/50 p-8 rounded-3xl flex flex-col relative shadow-[0_0_30px_rgba(250,204,21,0.2)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            Most Popular
          </div>
          <h3 className="text-2xl font-bold text-yellow-300 mb-2 flex items-center gap-2 drop-shadow-sm">
            Premium <Star className="w-5 h-5 fill-current" />
          </h3>
          <div className="text-4xl font-black text-white mb-6 drop-shadow-md">$4.99<span className="text-lg text-white/60 font-medium">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-white font-bold drop-shadow-sm">
              <Check className="w-5 h-5 text-yellow-400" /> Unlimited Game Review
            </li>
            <li className="flex items-center gap-3 text-white font-bold drop-shadow-sm">
              <Check className="w-5 h-5 text-yellow-400" /> Best Move Hints
            </li>
            <li className="flex items-center gap-3 text-white/80 font-medium">
              <Check className="w-5 h-5 text-yellow-400" /> No Ads
            </li>
            <li className="flex items-center gap-3 text-white/80 font-medium">
              <Check className="w-5 h-5 text-yellow-400" /> Custom Avatars & Tokens
            </li>
          </ul>
          <button className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white transition-all shadow-lg active:scale-[0.98] border border-pink-400/50">
            Upgrade
          </button>
        </div>

      </div>
      
      <div className="mt-12 text-white/50 text-sm flex items-center gap-2 font-medium">
        <Shield className="w-4 h-4" /> Secure payment processed by Stripe.
      </div>
    </div>
  );
}
