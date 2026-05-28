'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type SkinType = 'standard' | 'pixel_pets';

interface ProContextType {
  isPro: boolean;
  setIsPro: (value: boolean) => void;
  selectedSkin: SkinType;
  setSelectedSkin: (skin: SkinType) => void;
}

const ProContext = createContext<ProContextType | undefined>(undefined);

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [selectedSkin, setSelectedSkin] = useState<SkinType>('standard');

  return (
    <ProContext.Provider value={{ isPro, setIsPro, selectedSkin, setSelectedSkin }}>
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
