import { GAMES, USER_TO_GAME } from '../dataBase/dataBase';
import { getUserById } from '../utils/getUser';
import { logOutgoing } from '../utils/logging';
import { WebSocket } from 'ws';
import { Cell, PlacedShip } from '../types/types';
import { turn } from './turn';
import { getSurroundingCells } from '../utils/getSurroundingCells';
import { finish } from './finish';

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

    if (finish(userId)) return;
  } else {
    feedback({ x, y }, 'miss');
    status = 'miss';
  }

  if (status === 'miss') {
    turn(getUserById(userId)?.ws, userId);
  }
};
