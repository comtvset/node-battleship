import { GAMES, USER_TO_GAME } from '../dataBase/dataBase';
import { getUserById } from '../utils/getUser';
import { WebSocket } from 'ws';
import { updatWinners } from './updateWinner';
import { logOutgoing } from '../utils/logging';

export const finish = (userId: string): boolean => {
  const gameId = USER_TO_GAME.get(userId);
  if (!gameId) return false;

  const game = GAMES.get(gameId);
  if (!game) return false;

  const opponentId = game.players.find((id) => id !== userId);
  if (!opponentId) return false;

  const opponentShips = game.ships[opponentId];
  if (!opponentShips) return false;

  const isWin = opponentShips.every((ship) => ship.hp <= 0);

  if (isWin) {
    const winMessage = {
      type: 'finish',
      data: JSON.stringify({ winPlayer: userId }),
      id: 0,
    };

    const allWinners = updatWinners(userId);

    const winnersMessage = {
      type: 'update_winners',
      data: JSON.stringify(allWinners),
      id: 0,
    };

    const players = game.players.map(getUserById).filter(Boolean);

    for (const player of players) {
      const ws = player!.ws;
      if (ws?.readyState === WebSocket.OPEN) {
        logOutgoing(winMessage);
        logOutgoing(winnersMessage);
        ws.send(JSON.stringify(winMessage));
        ws.send(JSON.stringify(winnersMessage));
      }
    }

    GAMES.delete(gameId);
    USER_TO_GAME.delete(userId);
    USER_TO_GAME.delete(opponentId);
  }

  return isWin;
};
