import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { configs } from '../utils/configs';
import { logger } from '../utils/logger';
import { Services } from '../utils/types';
import { setupRouter } from './routers';

const api = express();

function startApi(services: Services) {
  // @TODO enable compression
  api.use(express.json({ limit: '100kb' }));
  api.use(express.urlencoded({ limit: '100kb' }));
  api.use(pinoHttp());
  api.use(cors());
  api.use(helmet());

  const router = setupRouter(services);

  api.use('/v1', router);

  api.listen(configs.apiPort, () =>
    logger.info(`Server started at http://0.0.0.0:${configs.apiPort}`)
  );
}

export { startApi };
