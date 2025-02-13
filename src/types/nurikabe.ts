export interface Cell {
  value: number | null;
  isFixed: boolean;
  isBlack: boolean;
  hasX: boolean;
  isHovered: boolean;
  isPink: boolean;
}

export interface Puzzle {
  id: string;
  name: string;
  grid: Cell[][];
  size: {
    rows: number;
    cols: number;
  };
}