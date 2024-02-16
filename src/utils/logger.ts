import pino from 'pino';
import pinoPretty from 'pino-pretty';

import { configs } from './configs';

const prettyLog = pinoPretty({
  colorize: true,
  sync: true,
});

const logger = pino(
  configs.appEnvironment !== 'production' ? prettyLog : undefined
);

export { logger, prettyLog };
