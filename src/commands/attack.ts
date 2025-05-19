import { GAMES, USER_TO_GAME } from '../dataBase/dataBase';
import { getUserById } from '../utils/getUser';
import { logOutgoing } from '../utils/logging';
import { WebSocket } from 'ws';
import { Cell, PlacedShip } from '../types/types';
import { turn } from './turn';

export const attack = (userId: string, x: number, y: number) => {
  const gameId = USER_TO_GAME.get(userId);
  if (!gameId) return;

  const game = GAMES.get(gameId);
  if (!game || !game.isStarted || game.currentTurnPlayerId !== userId) return;

  if (x < 0 || y < 0 || x > 9 || y > 9) {
    console.warn('Invalid attack coordinates:', x, y);
    return;
  }

  const opponentId = game.players.find((id) => id !== userId);
  if (!opponentId) return;

  const ships: PlacedShip[] = game.ships[opponentId];
  let status: 'miss' | 'shot' | 'killed' = 'miss';
  let hitShip: PlacedShip | null = null;
  let hitCell: Cell | null = null;

  for (const ship of ships) {
    for (const cell of ship.cells) {
      if (cell.x === x && cell.y === y) {
        hitShip = ship;
        hitCell = cell;
        break;
      }
    }
    if (hitCell) break;
  }

  const feedback = (position: Cell, result: 'miss' | 'shot' | 'killed') => {
    const response = {
      type: 'attack',
      data: JSON.stringify({
        position,
        currentPlayer: userId,
        status: result,
      }),
      id: 0,
    };
    logOutgoing(response);
    for (const pid of game.players) {
      const ws = getUserById(pid)?.ws;
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(response));
      }
    }
  };

  if (hitCell && hitShip) {
    hitShip.hp = Math.max(0, hitShip.hp - 1);
    status = hitShip.hp === 0 ? 'killed' : 'shot';
    feedback({ x, y }, status);

    if (status === 'killed') {
      const surrounding = getSurroundingCells(hitShip);
      for (const pos of surrounding) {
        feedback(pos, 'miss');
      }
    }
  } else {
    feedback({ x, y }, 'miss');
    status = 'miss';
  }

  if (status === 'miss') {
    turn(getUserById(userId)?.ws, userId);
  }
};

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
