import { useState, useEffect } from 'react';

export type Theme = 'classic' | 'pixel' | 'fastfood' | 'matrix';

export function useCheatCodes() {
  const [theme, setTheme] = useState<Theme>('classic');

  useEffect(() => {
    let buffer = '';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const key = e.key.toLowerCase();
      // only keep letters
      if (!/^[a-z]$/.test(key)) return;

      buffer += key;
      // keep buffer length reasonable
      if (buffer.length > 10) {
        buffer = buffer.slice(buffer.length - 10);
      }

      if (buffer.endsWith('pixel')) {
        setTheme(prev => prev === 'pixel' ? 'classic' : 'pixel');
        buffer = '';
      } else if (buffer.endsWith('fastfood')) {
        setTheme(prev => prev === 'fastfood' ? 'classic' : 'fastfood');
        buffer = '';
      } else if (buffer.endsWith('matrix')) {
        setTheme(prev => prev === 'matrix' ? 'classic' : 'matrix');
        buffer = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return theme;
}
