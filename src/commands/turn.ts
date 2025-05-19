import { GAMES, USER_TO_GAME } from '../dataBase/dataBase';
import { getUserById } from '../utils/getUser';
import { logOutgoing } from '../utils/logging';

import { WebSocket } from 'ws';

export const turn = (ws: WebSocket, userId: string) => {
  const gameId = USER_TO_GAME.get(userId);
  if (!gameId) return;

  const game = GAMES.get(gameId);
  if (!game) return;

  const currentIndex = game.players.indexOf(userId);
  const nextIndex = (currentIndex + 1) % game.players.length;
  game.currentTurnPlayerId = game.players[nextIndex];

  const response = {
    type: 'turn',
    data: JSON.stringify({
      currentPlayer: game.currentTurnPlayerId,
    }),
    id: 0,
  };

  const json = JSON.stringify(response);
  logOutgoing(response);

  for (const playerId of game.players) {
    const player = getUserById(playerId);
    if (player?.ws.readyState === WebSocket.OPEN) {
      player.ws.send(json);
    }
  }
};
