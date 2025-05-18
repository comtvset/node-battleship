import { randomUUID } from 'crypto';
import { USERS } from '../dataBase/usersBase';
import { WebSocket } from 'ws';

export const checkUser = (ws: WebSocket, name: string, password: string, wsKey: string) => {
  for (const [, userData] of USERS.entries()) {
    if (userData.name === name) {
      if (userData.password === password) {
        userData.ws = ws;
        return new Error('A user with this name is already logged in');
      } else {
        return new Error(
          'A user with this name is already logged in, but with a different password',
        );
      }
    }
  }

  const userId = randomUUID();
  USERS.set(wsKey, { name, password, ws, userId });

  return userId;
};
