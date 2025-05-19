import { RoomData } from '../types/types';
import { WebSocket } from 'ws';
import { generateRoomId } from '../utils/generateRoomId';
import { logOutgoing } from '../utils/logging';
import { ROOMS } from '../dataBase/dataBase';

export const reg = (ws: WebSocket, name: string, password: string, err: string) => {
  const response = {
    type: 'reg',
    data: JSON.stringify({
      name: name,
      password: password,
      error: err,
    }),
    id: 0,
  };

  const json = logOutgoing(response);
  ws.send(json);
};

export const createRoom = (userName: string) => {
  const roomId = generateRoomId();

  const room: RoomData = [
    {
      roomId: roomId,
      roomUsers: [{ name: userName, index: 0 }],
    },
  ];

  ROOMS.set(`${userName}`, room);
};
