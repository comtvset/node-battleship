import fs from 'fs';
import path from 'path';
import { WINNERS } from '../dataBase/dataBase';

const WINNERS_FILE = path.resolve(__dirname, '../dataBase/winners.json');

export const saveWinnersToFile = () => {
  const winnersArray = Array.from(WINNERS.values());
  fs.writeFileSync(WINNERS_FILE, JSON.stringify(winnersArray, null, 2));
};

export const loadWinnersFromFile = () => {
  if (!fs.existsSync(WINNERS_FILE)) return;

  const raw = fs.readFileSync(WINNERS_FILE, 'utf-8').trim();
  if (!raw) return;

  const data: { name: string; wins: number }[] = JSON.parse(raw);
  for (const { name, wins } of data) {
    WINNERS.set(name, { name, wins });
  }
};
