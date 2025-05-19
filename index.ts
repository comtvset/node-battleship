import { httpServer } from './src/http_server/index';
import 'dotenv/config';
import { wsServer } from './src/ws_server';
import { BLUE, YELLOW } from './src/utils/constants';

const HTTP_PORT = process.env.HTTP_PORT || 8181;
const WSS_PORT = process.env.WSS_PORT || 3000;

console.log(`${BLUE}Start static http server on the ${YELLOW}${HTTP_PORT}${BLUE} port!${BLUE}`);
httpServer.listen(HTTP_PORT);

wsServer(WSS_PORT);
