import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { Navigation } from './Navigation';
import { Crown } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connect Four - Play Online",
  description: "Play Connect Four against the computer or friends. Clean, fast, and competitive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased flex h-[100dvh] overflow-hidden`}>
        
        {/* Navigation Sidebar (Desktop) / Bottom Bar (Mobile) */}
        <aside className="fixed bottom-0 left-0 right-0 h-16 md:relative md:h-auto md:w-64 flex flex-row md:flex-col items-center md:items-stretch bg-white/5 backdrop-blur-2xl border-t md:border-t-0 md:border-r border-white/10 py-0 md:py-6 z-50 shadow-[0_-8px_32px_rgba(0,0,0,0.3)] md:shadow-[8px_0_32px_rgba(0,0,0,0.3)] transition-all">
          <div className="hidden md:flex items-center justify-center md:justify-start gap-3 px-0 md:px-4 mb-10">
            <Link href="/" className="text-xl md:text-2xl font-black text-white hover:text-gray-300 transition-colors flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.6),_0_2px_10px_rgba(220,38,38,0.6)] border border-red-400/40 flex items-center justify-center text-white font-black">4</div>
              <span className="hidden md:block">Connect</span>
            </Link>
          </div>
          
          <Navigation />

          {/* Desktop-only Bottom Section */}
          <div className="hidden md:flex mt-auto flex-col gap-6 px-4">
            
            {/* Friends Online */}
            <div>
              <h3 className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-3">Friends Online</h3>
              <div className="flex flex-col gap-1">
                {/* Friend 1 */}
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-slate-700 relative shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bakhitbek" alt="Bakhitbek" className="w-full h-full rounded-full opacity-80" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1f2e]"></div>
                  </div>
                  <span className="text-sm text-slate-200 font-medium truncate">Bakhitbek</span>
                </div>
                {/* Friend 2 */}
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-slate-700 relative shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aybatyr" alt="Aybatyr" className="w-full h-full rounded-full opacity-80" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1f2e]"></div>
                  </div>
                  <span className="text-sm text-slate-200 font-medium truncate">Aybatyr</span>
                </div>
              </div>
            </div>

            {/* Premium / Pro Card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/20 blur-2xl rounded-full"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-sm font-bold text-white">Connect PRO</h4>
                </div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">Unlock custom Pixel Art pieces & emojis</p>
                <button className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all shadow-sm active:scale-[0.98]">
                  Upgrade
                </button>
              </div>
            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 pb-16 md:pb-0">
          {children}
        </main>

      </body>
    </html>
  );
}
