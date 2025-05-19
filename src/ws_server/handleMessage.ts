import { RawData, WebSocket } from 'ws';
import { UserData } from '../types/types';
import { IncomingMessage } from 'http';
import { getUserByWsKey } from '../utils/getUser';
import { checkUser } from '../utils/checkUser';
import {
  addUserToRoom,
  createGame,
  createRoom,
  regUser,
  updateRoom,
} from '../commands/commandsReg';
import { logIncoming } from '../utils/logging';
import { randomAttack, startGame, turn } from '../commands/commandsGame';
// import { USER_TO_GAME } from '../dataBase/dataBase';

export const handleMessage = (message: RawData, ws: WebSocket, req: IncomingMessage) => {
  let userName: string;
  let password: string;
  const wsKey = req.headers['sec-websocket-key'] as string;

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

  switch (type) {
    case 'reg':
      const check = checkUser(ws, userName, password, wsKey);
      if (check instanceof Error) {
        regUser(ws, userName, password, check.message);
      } else {
        regUser(ws, userName, password, null);
      }
      logIncoming(raw);
      break;
    case 'create_room':
      logIncoming(raw);
      createRoom(userName);
      break;
    case 'add_user_to_room':
      const { data: rawData } = parsed;
      const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

      const users = addUserToRoom(userName, parsedData.indexRoom);
      if (!users) {
        return;
      }

      // console.log('MESSEGE ' + message);
      const gameId = String(parsedData.indexRoom);
      // console.log('indexRoom ' + gameId);

      // console.dir(USER_TO_GAME, { depth: null, colors: true });

      logIncoming(raw);
      createGame(users, gameId);
      break;
    case 'add_ships':
      logIncoming(raw);

      const { data } = parsed;
      const payload = typeof data === 'string' ? JSON.parse(data) : data;
      startGame(ws, payload);

      break;
    case 'randomAttack':
      if (!userInfo) return;

      logIncoming(raw);

      randomAttack(userInfo.userId);
      turn(ws, userInfo.userId);
      break;

    case 'attack':
      if (!userInfo) return;

      logIncoming(raw);

      randomAttack(userInfo.userId);
      turn(ws, userInfo.userId);
      break;
    default:
      console.warn(`Unknown message type: ${type}`);
  }
  updateRoom();
};
