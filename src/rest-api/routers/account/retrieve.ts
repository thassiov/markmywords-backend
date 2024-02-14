import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { AccountService } from '../../../services/account';
import { EndpointHandlerError, ErrorMessages } from '../../../utils/errors';
import { EndpointHandler } from '../../../utils/types';

const accountIdSchema = z.string().uuid();

// @TODO I don't know if this handler should exist...
function retrieveAccountHandlerFactory(
  accountService: AccountService
): EndpointHandler {
  return async function retrieveAccountHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!accountIdSchema.safeParse(req.params.accountId).success) {
        res.status(StatusCodes.BAD_REQUEST).type('application/json').json({
          message: ErrorMessages.INVALID_ID,
        });
        return;
      }

      const account = await accountService.retrieve(
        req.params.accountId as string
      );

      if (!account) {
        res.status(StatusCodes.NOT_FOUND).type('application/json').json({
          message: ErrorMessages.ACCOUNT_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCodes.OK).json({ profile: account });
      return;
    } catch (error) {
      const errorMessage = (error as Error).message;

      if (errorMessage.includes('not found')) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: ErrorMessages.ACCOUNT_NOT_FOUND,
        });
        return;
      }

      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'retrieveAccountHandler',
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

export { retrieveAccountHandlerFactory };
