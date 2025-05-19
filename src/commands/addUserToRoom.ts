import { ROOMS } from '../dataBase/dataBase';
import { RoomUser } from '../types/types';

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
      return [user1, user2];
    }
  }
};
