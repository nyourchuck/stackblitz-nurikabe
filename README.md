# stackblitz-nurikabe

A basic implementation of Nurikabe Puzzles generated via AI tools.

Rules:
Paint each cell black or white, subject to the following rules:

Each numbered cell is an island cell, the number in it is the number of cells in that island.
Each island must contain exactly one numbered cell.
There must be only one sea, which is not allowed to contain "pools", i.e. 2×2 areas of black cells.

Clicking a square will toggle betwen gray (unknown) and white (known). The UI will not let you toggle a cell white if it is an invalid connection.
  
Mouse over a cell and press spacebar to turn the cell black. 

Access a working dev environment with application preview here:
[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/nyourchuck/stackblitz-nurikabe)

