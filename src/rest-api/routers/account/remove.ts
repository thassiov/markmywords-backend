import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { AccountService } from '../../../services/account';
import { EndpointHandlerError, ErrorMessages } from '../../../utils/errors';
import { EndpointHandler } from '../../../utils/types';

const accountIdSchema = z.string().uuid();

function removeAccountHandlerFactory(
  accountService: AccountService
): EndpointHandler {
  return async function removeAccountHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!accountIdSchema.safeParse(req.params.accountId).success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: ErrorMessages.INVALID_ID,
        });
        return;
      }

      const result = await accountService.remove(
        req.params.accountId as string
      );

      if (!result) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ErrorMessages.COULD_NOT_DELETE_ACCOUNT,
        });
        return;
      }

      res.status(StatusCodes.NO_CONTENT).send();
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'removeAccountHandler',
          request: {
            method: req.method,
            headers: req.headers,
            body: req.body,
            url: req.url,
          },
        },
      });
    }
  };
}

export { removeAccountHandlerFactory };
