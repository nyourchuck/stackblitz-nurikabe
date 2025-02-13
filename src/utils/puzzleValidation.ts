import { Puzzle, Cell } from '../types/nurikabe';

// Check if there's a 2x2 square of black cells
function has2x2BlackSquare(puzzle: Puzzle): boolean {
  const { rows, cols } = puzzle.size;
  
  // Check each possible 2x2 square
  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols - 1; col++) {
      const topLeft = puzzle.grid[row][col];
      const topRight = puzzle.grid[row][col + 1];
      const bottomLeft = puzzle.grid[row + 1][col];
      const bottomRight = puzzle.grid[row + 1][col + 1];
      
      if (topLeft.isBlack && topRight.isBlack && 
          bottomLeft.isBlack && bottomRight.isBlack) {
        return true;
      }
    }
  }
  
  return false;
}

// Mark all cells in an invalid island as pink
function markInvalidIsland(puzzle: Puzzle, startRow: number, startCol: number, visited: Set<string>) {
  const { rows, cols } = puzzle.size;
  const key = `${startRow},${startCol}`;
  
  if (startRow < 0 || startRow >= rows || 
      startCol < 0 || startCol >= cols ||
      visited.has(key) ||
      puzzle.grid[startRow][startCol].isBlack ||
      puzzle.grid[startRow][startCol].value === null) {
    return;
  }
  
  visited.add(key);
  puzzle.grid[startRow][startCol].isPink = true;
  
  // Check all adjacent cells
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  for (const [dx, dy] of directions) {
    markInvalidIsland(puzzle, startRow + dx, startCol + dy, visited);
  }
}

// Count connected white cells starting from a given position
function countIslandSize(puzzle: Puzzle, startRow: number, startCol: number, visited: Set<string>): number {
  const { rows, cols } = puzzle.size;
  const key = `${startRow},${startCol}`;
  
  if (startRow < 0 || startRow >= rows || 
      startCol < 0 || startCol >= cols ||
      visited.has(key) ||
      puzzle.grid[startRow][startCol].isBlack ||
      puzzle.grid[startRow][startCol].value === null) {
    return 0;
  }
  
  visited.add(key);
  let size = 1;
  
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  for (const [dx, dy] of directions) {
    size += countIslandSize(puzzle, startRow + dx, startCol + dy, visited);
  }
  
  return size;
}

// Reset all pink cells to white
function resetPinkCells(puzzle: Puzzle) {
  for (let row = 0; row < puzzle.size.rows; row++) {
    for (let col = 0; col < puzzle.size.cols; col++) {
      puzzle.grid[row][col].isPink = false;
    }
  }
}

// Verify that all islands have the correct size and mark invalid ones
function checkIslandSizes(puzzle: Puzzle): boolean {
  const visited = new Set<string>();
  let allValid = true;
  
  // Reset all pink cells first
  resetPinkCells(puzzle);
  
  for (let row = 0; row < puzzle.size.rows; row++) {
    for (let col = 0; col < puzzle.size.cols; col++) {
      const cell = puzzle.grid[row][col];
      
      if (cell.value !== null && cell.isFixed && !visited.has(`${row},${col}`)) {
        const islandSize = countIslandSize(puzzle, row, col, new Set<string>());
        if (islandSize !== cell.value) {
          markInvalidIsland(puzzle, row, col, new Set<string>());
          allValid = false;
        }
      }
    }
  }
  
  return allValid;
}

// Check if all cells are either black or have a value
function allCellsColored(puzzle: Puzzle): boolean {
  for (let row = 0; row < puzzle.size.rows; row++) {
    for (let col = 0; col < puzzle.size.cols; col++) {
      const cell = puzzle.grid[row][col];
      if (!cell.isBlack && cell.value === null) {
        return false;
      }
    }
  }
  return true;
}

export function validatePuzzle(puzzle: Puzzle): boolean {
  // First check if all cells are colored
  if (!allCellsColored(puzzle)) {
    return false;
  }
  
  // Check for 2x2 black squares
  if (has2x2BlackSquare(puzzle)) {
    return false;
  }
  
  // Check island sizes and mark invalid ones
  const validIslands = checkIslandSizes(puzzle);
  
  return validIslands;
}