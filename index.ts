import { httpServer } from './src/http_server/index';
import 'dotenv/config';

const PORT = process.env.HTTP_PORT;

console.log(`Start static http server on the ${PORT} port!`);
httpServer.listen(PORT);
