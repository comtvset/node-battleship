import { BLUE, GREEN, RESET_COLOR } from './constants';

export const logIncoming = (raw: string) => {
  const parsed = JSON.parse(raw);
  const json = JSON.stringify(parsed, null, 2);
  console.log(`${BLUE}<-${RESET_COLOR} ${json}`);
  return json;
};

export const logOutgoing = (response: unknown) => {
  const json = JSON.stringify(response, null, 2);
  console.log(`${GREEN}->${RESET_COLOR} ${json}`);

  return json;
};
