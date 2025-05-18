import { WebSocketServer } from 'ws';
import { openWebSocket } from './openWebSocket';
import { BLUE, GREEN, RESET_COLOR, YELLOW } from '../utils/constants';

export const wsServer = (WSS_PORT: string | number) => {
  const wss = new WebSocketServer({ port: Number(WSS_PORT) });

  console.log(`${BLUE}WebSocket Server started with the following parameters:${RESET_COLOR}`);
  console.log(`→ ${GREEN}Port: ${YELLOW}${WSS_PORT}${RESET_COLOR}`);
  console.log(`→ ${GREEN}URL: ${YELLOW}ws://localhost:${WSS_PORT}${RESET_COLOR}`);

  wss.on('connection', openWebSocket);
};
