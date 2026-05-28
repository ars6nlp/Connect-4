'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppTheme = 'deep_slate' | 'midnight' | 'cyberpunk' | 'minimalist';
export type PieceStyle = 'classic' | 'neon' | 'pixel_pets';

interface AppContextType {
  isPro: boolean;
  setIsPro: (value: boolean) => void;
  appTheme: AppTheme;
  setAppTheme: (theme: AppTheme) => void;
  pieceStyle: PieceStyle;
  setPieceStyle: (style: PieceStyle) => void;
}

const ProContext = createContext<AppContextType | undefined>(undefined);

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [appTheme, setAppTheme] = useState<AppTheme>('deep_slate');
  const [pieceStyle, setPieceStyle] = useState<PieceStyle>('classic');

  useEffect(() => {
    // Remove all theme classes first
    document.body.classList.remove('theme-deep_slate', 'theme-midnight', 'theme-cyberpunk', 'theme-minimalist');
    // Add the new theme class
    document.body.classList.add(`theme-${appTheme}`);
  }, [appTheme]);

  return (
    <ProContext.Provider value={{ isPro, setIsPro, appTheme, setAppTheme, pieceStyle, setPieceStyle }}>
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
