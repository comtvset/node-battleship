import { GAMES, USER_TO_GAME } from '../dataBase/dataBase';
import { StartGamePayload } from '../types/types';
import { getUserById } from '../utils/getUser';
import { logOutgoing } from '../utils/logging';
import { WebSocket } from 'ws';

export const startGame = (ws: WebSocket, payload: StartGamePayload) => {
  const { gameId, ships, indexPlayer } = payload;

  if (!GAMES.has(gameId)) {
    GAMES.set(gameId, {
      players: [indexPlayer],
      ships: { [indexPlayer]: ships },
      isStarted: false,
      currentTurnPlayerId: null,
    });
  } else {
    const game = GAMES.get(gameId)!;

    if (!game.players.includes(indexPlayer)) {
      game.players.push(indexPlayer);
    }

    game.ships[indexPlayer] = ships;

    const playersReady = game.players.every((playerId) => game.ships[playerId]);

    if (playersReady && !game.isStarted) {
      game.isStarted = true;

      game.currentTurnPlayerId = game.players[0];
      turn(getUserById(game.currentTurnPlayerId)?.ws, game.currentTurnPlayerId);

      for (const playerId of game.players) {
        const player = getUserById(playerId);
        if (player?.ws.readyState === WebSocket.OPEN) {
          const response = {
            type: 'start_game',
            data: JSON.stringify({
              ships: game.ships[playerId],
              currentPlayerIndex: game.currentTurnPlayerId,
            }),
            id: 0,
          };

          logOutgoing(response);
          player.ws.send(JSON.stringify(response));
        }
      }
    }
  }

  USER_TO_GAME.set(indexPlayer, gameId);
};

export const turn = (ws: WebSocket, userId: string) => {
  const gameId = USER_TO_GAME.get(userId);
  if (!gameId) return;

  const game = GAMES.get(gameId);
  if (!game) return;

  if (game.currentTurnPlayerId !== userId) {
    return;
  }

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

export const randomAttack = (userId: string) => {
  console.log('randomAttack userId:', userId);
  console.log('USER_TO_GAME map:', [...USER_TO_GAME.entries()]);
  console.log('USER_TO_GAME.has(userId):', USER_TO_GAME.has(userId));
  console.log('gameId:', USER_TO_GAME.get(userId));
};
