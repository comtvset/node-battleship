import { GAMES, USER_TO_GAME } from '../dataBase/dataBase';
import { StartGamePayload } from '../types/types';
import { getUserById } from '../utils/getUser';
import { logOutgoing } from '../utils/logging';
import { WebSocket } from 'ws';
import { turn } from './turn';

export const startGame = (ws: WebSocket, payload: StartGamePayload) => {
  const { gameId, ships, indexPlayer } = payload;

  const placedShips = ships.map((ship) => {
    const cells = [];

    for (let i = 0; i < ship.length; i++) {
      const x = ship.direction ? ship.position.x : ship.position.x + i;
      const y = ship.direction ? ship.position.y + i : ship.position.y;

      cells.push({ x, y });
    }

    return {
      cells,
      hp: cells.length,
    };
  });

  if (!GAMES.has(gameId)) {
    GAMES.set(gameId, {
      players: [indexPlayer],
      ships: { [indexPlayer]: placedShips },
      isStarted: false,
      currentTurnPlayerId: null,
    });
  } else {
    const game = GAMES.get(gameId)!;

    if (!game.players.includes(indexPlayer)) {
      game.players.push(indexPlayer);
    }

    game.ships[indexPlayer] = placedShips;

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
