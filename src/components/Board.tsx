import React from 'react';
import { Cell as CellType, Player } from './useConnectFour';
import { Theme } from './useCheatCodes';
import { usePro } from '@/context/ProContext';

interface BoardProps {
  board: CellType[][];
  onDropPiece: (col: number) => void;
  winner: Player | 'draw' | null;
  hintCol?: number | null;
  theme?: Theme;
}

export const Board: React.FC<BoardProps> = ({ board, onDropPiece, hintCol, theme = 'classic' }) => {
  const { pieceStyle } = usePro();
  const isPixel = theme === 'pixel';
  const isMatrix = theme === 'matrix';
  const isFastFood = theme === 'fastfood';

  const boardBg = isPixel ? 'bg-indigo-600 border-8 border-indigo-900 rounded-none shadow-none' :
                  isFastFood ? 'bg-red-500 rounded-3xl border-8 border-yellow-400 shadow-[0_10px_0_#b91c1c]' :
                  isMatrix ? 'bg-black border-2 border-green-500 rounded-none shadow-[0_0_20px_#22c55e]' :
                  'bg-slate-900/40 backdrop-blur-3xl rounded-3xl border border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)]';

  const cellBg = isPixel ? 'bg-indigo-300 rounded-none border-4 border-indigo-800' :
                 isFastFood ? 'bg-white/90 rounded-full border-4 border-red-700' :
                 isMatrix ? 'bg-black rounded-none border border-green-900/50' :
                 'bg-black/40 rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] border border-white/5';

  // For the piece, we return the class string depending on player
  const getPieceClass = (player: Player) => {
    if (player === 'red') {
      if (pieceStyle === 'brick_builder') {
        return 'bg-red-600 rounded-sm shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.4)] relative flex items-center justify-center after:content-[""] after:w-1/2 after:h-1/2 after:rounded-full after:bg-red-600 after:shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.5)]';
      }
      if (pieceStyle === 'pixel_pets') {
        return 'bg-[url("https://fav.farm/🐶")] bg-center bg-contain bg-no-repeat bg-transparent shadow-none';
      }
      if (pieceStyle === 'neon') {
        return 'bg-transparent border-[6px] border-rose-500 rounded-full shadow-[0_0_15px_#f43f5e,inset_0_0_15px_#f43f5e] animate-pulse';
      }
      return isPixel ? 'bg-red-500 rounded-none border-4 border-red-800' :
             isFastFood ? 'bg-[url("https://fav.farm/🍔")] bg-center bg-contain bg-no-repeat bg-transparent shadow-none' :
             isMatrix ? 'bg-transparent text-green-500 flex items-center justify-center font-mono font-black text-3xl md:text-5xl after:content-["1"]' :
             'bg-gradient-to-br from-rose-500 to-red-600 rounded-full shadow-[inset_0_8px_12px_rgba(255,255,255,0.6),_inset_0_-10px_20px_rgba(0,0,0,0.6),_0_6px_15px_rgba(225,29,72,0.5)] border border-rose-400/60 backdrop-blur-md relative overflow-hidden after:content-[\'\'] after:absolute after:top-[5%] after:left-[15%] after:w-[70%] after:h-[35%] after:bg-gradient-to-b after:from-white/50 after:to-transparent after:rounded-full';
    }
    if (player === 'yellow') {
      if (pieceStyle === 'brick_builder') {
        return 'bg-yellow-400 rounded-sm shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.6)] relative flex items-center justify-center after:content-[""] after:w-1/2 after:h-1/2 after:rounded-full after:bg-yellow-400 after:shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.5)]';
      }
      if (pieceStyle === 'pixel_pets') {
        return 'bg-[url("https://fav.farm/🐱")] bg-center bg-contain bg-no-repeat bg-transparent shadow-none';
      }
      if (pieceStyle === 'neon') {
        return 'bg-transparent border-[6px] border-yellow-400 rounded-full shadow-[0_0_15px_#facc15,inset_0_0_15px_#facc15] animate-pulse';
      }
      return isPixel ? 'bg-yellow-400 rounded-none border-4 border-yellow-700' :
             isFastFood ? 'bg-[url("https://fav.farm/🍟")] bg-center bg-contain bg-no-repeat bg-transparent shadow-none' :
             isMatrix ? 'bg-transparent text-green-300 flex items-center justify-center font-mono font-black text-3xl md:text-5xl after:content-["0"]' :
             'bg-gradient-to-br from-amber-300 to-yellow-500 rounded-full shadow-[inset_0_8px_12px_rgba(255,255,255,0.6),_inset_0_-10px_20px_rgba(0,0,0,0.6),_0_6px_15px_rgba(245,158,11,0.5)] border border-yellow-200/60 backdrop-blur-md relative overflow-hidden after:content-[\'\'] after:absolute after:top-[5%] after:left-[15%] after:w-[70%] after:h-[35%] after:bg-gradient-to-b after:from-white/60 after:to-transparent after:rounded-full';
    }
    return 'bg-transparent -translate-y-[400%] opacity-0';
  };

  return (
    <div className={`w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[480px] mx-auto p-2 sm:p-3 md:p-5 flex flex-col gap-1 sm:gap-1.5 md:gap-2.5 transition-all duration-500 rounded-3xl ${boardBg}`}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2.5">
          {row.map((cell, colIndex) => {
            const isHint = hintCol === colIndex && rowIndex === 0;
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-full aspect-square flex items-center justify-center cursor-pointer overflow-hidden relative transition-colors duration-300
                  ${cellBg}
                  ${isHint ? 'ring-2 sm:ring-4 ring-[#f6b43f] animate-pulse' : ''}
                `}
                onClick={() => onDropPiece(colIndex)}
              >
                {hintCol === colIndex && !cell.player && (
                   <div className="absolute inset-0 bg-[#f6b43f] opacity-20 hover:opacity-40 transition-opacity"></div>
                )}
                
                <div 
                  className={`
                    w-[85%] h-[85%] transition-all duration-300 transform
                    ${cell.player ? 'animate-drop-bounce opacity-100' : ''}
                    ${getPieceClass(cell.player)}
                    ${cell.isWinningCell ? (isMatrix ? 'ring-2 ring-white shadow-[0_0_10px_white]' : 'ring-2 sm:ring-4 ring-[#ffffff] animate-pulse z-10') : ''}
                  `}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
