'use client';

import React, { useState, useEffect } from 'react';
import { Crown, Users, ChevronRight, Settings } from 'lucide-react';
import { usePro } from '@/context/ProContext';
import Link from 'next/link';

export function SidebarWidgets({ isMobile = false }: { isMobile?: boolean }) {
  const {
    isPro: isProContext,
    isSettingsOpen, setIsSettingsOpen,
  } = usePro();

  // Double-check localStorage on client side to avoid flash of wrong state
  const [isDemo, setIsDemo] = useState(false);
  useEffect(() => {
    const demoFlag = localStorage.getItem('is_pro_demo') === 'true';
    setIsDemo(demoFlag);
    console.log('[DEBUG SidebarWidgets] isProContext:', isProContext, '| isDemo (localStorage):', demoFlag);
  }, [isProContext]);

  const isProActive = isProContext || isDemo;

  return (
    <>
      <div className={`${isMobile ? 'flex md:hidden mt-8' : 'hidden md:flex mt-auto'} flex-col gap-6 px-4`}>

        {/* Friends Online Section */}
        <div>
          <Link
            href="/friends"
            className="flex items-center gap-1 text-xs text-zinc-500 font-bold tracking-wider uppercase mb-3 hover:text-white transition-colors group w-full text-left"
          >
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
            FRIENDS
            <ChevronRight className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>

          <div className="flex flex-col gap-1">
            <Link href="/profile/Bakhitbek" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-zinc-800 relative shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bakhitbek" alt="Bakhitbek" className="w-full h-full rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full border-2 border-[#0d0d0d]"></div>
              </div>
              <span className="text-sm text-zinc-300 font-medium truncate group-hover:text-white transition-colors">Bakhitbek</span>
            </Link>
          </div>
        </div>

        {/* PRO Card */}
        <Link href="/pro" className="group block bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-xl p-4 transition-all">
          <div className="flex items-center gap-2 mb-1">
            <Crown className={`w-4 h-4 ${isProActive ? 'text-white' : 'text-zinc-400 group-hover:text-white transition-colors'}`} />
            <h4 className={`text-sm font-bold ${isProActive ? 'text-white' : 'text-zinc-300 group-hover:text-white transition-colors'}`}>
              {isProActive ? 'PRO Active' : 'Connect PRO'}
            </h4>
          </div>
          {!isProActive && (
            <>
              <p className="text-xs text-zinc-500 mb-3 leading-relaxed">Unlock premium features & mentor</p>
              <div className="w-full py-1.5 rounded-lg bg-white text-black text-xs font-bold text-center transition-all shadow-sm group-active:scale-[0.98]">
                View Details
              </div>
            </>
          )}
          {isProActive && (
            <p className="text-xs text-zinc-500 leading-relaxed mt-2">All premium features unlocked!</p>
          )}
        </Link>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-zinc-500 hover:text-white"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-bold">Settings</span>
        </button>
      </div>

    </>
  );
}
