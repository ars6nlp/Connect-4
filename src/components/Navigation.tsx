'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, Trophy, History, User, Settings } from 'lucide-react';
import { usePro } from '@/context/ProContext';

export function Navigation() {
  const pathname = usePathname();
  const { setIsSettingsOpen } = usePro();

  const links = [
    { href: '/dashboard', label: 'Play', icon: Play, iconColor: 'text-pink-400' },
    { href: '/leaderboard', label: 'Ranks', icon: Trophy, iconColor: 'text-yellow-400' },
    { href: '/history', label: 'History', icon: History, iconColor: 'text-blue-400' },
    { href: '/profile', label: 'Profile', icon: User, iconColor: 'text-emerald-400' },
  ];

  return (
    <nav className="flex-1 w-full flex flex-row md:flex-col items-center justify-around md:justify-start md:space-y-1 px-2 md:px-0 h-full">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href === '/dashboard' && pathname?.startsWith('/play'));
        const Icon = link.icon;
        
        return (
          <Link 
            key={link.href}
            href={link.href} 
            className={`
              flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-1 md:py-3 transition-colors justify-center md:justify-start group rounded-2xl md:rounded-none md:border-l-4 md:border-transparent
              ${isActive 
                ? 'bg-white/10 md:bg-white/5 md:border-white/90 text-white shadow-inner md:shadow-none' 
                : 'text-white/70 hover:bg-white/5 hover:text-white'
              }
            `}
          >
            <Icon className={`w-6 h-6 md:w-6 md:h-6 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_12px_currentColor]' : 'group-hover:scale-110'} ${link.iconColor}`} />
            <span className={`text-[10px] md:text-base font-bold ${isActive ? 'drop-shadow-md' : ''}`}>
              {link.label}
            </span>
          </Link>
        );
      })}
      
      {/* Settings Button (Mobile Only) */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="flex md:hidden flex-col items-center gap-1 px-2 py-1 transition-colors justify-center group text-white/70 hover:bg-white/5 hover:text-white rounded-2xl"
      >
        <Settings className="w-6 h-6 transition-transform group-hover:scale-110 text-slate-400" />
        <span className="text-[10px] font-bold">
          Settings
        </span>
      </button>
    </nav>
  );
}
