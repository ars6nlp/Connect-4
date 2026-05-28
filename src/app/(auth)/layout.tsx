import Link from 'next/link';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex bg-white text-black">
      
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex w-1/2 bg-black flex-col justify-between p-12 relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        {/* Gradient orb */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-black text-xl shadow-lg">
            4
          </div>
          <span className="text-white text-2xl font-black tracking-tight">Connect</span>
        </Link>

        {/* Quote */}
        <div className="relative z-10">
          <blockquote className="text-white/80 text-2xl font-light leading-relaxed mb-6 italic">
            &ldquo;Every master was once a beginner. Every pro was once an amateur.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-sm font-bold">R</div>
            <div>
              <p className="text-white font-semibold text-sm">Robin Sharma</p>
              <p className="text-white/40 text-xs">Author &amp; Leadership Expert</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-8 relative z-10 border-t border-white/10 pt-8">
          <div>
            <p className="text-white text-2xl font-black">10K+</p>
            <p className="text-white/40 text-xs uppercase tracking-wider mt-1">Players</p>
          </div>
          <div>
            <p className="text-white text-2xl font-black">500K+</p>
            <p className="text-white/40 text-xs uppercase tracking-wider mt-1">Games Played</p>
          </div>
          <div>
            <p className="text-white text-2xl font-black">#1</p>
            <p className="text-white/40 text-xs uppercase tracking-wider mt-1">Connect 4 App</p>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-black text-sm">4</div>
            <span className="font-black text-black">Connect</span>
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>

    </div>
  );
}
