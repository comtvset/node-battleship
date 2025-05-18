import { USERS } from '../dataBase/usersBase';

export const getUserByWsKey = (wsKey: string) => {
  const userData = USERS.get(wsKey);

  if (!userData) {
    return null;
  }

  const { name } = userData;
  return { name };
};

export const getUserIdByName = (name: string): string | null => {
  for (const [, userData] of USERS.entries()) {
    if (userData.name === name) {
      return userData.userId;
    }
  }
  return null;
};
