import { useState, useCallback, useEffect, useRef } from 'react';
import { getBestMove, Difficulty, checkWinCondition as aiCheckWin } from '@/lib/ai';

export type Player = 'red' | 'yellow' | null;
export type GameMode = 'pass_and_play' | 'ai' | 'online';

export interface Cell {
  player: Player;
  isWinningCell: boolean;
}

export interface GameState {
  board: Cell[][];
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  moves: { player: Player; col: number; row: number }[];
}

export interface MatchHistoryEntry {
  id: string;
  date: string;
  mode: GameMode;
  difficulty?: Difficulty;
  winner: Player | 'draw';
  moves: number;
}

export interface TauntState {
  player: Player;
  emoji: string;
  id: number;
}

const ROWS = 6;
const COLS = 7;
const BLITZ_START_TIME = 60; // 60 seconds
const BLITZ_INCREMENT = 2; // +2 seconds per move

const createEmptyBoard = (): Cell[][] => 
  Array.from({ length: ROWS }, () => 
    Array.from({ length: COLS }, () => ({ player: null, isWinningCell: false }))
  );

export function useConnectFour(mode: GameMode = 'pass_and_play', difficulty: Difficulty = 'easy', isBlitz: boolean = false) {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPlayer: 'red',
    winner: null,
    moves: [],
  });
  
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [hintCol, setHintCol] = useState<number | null>(null);
  
  // Taunts state
  const [activeTaunt, setActiveTaunt] = useState<TauntState | null>(null);
  
  // Timer states
  const [redTime, setRedTime] = useState(BLITZ_START_TIME);
  const [yellowTime, setYellowTime] = useState(BLITZ_START_TIME);
  
  // Track last move time for AI 'yawn' taunt
  const lastMoveTime = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    lastMoveTime.current = Date.now();
  }, []);

  // Expose taunt function
  const sendTaunt = useCallback((player: Player, emoji: string) => {
    setActiveTaunt({ player, emoji, id: Date.now() });
    setTimeout(() => {
      setActiveTaunt(prev => prev?.id === Date.now() ? prev : null); // Simple clear logic
    }, 2000);
  }, []);

  const checkWin = (board: Cell[][], row: number, col: number, player: Player) => {
    const directions = [
      [[0, 1], [0, -1]], // horizontal
      [[1, 0], [-1, 0]], // vertical
      [[1, 1], [-1, -1]], // diagonal /
      [[1, -1], [-1, 1]] // diagonal \
    ];

    for (const dir of directions) {
      let count = 1;
      const winningCells = [{ r: row, c: col }];
      
      for (const [dr, dc] of dir) {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c].player === player) {
          count++;
          winningCells.push({ r, c });
          r += dr;
          c += dc;
        }
      }

      if (count >= 4) {
        return winningCells;
      }
    }
    return null;
  };

  const saveMatchToHistory = useCallback((winner: Player | 'draw', moves: number) => {
    try {
      const historyStr = localStorage.getItem('connectFourHistory');
      const history: MatchHistoryEntry[] = historyStr ? JSON.parse(historyStr) : [];
      history.unshift({
        id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString(),
        mode,
        difficulty: mode === 'ai' ? difficulty : undefined,
        winner,
        moves
      });
      localStorage.setItem('connectFourHistory', JSON.stringify(history.slice(0, 50))); 
    } catch (e) {
      console.error("Could not save history to localStorage", e);
    }
  }, [mode, difficulty]);

  useEffect(() => {
    if (gameState.winner) {
      saveMatchToHistory(gameState.winner, gameState.moves.length);
    }
  }, [gameState.winner, saveMatchToHistory, gameState.moves.length]);

  // Timer interval effect
  useEffect(() => {
    if (!isBlitz || gameState.winner || gameState.moves.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (gameState.currentPlayer === 'red') {
        setRedTime(prev => {
          if (prev <= 1) {
            setGameState(gs => ({ ...gs, winner: 'yellow' }));
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setYellowTime(prev => {
          if (prev <= 1) {
            setGameState(gs => ({ ...gs, winner: 'red' }));
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isBlitz, gameState.currentPlayer, gameState.winner, gameState.moves.length]);

  // AI Yawn taunt interval
  useEffect(() => {
    if (mode === 'ai' && difficulty === 'hard' && !gameState.winner && gameState.currentPlayer === 'red') {
      const yawnInterval = setInterval(() => {
        if (Date.now() - lastMoveTime.current > 10000) {
          sendTaunt('yellow', '🥱');
          lastMoveTime.current = Date.now(); // Reset so it doesn't spam
        }
      }, 1000);
      return () => clearInterval(yawnInterval);
    }
  }, [mode, difficulty, gameState.winner, gameState.currentPlayer, sendTaunt]);

  const dropPiece = useCallback((col: number, isSystemMove: boolean = false) => {
    if (gameState.winner || col < 0 || col >= COLS) return;

    // Prevent human from moving during AI's turn or while AI is thinking
    if (!isSystemMove && mode === 'ai' && gameState.currentPlayer === 'yellow') return;
    if (!isSystemMove && isAiThinking) return;

    // AI Check: Did player block a threat?
    if (mode === 'ai' && difficulty === 'hard' && gameState.currentPlayer === 'red') {
      const testBoard = gameState.board.map(r => r.map(c => ({...c})));
      let rRow = -1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (testBoard[r][col].player === null) { rRow = r; break; }
      }
      if (rRow !== -1) {
        testBoard[rRow][col].player = 'yellow'; // Imagine AI played there
        if (aiCheckWin(testBoard, 'yellow')) {
          // AI would have won! Player blocked it.
          setTimeout(() => sendTaunt('yellow', '🤔'), 1000);
        }
      }
    }

    setHintCol(null);
    lastMoveTime.current = Date.now();

    // Increment timer
    if (isBlitz && gameState.moves.length > 0) {
      if (gameState.currentPlayer === 'red') {
        setRedTime(prev => prev + BLITZ_INCREMENT);
      } else {
        setYellowTime(prev => prev + BLITZ_INCREMENT);
      }
    }

    setGameState(prevState => {
      let targetRow = -1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (prevState.board[r][col].player === null) {
          targetRow = r;
          break;
        }
      }

      if (targetRow === -1) return prevState;

      const newBoard = prevState.board.map(row => row.map(cell => ({ ...cell })));
      newBoard[targetRow][col] = { player: prevState.currentPlayer, isWinningCell: false };
      const newMoves = [...prevState.moves, { player: prevState.currentPlayer, col, row: targetRow }];
      
      const winningCells = checkWin(newBoard, targetRow, col, prevState.currentPlayer);
      let winner: Player | 'draw' | null = null;
      
      if (winningCells) {
        winner = prevState.currentPlayer;
        winningCells.forEach(({ r, c }) => {
          newBoard[r][c].isWinningCell = true;
        });
      } else if (newMoves.length === ROWS * COLS) {
        winner = 'draw';
      }

      return {
        board: newBoard,
        currentPlayer: prevState.currentPlayer === 'red' ? 'yellow' : 'red',
        winner,
        moves: newMoves,
      };
    });
  }, [gameState.winner, isAiThinking, isBlitz, mode, difficulty, sendTaunt, gameState.currentPlayer, gameState.board, gameState.moves.length]);

  const getHint = useCallback(() => {
    if (gameState.winner || isAiThinking) return;
    setIsAiThinking(true);
    setTimeout(() => {
      const bestMove = getBestMove(gameState.board, gameState.currentPlayer!, 'hard');
      setHintCol(bestMove);
      setIsAiThinking(false);
    }, 100);
  }, [gameState.board, gameState.currentPlayer, gameState.winner, isAiThinking]);

  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (mode === 'ai' && gameState.currentPlayer === 'yellow' && !gameState.winner) {
      // Prevent scheduling multiple moves
      if (aiTimerRef.current) return;

      setIsAiThinking(true);
      
      aiTimerRef.current = setTimeout(() => {
        const aiCol = getBestMove(gameState.board, 'yellow', difficulty);
        dropPiece(aiCol, true);
        setIsAiThinking(false);
        aiTimerRef.current = null;
      }, difficulty === 'hard' ? 100 : 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentPlayer, gameState.winner, mode, difficulty, gameState.board]);

  const syncWithRemoteMoves = useCallback((remoteMoves: { player: Player; col: number; row: number }[]) => {
    setGameState(prevState => {
      // Avoid unnecessary updates if length is same
      if (prevState.moves.length === remoteMoves.length) return prevState;

      const newBoard = createEmptyBoard();
      let newWinner: Player | 'draw' | null = null;
      let newCurrentPlayer: Player = 'red';
      
      for (const m of remoteMoves) {
        newBoard[m.row][m.col].player = m.player;
        const winningCells = checkWin(newBoard, m.row, m.col, m.player);
        if (winningCells) {
           newWinner = m.player;
           winningCells.forEach(({r, c}) => {
             newBoard[r][c].isWinningCell = true;
           });
        }
        newCurrentPlayer = m.player === 'red' ? 'yellow' : 'red';
      }
      
      if (!newWinner && remoteMoves.length === ROWS * COLS) {
        newWinner = 'draw';
      }
      
      return {
         board: newBoard,
         currentPlayer: newCurrentPlayer,
         winner: newWinner,
         moves: remoteMoves
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPlayer: 'red',
      winner: null,
      moves: [],
    });
    setRedTime(BLITZ_START_TIME);
    setYellowTime(BLITZ_START_TIME);
    setIsAiThinking(false);
    setHintCol(null);
    setActiveTaunt(null);
    lastMoveTime.current = Date.now();
  }, []);

  return {
    ...gameState,
    isAiThinking,
    hintCol,
    redTime,
    yellowTime,
    activeTaunt,
    sendTaunt,
    dropPiece,
    resetGame,
    getHint,
    syncWithRemoteMoves
  };
}
