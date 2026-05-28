import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { Navigation } from './Navigation';

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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.6),_0_2px_10px_rgba(220,38,38,0.6)] border border-red-400/40 flex items-center justify-center text-white font-black">4</div>
              <span className="hidden md:block">Connect</span>
            </Link>
          </div>
          
          <Navigation />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 pb-16 md:pb-0">
          {children}
        </main>

      </body>
    </html>
  );
}
