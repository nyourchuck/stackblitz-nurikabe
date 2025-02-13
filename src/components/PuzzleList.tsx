import React from 'react';
import { Puzzle } from '../types/nurikabe';

interface PuzzleListProps {
  puzzles: Puzzle[];
  onSelect: (puzzle: Puzzle) => void;
  selectedPuzzle: Puzzle | null;
  onPuzzleChange: () => void;
}

export function PuzzleList({ puzzles, onSelect, selectedPuzzle, onPuzzleChange }: PuzzleListProps) {
  const handlePuzzleSelect = (puzzle: Puzzle) => {
    onSelect(puzzle);
    onPuzzleChange();
  };

  return (
    <div className="flex flex-col gap-2 w-64 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Available Puzzles</h2>
      {puzzles.map((puzzle) => (
        <button
          key={puzzle.id}
          onClick={() => handlePuzzleSelect(puzzle)}
          className={`
            p-2 rounded-md transition-colors duration-200
            ${selectedPuzzle?.id === puzzle.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }
          `}
        >
          {puzzle.name}
        </button>
      ))}
    </div>
  );
}