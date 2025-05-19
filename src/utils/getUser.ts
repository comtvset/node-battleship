import { USERS } from '../dataBase/dataBase';

export const getUserByWsKey = (wsKey: string) => {
  const userData = USERS.get(wsKey);

  if (!userData) {
    return null;
  }

  const { name, userId } = userData;
  return { name, userId };
};

export const getUserIdByName = (name: string): string | null => {
  for (const [, userData] of USERS.entries()) {
    if (userData.name === name) {
      return userData.userId;
    }
  }
  return null;
};

export const getUserById = (userId: string) => {
  for (const [, user] of USERS.entries()) {
    if (user.userId === userId) {
      return user;
    }
  }
  return null;
};
