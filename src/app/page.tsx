import Link from 'next/link';
import { Play, Trophy, ShieldCheck, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center relative overflow-hidden">
      
      {/* Background Decor - Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center relative z-10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-black text-xl shadow-lg">4</div>
          <span className="text-2xl font-black tracking-tight text-white drop-shadow-sm">Connect</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-zinc-400 hover:text-white font-semibold transition-colors px-4 py-2 text-sm">
            Log In
          </Link>
          <Link href="/register" className="bg-white text-black hover:bg-zinc-200 px-6 py-2 rounded-full font-bold transition-all text-sm active:scale-95">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center px-4 relative z-10 mt-16 mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-zinc-400 text-sm font-semibold mb-8 backdrop-blur-sm bg-white/[0.02]">
          <SparklesIcon className="w-4 h-4 text-white" />
          <span>New Features: Blitz Mode & Pixel Art Skins</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
          <span className="text-white">Master</span> the Grid.<br/>
          Dominate <span className="text-zinc-400">Online</span>.
        </h1>
        
        <p className="text-xl md:text-xl text-zinc-500 max-w-2xl mb-12 font-medium">
          Play Connect Four like never before. Climb the global ranks, challenge your friends, and unlock exclusive PRO customizations.
        </p>

        <Link href="/login" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black text-xl overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          <Play className="w-6 h-6 fill-black" />
          <span>Play Now</span>
          <div className="absolute inset-0 rounded-full ring-2 ring-black/10 group-hover:ring-black/20 transition-all"></div>
        </Link>
      </main>

      {/* Feature Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-white/5 bg-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Globe className="w-8 h-8 text-white" />}
            title="Real-time Multiplayer"
            desc="Instantly connect and play with opponents around the world with zero latency."
          />
          <FeatureCard 
            icon={<Trophy className="w-8 h-8 text-white" />}
            title="Global Leaderboards"
            desc="Earn ELO rating points for every victory and climb the competitive ladder."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-white" />}
            title="Connect PRO"
            desc="Unlock pixel-art skins, premium themes, and an AI Mentor to analyze your matches."
          />
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-colors">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-zinc-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  )
}
