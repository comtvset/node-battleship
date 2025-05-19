import { WebSocket } from 'ws';
import http from 'http';

import { handleMessage } from './handleMessage';
import { WSCLIENTS } from '../dataBase/dataBase';
import { RED, RESET_COLOR } from '../utils/constants';

export const openWebSocket = (ws: WebSocket, req: http.IncomingMessage) => {
  WSCLIENTS.add(ws);

  ws.on('message', (message) => {
    handleMessage(message, ws, req);
  });

  ws.on('close', () => {
    console.log(`${RED}Client disconnected${RESET_COLOR}`);
    WSCLIENTS.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    WSCLIENTS.delete(ws);
    ws.close();
  });
};
