import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { configs } from '../../utils/configs';
import { CustomError } from '../../utils/errors';
import { logger } from '../../utils/logger';

function errorHandler(
  err: Error,
  _r: Request,
  res: Response,
  _n: NextFunction
): void {
  const details = err instanceof CustomError ? err.unwrapCause() : err;
  logger.error(details);

  let payload = {} as { message: string; details?: Error };

  if (configs.appEnvironment === 'production') {
    payload.message = 'Internal Server Error';
  } else {
    payload.message = err.message;
    payload.details = details;
  }

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .type('application/json')
    .json(payload);
  return;
}

export { errorHandler };
