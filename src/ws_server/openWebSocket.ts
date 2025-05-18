import { WebSocket } from 'ws';
import http from 'http';
import { checkUser } from '../utils/checkUser';
import { WSCLIENTS } from '../dataBase/wsClientsBase';
import { addUserToRoom, createGame, createRoom, regUser, updateRoom } from '../commands/commands';
import { UserData } from '../types/types';
import { getUserByWsKey } from '../utils/getUser';
import { logIncoming } from '../utils/logging';

export const openWebSocket = (ws: WebSocket, req: http.IncomingMessage) => {
  let userName: string;
  let password: string;
  const wsKey = req.headers['sec-websocket-key'] as string;

  WSCLIENTS.add(ws);

  ws.on('message', (message) => {
    try {
      const raw = message.toString();

      if (!raw) return;

      const parsed = JSON.parse(raw);

      let data: UserData;
      if (typeof parsed.data === 'string') {
        try {
          data = JSON.parse(parsed.data);
          userName = data.name || '';
          password = data.password || '';
        } catch {
          data = parsed.data;
        }
      } else {
        if (!data.name || !data.password) return;
        data = parsed.data;
      }

      const userInfo = getUserByWsKey(wsKey);

      if (userInfo) {
        userName = userInfo.name;
      }

      const type = parsed.type;

      if (type === 'reg') {
        const check = checkUser(ws, userName, password, wsKey);
        if (check instanceof Error) {
          regUser(ws, userName, password, check.message);
        } else {
          regUser(ws, userName, password, null);
        }
        logIncoming(raw);
      }

      if (type === 'create_room') {
        logIncoming(raw);
        createRoom(userName);
      }

      if (type === 'add_user_to_room') {
        const parsed = JSON.parse(message.toString());
        const { data } = parsed;
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

        const users = addUserToRoom(userName, parsedData.indexRoom);
        if (!users) {
          return;
        }
        logIncoming(raw);
        createGame(users);
        updateRoom();
      }

      updateRoom();

      // const wsKey = req.headers['sec-websocket-key'] as string;
      // console.log(wsKey);
    } catch (err) {
      console.error('❌ error:', err);
    }
  });
};
