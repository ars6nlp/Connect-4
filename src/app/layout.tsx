import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Play, Trophy, History, Star, User } from 'lucide-react';
import Link from 'next/link';

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
      <body className={`${inter.className} antialiased flex h-screen overflow-hidden`}>
        
        {/* Navigation Sidebar (Desktop) / Bottom Bar (Mobile) */}
        <aside className="fixed bottom-0 left-0 right-0 h-16 md:relative md:h-auto md:w-64 flex flex-row md:flex-col items-center md:items-stretch bg-white/5 backdrop-blur-2xl border-t md:border-t-0 md:border-r border-white/10 py-0 md:py-6 z-50 shadow-[0_-8px_32px_rgba(0,0,0,0.3)] md:shadow-[8px_0_32px_rgba(0,0,0,0.3)] transition-all">
          <div className="hidden md:flex items-center justify-center md:justify-start gap-3 px-0 md:px-4 mb-10">
            <Link href="/" className="text-xl md:text-2xl font-black text-white hover:text-gray-300 transition-colors flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-amber-400 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.4),_0_2px_8px_rgba(244,63,94,0.5)] border border-rose-300/30 flex items-center justify-center text-white font-black">4</div>
              <span className="hidden md:block">Connect</span>
            </Link>
          </div>
          
          <nav className="flex-1 w-full flex flex-row md:flex-col items-center justify-around md:justify-start md:space-y-1 px-2 md:px-0 h-full">
            <Link href="/" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-1 md:py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors justify-center md:justify-start group">
              <Play className="w-6 h-6 md:w-6 md:h-6 group-hover:scale-110 transition-transform text-pink-400" />
              <span className="text-[10px] md:text-base font-bold">Play</span>
            </Link>
            <Link href="/leaderboard" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-1 md:py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors justify-center md:justify-start group">
              <Trophy className="w-6 h-6 md:w-6 md:h-6 group-hover:scale-110 transition-transform text-yellow-400" />
              <span className="text-[10px] md:text-base font-bold">Ranks</span>
            </Link>
            <Link href="/history" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-1 md:py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors justify-center md:justify-start group">
              <History className="w-6 h-6 md:w-6 md:h-6 group-hover:scale-110 transition-transform text-blue-400" />
              <span className="text-[10px] md:text-base font-bold">History</span>
            </Link>
            <Link href="/profile" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-1 md:py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors justify-center md:justify-start group">
              <User className="w-6 h-6 md:w-6 md:h-6 text-emerald-400 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-[10px] md:text-base font-bold">Profile</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 pb-16 md:pb-0">
          {children}
        </main>

      </body>
    </html>
  );
}
