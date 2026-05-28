'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type AppTheme = 'deep_slate' | 'midnight' | 'cyberpunk' | 'minimalist';
export type PieceStyle = 'classic' | 'neon' | 'pixel_pets' | 'brick_builder';

interface AppContextType {
  isPro: boolean;
  setIsPro: (value: boolean) => void;
  userId: string | null;
  userEmail: string | null;
  appTheme: AppTheme;
  setAppTheme: (theme: AppTheme) => void;
  pieceStyle: PieceStyle;
  setPieceStyle: (style: PieceStyle) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (value: boolean) => void;
}

const ProContext = createContext<AppContextType | undefined>(undefined);

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [appTheme, setAppTheme] = useState<AppTheme>('deep_slate');
  const [pieceStyle, setPieceStyle] = useState<PieceStyle>('classic');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load session + PRO status from Supabase on mount
  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? null);

        // Fetch PRO status from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_pro')
          .eq('id', session.user.id)
          .single();

        if (profile?.is_pro) setIsPro(true);
      }
    };

    loadSession();

    // Listen for auth state changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? null);
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_pro')
          .eq('id', session.user.id)
          .single();
        if (profile?.is_pro) setIsPro(true);
      } else {
        setUserId(null);
        setUserEmail(null);
        setIsPro(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.body.classList.remove('theme-deep_slate', 'theme-midnight', 'theme-cyberpunk', 'theme-minimalist');
    document.body.classList.add(`theme-${appTheme}`);
  }, [appTheme]);

  return (
    <ProContext.Provider value={{ isPro, setIsPro, userId, userEmail, appTheme, setAppTheme, pieceStyle, setPieceStyle, isSettingsOpen, setIsSettingsOpen }}>
      {children}
    </ProContext.Provider>
  );
}

export function usePro() {
  const context = useContext(ProContext);
  if (context === undefined) {
    throw new Error('usePro must be used within a ProProvider');
  }
  return context;
}
