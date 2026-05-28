import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Play, Trophy, Star, History } from 'lucide-react';
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
        
        {/* Sidebar */}
        <aside className="w-16 md:w-64 flex flex-col items-center md:items-stretch bg-white/5 backdrop-blur-2xl border-r border-white/10 py-6 z-20 shadow-[8px_0_32px_rgba(0,0,0,0.3)] transition-all">
          <div className="flex items-center justify-center md:justify-start gap-3 px-0 md:px-4 mb-10">
            <Link href="/" className="text-xl md:text-2xl font-black text-white hover:text-gray-300 transition-colors flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">4</div>
              <span className="hidden md:block">Connect</span>
            </Link>
          </div>
          
          <nav className="flex-1 w-full space-y-1">
            <Link href="/" className="flex items-center gap-3 px-0 md:px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors justify-center md:justify-start group">
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform text-pink-400" />
              <span className="hidden md:block font-bold">Play</span>
            </Link>
            <Link href="/leaderboard" className="flex items-center gap-3 px-0 md:px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors justify-center md:justify-start group">
              <Trophy className="w-6 h-6 group-hover:scale-110 transition-transform text-yellow-400" />
              <span className="hidden md:block font-bold">Leaderboard</span>
            </Link>
            <Link href="/history" className="flex items-center gap-3 px-0 md:px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors justify-center md:justify-start group">
              <History className="w-6 h-6 group-hover:scale-110 transition-transform text-blue-400" />
              <span className="hidden md:block font-bold">History</span>
            </Link>
            <Link href="/pro" className="flex items-center gap-3 px-0 md:px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors justify-center md:justify-start group mt-4">
              <Star className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              <span className="hidden md:block font-bold">Premium</span>
            </Link>
          </nav>

          <div className="mt-auto px-0 md:px-4 pb-4 flex justify-center md:justify-start">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center font-bold text-white cursor-pointer hover:bg-white/20 transition-colors shadow-lg">
              G
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10">
          {children}
        </main>

      </body>
    </html>
  );
}
