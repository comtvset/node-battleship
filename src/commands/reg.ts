import { WebSocket } from 'ws';
import { logOutgoing } from '../utils/logging';

export const reg = (ws: WebSocket, name: string, password: string, err: string) => {
  const response = {
    type: 'reg',
    data: JSON.stringify({
      name: name,
      password: password,
      error: err,
    }),
    id: 0,
  };

  const json = logOutgoing(response);
  ws.send(json);
};
