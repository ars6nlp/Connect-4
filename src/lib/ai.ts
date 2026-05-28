import { Player, Cell } from '@/hooks/useConnectFour';

const ROWS = 6;
const COLS = 7;

export type Difficulty = 'easy' | 'medium' | 'hard';

// AI evaluation function and minimax for Hard difficulty
export function getBestMove(board: Cell[][], aiPlayer: Player, difficulty: Difficulty): number {
  if (difficulty === 'easy') {
    return getRandomMove(board);
  }
  if (difficulty === 'medium') {
    const blockingMove = getBlockingMove(board, aiPlayer);
    if (blockingMove !== -1) return blockingMove;
    const winningMove = getWinningMove(board, aiPlayer);
    if (winningMove !== -1) return winningMove;
    return getRandomMove(board);
  }
  
  // Hard mode: Minimax with Alpha-Beta Pruning (Depth 5 for performance)
  // To keep it responsive in browser, depth 4 or 5 is safe.
  const [bestCol] = minimax(board, 5, -Infinity, Infinity, true, aiPlayer);
  return bestCol !== -1 ? bestCol : getRandomMove(board);
}

function getValidLocations(board: Cell[][]): number[] {
  const validLocations = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c].player === null) {
      validLocations.push(c);
    }
  }
  return validLocations;
}

function getRandomMove(board: Cell[][]): number {
  const validLocations = getValidLocations(board);
  const randomIndex = Math.floor(Math.random() * validLocations.length);
  return validLocations[randomIndex];
}

function getNextOpenRow(board: Cell[][], col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col].player === null) {
      return r;
    }
  }
  return -1;
}

export function checkWinCondition(board: Cell[][], player: Player): boolean {
  // Check horizontal
  for (let c = 0; c < COLS - 3; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (board[r][c].player === player && board[r][c+1].player === player && board[r][c+2].player === player && board[r][c+3].player === player) {
        return true;
      }
    }
  }
  // Check vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (board[r][c].player === player && board[r-1+1][c].player === player && board[r-2+2][c].player === player && board[r-3+3][c].player === player) {
        return true;
      }
    }
  }
  // Check diagonal /
  for (let c = 0; c < COLS - 3; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (board[r][c].player === player && board[r+1][c+1].player === player && board[r+2][c+2].player === player && board[r+3][c+3].player === player) {
        return true;
      }
    }
  }
  // Check diagonal \
  for (let c = 0; c < COLS - 3; c++) {
    for (let r = 3; r < ROWS; r++) {
      if (board[r][c].player === player && board[r-1][c+1].player === player && board[r-2][c+2].player === player && board[r-3][c+3].player === player) {
        return true;
      }
    }
  }
  return false;
}

function getWinningMove(board: Cell[][], player: Player): number {
  const validLocations = getValidLocations(board);
  for (const col of validLocations) {
    const row = getNextOpenRow(board, col);
    // simulate move
    board[row][col].player = player;
    const isWin = checkWinCondition(board, player);
    board[row][col].player = null; // undo
    if (isWin) return col;
  }
  return -1;
}

function getBlockingMove(board: Cell[][], aiPlayer: Player): number {
  const opponent = aiPlayer === 'red' ? 'yellow' : 'red';
  return getWinningMove(board, opponent);
}

// Evaluation window
function evaluateWindow(window: Player[], aiPlayer: Player): number {
  let score = 0;
  const opponent = aiPlayer === 'red' ? 'yellow' : 'red';
  let aiCount = 0;
  let oppCount = 0;
  let emptyCount = 0;

  for (const p of window) {
    if (p === aiPlayer) aiCount++;
    else if (p === opponent) oppCount++;
    else emptyCount++;
  }

  if (aiCount === 4) score += 100;
  else if (aiCount === 3 && emptyCount === 1) score += 5;
  else if (aiCount === 2 && emptyCount === 2) score += 2;

  if (oppCount === 3 && emptyCount === 1) score -= 4;

  return score;
}

function scorePosition(board: Cell[][], aiPlayer: Player): number {
  let score = 0;
  
  // Center column preference
  const centerArray = [];
  for (let r = 0; r < ROWS; r++) {
    centerArray.push(board[r][Math.floor(COLS/2)].player);
  }
  const centerCount = centerArray.filter(p => p === aiPlayer).length;
  score += centerCount * 3;

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [board[r][c].player, board[r][c+1].player, board[r][c+2].player, board[r][c+3].player];
      score += evaluateWindow(window, aiPlayer);
    }
  }

  // Vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      const window = [board[r][c].player, board[r+1][c].player, board[r+2][c].player, board[r+3][c].player];
      score += evaluateWindow(window, aiPlayer);
    }
  }

  // Positive Diagonal
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [board[r][c].player, board[r+1][c+1].player, board[r+2][c+2].player, board[r+3][c+3].player];
      score += evaluateWindow(window, aiPlayer);
    }
  }

  // Negative Diagonal
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [board[r+3][c].player, board[r+2][c+1].player, board[r+1][c+2].player, board[r][c+3].player];
      score += evaluateWindow(window, aiPlayer);
    }
  }

  return score;
}

function isTerminalNode(board: Cell[][]): boolean {
  return checkWinCondition(board, 'red') || checkWinCondition(board, 'yellow') || getValidLocations(board).length === 0;
}

function minimax(board: Cell[][], depth: number, alpha: number, beta: number, maximizingPlayer: boolean, aiPlayer: Player): [number, number] {
  const validLocations = getValidLocations(board);
  const isTerminal = isTerminalNode(board);
  const opponent = aiPlayer === 'red' ? 'yellow' : 'red';

  if (depth === 0 || isTerminal) {
    if (isTerminal) {
      if (checkWinCondition(board, aiPlayer)) {
        return [-1, 10000000000000];
      } else if (checkWinCondition(board, opponent)) {
        return [-1, -10000000000000];
      } else {
        return [-1, 0];
      }
    } else {
      return [-1, scorePosition(board, aiPlayer)];
    }
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    // randomize order slightly to add variation
    let bestCol = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const row = getNextOpenRow(board, col);
      board[row][col].player = aiPlayer;
      const newScore = minimax(board, depth - 1, alpha, beta, false, aiPlayer)[1];
      board[row][col].player = null;
      if (newScore > value) {
        value = newScore;
        bestCol = col;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return [bestCol, value];
  } else {
    let value = Infinity;
    let bestCol = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const row = getNextOpenRow(board, col);
      board[row][col].player = opponent;
      const newScore = minimax(board, depth - 1, alpha, beta, true, aiPlayer)[1];
      board[row][col].player = null;
      if (newScore < value) {
        value = newScore;
        bestCol = col;
      }
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return [bestCol, value];
  }
}
