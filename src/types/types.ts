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
  players: string[];
  ships: Record<string, PlacedShip[]>;
  isStarted: boolean;
  currentTurnPlayerId: string;
};

export type Cell = { x: number; y: number };
export type PlacedShip = {
  cells: Cell[];
  hp: number;
};

export type Ship = {
  position: { x: number; y: number };
  direction: boolean;
  type: string;
  length: number;
};

export type StartGamePayload = {
  gameId: string;
  ships: Ship[];
  indexPlayer: string;
};
