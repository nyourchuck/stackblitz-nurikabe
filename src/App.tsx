import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from './components/Grid';
import { PuzzleList } from './components/PuzzleList';
import { Puzzle } from './types/nurikabe';
import { Brain } from 'lucide-react';
import { parsePuzzleFile } from './utils/puzzleLoader';
import { canConnectToIsland } from './utils/islandLogic';
import { playBuzzSound } from './utils/audio';
import { validatePuzzle } from './utils/puzzleValidation';

function App() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
  const [validationState, setValidationState] = useState<
    'default' | 'valid' | 'invalid'
  >('default');
  const [buttonFlash, setButtonFlash] = useState<'none' | 'solve' | 'clear'>(
    'none'
  );

  useEffect(() => {
    // Load puzzle data
    const puzzle1Data = `-----
3---3
--1--
-----
2-1-2`;

    const puzzle2Data = `4-----
------
--2---
---1--
------
-----3`;

    const puzzle3Data = `--------
---4----
--------
--2--1--
--------
--1--2--
--------
----3---`;

    const loadedPuzzles = [
      parsePuzzleFile('1', 'Starter Puzzle', puzzle1Data),
      parsePuzzleFile('2', 'Advanced Puzzle', puzzle2Data),
      parsePuzzleFile('3', 'Expert Puzzle', puzzle3Data),
    ];

    setPuzzles(loadedPuzzles);
  }, []);

  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && hoveredCell && selectedPuzzle) {
        setSelectedPuzzle((prev) => {
          if (!prev) return prev;

          const newGrid = JSON.parse(JSON.stringify(prev.grid));
          const cell = newGrid[hoveredCell.row][hoveredCell.col];

          if (!cell.isFixed) {
            cell.isBlack = true;
            cell.hasX = false;
            cell.value = null;
            cell.isPink = false;
          }

          return { ...prev, grid: newGrid };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredCell, selectedPuzzle]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!selectedPuzzle) return;

      setSelectedPuzzle((prev) => {
        if (!prev) return prev;

        const newGrid = JSON.parse(JSON.stringify(prev.grid));
        const cell = newGrid[row][col];

        if (cell.isFixed) return prev;

        if (cell.isBlack) {
          cell.isBlack = false;
          cell.hasX = false;
          cell.value = null;
          cell.isPink = false;
        } else if (cell.hasX) {
          cell.hasX = false;
          cell.value = null;
          cell.isPink = false;
        } else {
          const islandValue = canConnectToIsland(prev, row, col);
          if (islandValue !== null) {
            cell.value = islandValue;
            cell.hasX = false;
            cell.isBlack = false;
            cell.isPink = false;
          } else {
            cell.hasX = true;
            cell.value = null;
            cell.isBlack = false;
            cell.isPink = false;
          }
        }

        return { ...prev, grid: newGrid };
      });
    },
    [selectedPuzzle]
  );

  const handleCellHover = useCallback(
    (row: number, col: number) => {
      if (!selectedPuzzle) return;

      setHoveredCell({ row, col });
      setSelectedPuzzle((prev) => {
        if (!prev) return prev;
        const newGrid = JSON.parse(JSON.stringify(prev.grid));
        newGrid[row][col].isHovered = true;
        return { ...prev, grid: newGrid };
      });
    },
    [selectedPuzzle]
  );

  const handleCellLeave = useCallback(
    (row: number, col: number) => {
      if (!selectedPuzzle) return;

      setHoveredCell(null);

      setSelectedPuzzle((prev) => {
        if (!prev) return prev;
        const newGrid = JSON.parse(JSON.stringify(prev.grid));
        newGrid[row][col].isHovered = false;
        return { ...prev, grid: newGrid };
      });
    },
    [selectedPuzzle]
  );

  const handleSolveClick = useCallback(() => {
    if (!selectedPuzzle) return;

    // Trigger button flash animation
    setButtonFlash('solve');
    setTimeout(() => setButtonFlash('none'), 200);

    // Validate the puzzle
    const isValid = validatePuzzle(selectedPuzzle);

    if (!isValid) {
      playBuzzSound();
      setValidationState('invalid');
    } else {
      setValidationState('valid');
    }

    // Force a re-render to update pink cells
    setSelectedPuzzle({ ...selectedPuzzle });
  }, [selectedPuzzle]);

  const handleClearClick = useCallback(() => {
    // Trigger button flash animation
    setButtonFlash('clear');
    setTimeout(() => setButtonFlash('none'), 200);

    // Reset validation state
    setValidationState('default');
  }, []);

  const handlePuzzleChange = useCallback(() => {
    setValidationState('default');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <Brain className="w-10 h-10 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-800">Nurikabe Puzzle</h1>
        </header>

        <div className="flex gap-8">
          <PuzzleList
            puzzles={puzzles}
            selectedPuzzle={selectedPuzzle}
            onSelect={setSelectedPuzzle}
            onPuzzleChange={handlePuzzleChange}
          />

          <div className="flex-1">
            <div className="flex flex-col items-center gap-4">
              {selectedPuzzle ? (
                <>
                  <Grid
                    puzzle={selectedPuzzle}
                    onCellClick={handleCellClick}
                    onCellHover={handleCellHover}
                    onCellLeave={handleCellLeave}
                    validationState={validationState}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleSolveClick}
                      className={`px-4 py-2 bg-blue-500 text-white rounded-md transition-all duration-200
                        ${
                          buttonFlash === 'solve'
                            ? 'bg-blue-600 scale-95'
                            : 'hover:bg-blue-600'
                        }`}
                    >
                      Check Solution
                    </button>
                    <button
                      onClick={handleClearClick}
                      className={`px-4 py-2 bg-gray-500 text-white rounded-md transition-all duration-200
                        ${
                          buttonFlash === 'clear'
                            ? 'bg-gray-600 scale-95'
                            : 'hover:bg-gray-600'
                        }`}
                    >
                      Clear
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md p-8">
                  <p className="text-gray-500 text-lg">
                    Select a puzzle from the list to begin
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
