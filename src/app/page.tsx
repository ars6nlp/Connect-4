import Link from 'next/link';
import { Play, Trophy, ShieldCheck, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-rose-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.6),_0_4px_12px_rgba(225,29,72,0.5)] border border-red-400/30 flex items-center justify-center text-white font-black text-xl">4</div>
          <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">Connect</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-slate-300 hover:text-white font-semibold transition-colors px-4 py-2">
            Log In
          </Link>
          <Link href="/register" className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-6 py-2 rounded-full font-bold transition-all shadow-lg hover:shadow-white/10">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center px-4 relative z-10 mt-12 mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-sm font-semibold mb-8 backdrop-blur-sm">
          <SparklesIcon className="w-4 h-4 text-amber-400" />
          <span>New Features: Blitz Mode & Pixel Art Skins</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight drop-shadow-2xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">Master</span> the Grid.<br/>
          Dominate <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">Online</span>.
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-12 font-medium">
          Play Connect Four like never before. Climb the global ranks, challenge your friends, and unlock exclusive PRO customizations.
        </p>

        <Link href="/login" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-black text-xl text-white overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_rgba(79,70,229,0.4)]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          <Play className="w-6 h-6 fill-white drop-shadow-md" />
          <span className="drop-shadow-md">Play Now</span>
          <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
        </Link>
      </main>

      {/* Feature Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Globe className="w-8 h-8 text-blue-400" />}
            title="Real-time Multiplayer"
            desc="Instantly connect and play with opponents around the world with zero latency."
          />
          <FeatureCard 
            icon={<Trophy className="w-8 h-8 text-amber-400" />}
            title="Global Leaderboards"
            desc="Earn ELO rating points for every victory and climb the competitive ladder."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />}
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
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-inner border border-white/5">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white/90">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
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
