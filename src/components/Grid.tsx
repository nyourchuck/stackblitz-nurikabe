import React from 'react';
import { Cell as CellComponent } from './Cell';
import { Puzzle } from '../types/nurikabe';

interface GridProps {
  puzzle: Puzzle;
  onCellClick: (row: number, col: number) => void;
  onCellHover: (row: number, col: number) => void;
  onCellLeave: (row: number, col: number) => void;
  validationState: 'default' | 'valid' | 'invalid';
}

export function Grid({ puzzle, onCellClick, onCellHover, onCellLeave, validationState }: GridProps) {
  const getBorderColor = () => {
    switch (validationState) {
      case 'valid':
        return 'bg-green-500';
      case 'invalid':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div 
      className={`grid gap-0.5 p-0.5 rounded-lg transition-colors duration-300 ${getBorderColor()}`}
      style={{
        gridTemplateColumns: `repeat(${puzzle.size.cols}, minmax(0, 1fr))`,
      }}
    >
      {puzzle.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <CellComponent
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onHover={() => onCellHover(rowIndex, colIndex)}
            onLeave={() => onCellLeave(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}