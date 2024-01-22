import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { configs } from '../utils/configs';
import { logger } from '../utils/logger';
import { router } from './routers';

const api = express();

// @TODO enable compression
api.use(express.json({ limit: '100kb' }));
api.use(express.urlencoded({ limit: '100kb' }));
api.use(pinoHttp());
api.use(cors());
api.use(helmet());
api.use(router);

function startApi() {
  api.listen(configs.apiPort, () =>
    logger.info(`Server started at http://0.0.0.0:${configs.apiPort}`)
  );
}

export { startApi };
