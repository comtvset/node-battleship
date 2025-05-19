import { WINNERS } from '../dataBase/dataBase';
import { WinnerRecord } from '../types/types';
import { saveWinnersToFile } from '../utils/fs';
import { getUserById } from '../utils/getUser';

export const updatWinners = (userId: string): WinnerRecord[] => {
  const user = getUserById(userId);
  if (!user) throw new Error(`User not found: ${userId}`);

  const existing = WINNERS.get(userId);

  if (existing) {
    existing.wins += 1;
  } else {
    WINNERS.set(userId, { name: user.name, wins: 1 });
  }

  saveWinnersToFile();

  return Array.from(WINNERS.values());
};
