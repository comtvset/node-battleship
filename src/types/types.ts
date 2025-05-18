import * as WS from 'ws';

export type UserData = {
  ws: WS.WebSocket;
  name: string;
  password: string;
  userId: string;
};

export type RoomUser = {
  name: string;
  index: number | string;
};

export type RoomDataItem = {
  roomId: number | string;
  roomUsers: RoomUser[];
};

export type RoomData = RoomDataItem[];

export type GameData = {
  idGame: number | string;
  idPlayer: number | string;
};
