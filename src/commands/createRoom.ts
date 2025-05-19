import { ROOMS } from '../dataBase/dataBase';
import { RoomData } from '../types/types';
import { generateRoomId } from '../utils/generateRoomId';

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
