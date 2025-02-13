import { Cell, Puzzle } from '../types/nurikabe';

interface Position {
  row: number;
  col: number;
}

// Get adjacent cells (up, right, down, left)
function getAdjacentCells(grid: Cell[][], pos: Position): Position[] {
  const { row, col } = pos;
  const adjacent: Position[] = [];
  
  if (row > 0) adjacent.push({ row: row - 1, col }); // up
  if (col < grid[0].length - 1) adjacent.push({ row, col: col + 1 }); // right
  if (row < grid.length - 1) adjacent.push({ row: row + 1, col }); // down
  if (col > 0) adjacent.push({ row, col: col - 1 }); // left
  
  return adjacent;
}

// Find the root number cell of an island
function findIslandRoot(grid: Cell[][], startPos: Position, visited: Set<string>): Position | null {
  const queue: Position[] = [startPos];
  visited.add(`${startPos.row},${startPos.col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const cell = grid[current.row][current.col];

    // If we found a fixed numbered cell, this is the root
    if (cell.isFixed && cell.value !== null) {
      return current;
    }

    const adjacent = getAdjacentCells(grid, current);
    for (const adj of adjacent) {
      const key = `${adj.row},${adj.col}`;
      if (!visited.has(key)) {
        const adjCell = grid[adj.row][adj.col];
        // Only traverse through white cells (not black and has a value)
        if (!adjCell.isBlack && adjCell.value !== null) {
          queue.push(adj);
          visited.add(key);
        }
      }
    }
  }

  return null;
}

// Count only white cells in an island (cells with values)
function countIslandCells(grid: Cell[][], root: Position): number {
  const visited = new Set<string>();
  const queue: Position[] = [root];
  visited.add(`${root.row},${root.col}`);
  let count = 1; // Count the root cell

  while (queue.length > 0) {
    const current = queue.shift()!;
    const adjacent = getAdjacentCells(grid, current);

    for (const adj of adjacent) {
      const key = `${adj.row},${adj.col}`;
      if (!visited.has(key)) {
        const adjCell = grid[adj.row][adj.col];
        // Only count and traverse through white cells (not black and has a value)
        if (!adjCell.isBlack && adjCell.value !== null) {
          queue.push(adj);
          visited.add(key);
          count++;
        }
      }
    }
  }

  return count;
}

// Check if connecting to this position would create a connection between different islands
function wouldConnectDifferentIslands(grid: Cell[][], pos: Position): boolean {
  const adjacent = getAdjacentCells(grid, pos);
  const foundRoots = new Set<string>();
  
  for (const adj of adjacent) {
    const adjCell = grid[adj.row][adj.col];
    if (!adjCell.isBlack && adjCell.value !== null) {
      const root = findIslandRoot(grid, adj, new Set<string>());
      if (root) {
        foundRoots.add(`${root.row},${root.col}`);
        if (foundRoots.size > 1) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// Check if a cell can legally connect to an island
export function canConnectToIsland(puzzle: Puzzle, row: number, col: number): number | null {
  const grid = puzzle.grid;
  const pos = { row, col };
  
  // First, check if connecting here would create a connection between different islands
  if (wouldConnectDifferentIslands(grid, pos)) {
    return null;
  }
  
  const adjacent = getAdjacentCells(grid, pos);
  
  for (const adj of adjacent) {
    const adjCell = grid[adj.row][adj.col];
    
    // Look for adjacent white cells (cells with values)
    if (!adjCell.isBlack && adjCell.value !== null) {
      const root = findIslandRoot(grid, adj, new Set<string>());
      
      if (root) {
        const rootCell = grid[root.row][root.col];
        // Count only white cells in the island
        const currentWhiteCells = countIslandCells(grid, root);
        
        // Check if adding this cell would keep the island within its size limit
        // We add 1 to account for the cell being clicked
        if (currentWhiteCells + 1 <= rootCell.value!) {
          return rootCell.value!;
        }
      }
    }
  }
  
  return null;
}