'use client';

import Link from 'next/link';
import { Play, Trophy, ShieldCheck, Globe, Loader2, Check } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleUnlockPro = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/polar/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'guest', email: '' }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black text-white flex flex-col">

      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ──────────── HEADER ──────────── */}
      <header className="relative z-10 w-full border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black font-black text-lg shadow-lg">
              4
            </div>
            <span className="text-xl font-black tracking-tight">Connect</span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="text-zinc-400 hover:text-white font-semibold transition-colors px-3 sm:px-4 py-2 text-sm"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="bg-white text-black hover:bg-zinc-200 px-5 py-2 rounded-full font-bold transition-all text-sm active:scale-95"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* ──────────── HERO ──────────── */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-zinc-400 text-xs sm:text-sm font-semibold mb-8 bg-white/[0.02]">
          <SparklesIcon className="w-4 h-4 text-white shrink-0" />
          <span>New: Blitz Mode &amp; Pixel Art Skins</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.05] mb-6 max-w-4xl">
          <span className="text-white">Master</span> the Grid.<br />
          Dominate <span className="text-zinc-400">Online</span>.
        </h1>

        <p className="text-base sm:text-xl text-zinc-500 max-w-xl mb-10 font-medium leading-relaxed">
          Play Connect Four like never before. Climb the global ranks, challenge friends, and unlock exclusive PRO customizations.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black text-lg sm:text-xl hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        >
          <Play className="w-5 h-5 fill-black" />
          Play Now
        </Link>
      </main>

      {/* ──────────── FEATURES ──────────── */}
      <section className="relative z-10 w-full border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Globe className="w-7 h-7 text-white" />}
              title="Real-time Multiplayer"
              desc="Instantly connect and play with opponents around the world with zero latency."
            />
            <FeatureCard
              icon={<Trophy className="w-7 h-7 text-white" />}
              title="Global Leaderboards"
              desc="Earn ELO rating points for every victory and climb the competitive ladder."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-7 h-7 text-white" />}
              title="Connect PRO"
              desc="Unlock pixel-art skins, premium themes, and an AI Mentor to analyze your matches."
            />
          </div>
        </div>
      </section>

      {/* ──────────── PRICING (Polar CTA) ──────────── */}
      <section className="relative z-10 w-full border-t border-white/5 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Unlock PRO Access</h2>
          <p className="text-zinc-500 max-w-md mb-12 text-sm sm:text-base leading-relaxed">
            Support indie development and get all premium features. One-time payment. Yours forever.
          </p>

          <div className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-3xl p-8">
            {/* Price */}
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-5xl font-black text-white">$4.99</span>
            </div>
            <p className="text-zinc-500 text-sm mb-8">One-time · Lifetime access</p>

            {/* Features */}
            <ul className="space-y-3 mb-8 text-left">
              {[
                'AI Post-Match Mentor',
                'Pixel Art Skins & Themes',
                'Priority Matchmaking',
                'Ad-Free Experience',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={handleUnlockPro}
              disabled={checkoutLoading}
              className="w-full py-4 bg-white text-black hover:bg-zinc-200 font-black rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 text-base"
            >
              {checkoutLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Get PRO Access'
              )}
            </button>

            <p className="text-zinc-600 text-xs mt-4">
              Secure checkout via Polar. No subscription.
            </p>
          </div>
        </div>
      </section>

      {/* ──────────── FOOTER ──────────── */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-zinc-600 text-xs">
        © {new Date().getFullYear()} Connect Four Online · Built with ♟
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-colors">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-5 border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
