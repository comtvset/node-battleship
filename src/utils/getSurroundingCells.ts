import { Cell, PlacedShip } from '../types/types';

export const getSurroundingCells = (ship: PlacedShip): Cell[] => {
  const set = new Set<string>();

  for (const { x, y } of ship.cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx}:${ny}`;

        if (!ship.cells.some((c) => c.x === nx && c.y === ny)) {
          if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
            set.add(key);
          }
        }
      }
    }
  }

  return Array.from(set).map((str) => {
    const [x, y] = str.split(':').map(Number);
    return { x, y };
  });
};
