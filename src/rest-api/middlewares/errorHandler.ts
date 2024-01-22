import { NextFunction, Request, Response } from 'express';

import { configs } from '../../utils/configs';
import { logger } from '../../utils/logger';

function errorHandler(
  err: Error,
  _r: Request,
  res: Response,
  _n: NextFunction
): void {
  // @TODO I need to process this output

  logger.error(err.stack);

  const statusCode = (err as any).statusCode || 500;

  const message =
    configs.appEnvironment == 'production'
      ? 'Internal Server Error'
      : err.message;

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  });
}

export { errorHandler };
