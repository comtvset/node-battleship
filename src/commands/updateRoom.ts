import { ROOMS, WSCLIENTS } from '../dataBase/dataBase';
import { logOutgoing } from '../utils/logging';

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

  for (const client of WSCLIENTS) {
    if (client.readyState === WebSocket.OPEN) {
      const json = logOutgoing(response);

      client.send(json);
    }
  }
};
