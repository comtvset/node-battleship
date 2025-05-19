import { attack } from './attack';

export const randomAttack = (userId: string) => {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  attack(userId, x, y);
};
