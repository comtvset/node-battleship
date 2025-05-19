import { WebSocket } from 'ws';
import http from 'http';

import { handleMessage } from './handleMessage';
import { WSCLIENTS } from '../dataBase/dataBase';

export const openWebSocket = (ws: WebSocket, req: http.IncomingMessage) => {
  WSCLIENTS.add(ws);

  ws.on('message', (message) => {
    handleMessage(message, ws, req);
  });
};
