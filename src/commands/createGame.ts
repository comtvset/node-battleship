import { USERS } from '../dataBase/dataBase';
import { getUserIdByName } from '../utils/getUser';
import { logOutgoing } from '../utils/logging';

export const createGame = (users: string[], gameId: string) => {
  const [playerOne, playerTwo] = users;
  const playerOneId = getUserIdByName(playerOne);
  const playerTwoId = getUserIdByName(playerTwo);

  if (!playerOneId || !playerTwoId || playerOne === playerTwo) {
    return;
  }

  for (const [, user] of USERS.entries()) {
    if (user.name === playerOne && user.ws.readyState === WebSocket.OPEN) {
      const response = {
        type: 'create_game',
        data: JSON.stringify({
          idGame: gameId,
          idPlayer: playerOneId,
        }),
        id: 0,
      };
      const json = logOutgoing(response);

      user.ws.send(json);
    }

    if (user.name === playerTwo && user.ws.readyState === WebSocket.OPEN) {
      const response = {
        type: 'create_game',
        data: JSON.stringify({
          idGame: gameId,
          idPlayer: playerTwoId,
        }),
        id: 0,
      };
      const json = logOutgoing(response);

      user.ws.send(json);
    }
  }
};
