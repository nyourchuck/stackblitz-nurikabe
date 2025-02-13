import { Puzzle, Cell } from '../types/nurikabe';

export function parsePuzzleFile(id: string, name: string, content: string): Puzzle {
  const lines = content.trim().split('\n');
  const rows = lines.length;
  const cols = lines[0].length;

  const grid: Cell[][] = Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({
      value: null,
      isFixed: false,
      isBlack: false,
      hasX: false,
      isHovered: false,
      isPink: false,
    }))
  );

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const char = lines[row][col];
      if (char !== '-') {
        const value = parseInt(char, 10);
        if (!isNaN(value)) {
          grid[row][col].value = value;
          grid[row][col].isFixed = true;
        }
      }
    }
  }

  return {
    id,
    name,
    size: { rows, cols },
    grid,
  };
}