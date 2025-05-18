import { ROOMS } from '../dataBase/roomsBase';
import { WSCLIENTS } from '../dataBase/wsClientsBase';
import { RoomData, RoomUser } from '../types/types';
import { WebSocket } from 'ws';
import { generateRoomId } from '../utils/generateRoomId';
import { USERS } from '../dataBase/usersBase';
import { getUserIdByName } from '../utils/getUser';
import { logOutgoing } from '../utils/logging';

export const regUser = (ws: WebSocket, name: string, password: string, err: string) => {
  const response = {
    type: 'reg',
    data: JSON.stringify({
      name: name,
      password: password,
      error: err,
    }),
    id: 0,
  };

  // const json = JSON.stringify(response, null, 2);
  // console.log(`\x1b[32m->\x1b[0m ${json}`);
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

export const updateRoom = () => {
  for (const [key, roomData] of ROOMS.entries()) {
    const filteredRooms = roomData.filter((room) => room.roomUsers.length !== 2);

    if (filteredRooms.length === 0) {
      ROOMS.delete(key);
    } else {
      ROOMS.set(key, filteredRooms);
    }
  }

  const roomArray = [...ROOMS].flatMap(([, roomData]) =>
    roomData.map((room) => ({
      roomId: room.roomId,
      roomUsers: room.roomUsers.map((user) => ({
        name: user.name,
        index: user.index,
      })),
    })),
  );

  const response = {
    type: 'update_room',
    data: JSON.stringify(roomArray),
    id: 0,
  };

  // const json = JSON.stringify(response);
  // const json = JSON.stringify(response, null, 2);

  for (const client of WSCLIENTS) {
    if (client.readyState === WebSocket.OPEN) {
      // console.log(`\x1b[32m->\x1b[0m ${json}`);
      const json = logOutgoing(response);

      client.send(json);
    }
  }
};

export const createGame = (users: string[]) => {
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
          idGame: '1',
          idPlayer: playerOneId,
        }),
        id: 0,
      };
      const json = logOutgoing(response);

      user.ws.send(JSON.stringify(json));
    }

    if (user.name === playerTwo && user.ws.readyState === WebSocket.OPEN) {
      const response = {
        type: 'create_game',
        data: JSON.stringify({
          idGame: '1',
          idPlayer: playerTwoId,
        }),
        id: 0,
      };
      const json = logOutgoing(response);

      user.ws.send(JSON.stringify(json));
    }
  }
};

export const addUserToRoom = (userName: string, roomId: string) => {
  const roomUser: RoomUser = {
    name: userName,
    index: 1,
  };

  for (const [owner, rooms] of ROOMS.entries()) {
    const room = rooms.find((r) => r.roomId === roomId);
    if (room) {
      if (owner === userName) {
        return;
      }

      const alreadyExists = room.roomUsers.some((u) => u.name === roomUser.name);
      if (!alreadyExists) {
        room.roomUsers.push(roomUser);
      }

      ROOMS.set(owner, rooms);

      if (ROOMS.has(userName)) {
        ROOMS.delete(userName);
      }

      const user1 = owner;
      const user2 = userName;
      // console.log(JSON.stringify([...ROOMS], null, 2));
      return [user1, user2];
    }
  }
};
