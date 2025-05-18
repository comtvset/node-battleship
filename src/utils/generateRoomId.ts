let currentRoomId = 0;

export const generateRoomId = () => {
  return currentRoomId++;
};
