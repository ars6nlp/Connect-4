import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { SidebarWidgets } from '@/components/SidebarWidgets';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-transparent">
      {/* Sidebar (desktop) / Bottom bar (mobile) */}
      <aside className="fixed bottom-0 left-0 right-0 h-16 md:relative md:h-auto md:w-60 flex flex-row md:flex-col items-center md:items-stretch bg-[#0d0d0d] border-t md:border-t-0 md:border-r border-white/8 py-0 md:py-6 z-50 shrink-0">
        
        {/* Logo — desktop only */}
        <div className="hidden md:flex items-center gap-3 px-5 mb-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-black text-base shadow-lg group-hover:bg-zinc-100 transition-colors">4</div>
            <span className="text-white font-black text-lg tracking-tight">Connect</span>
          </Link>
        </div>

        <Navigation />
        <SidebarWidgets />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 pb-16 md:pb-0 bg-transparent">
        {children}
      </main>
    </div>
  );
}
