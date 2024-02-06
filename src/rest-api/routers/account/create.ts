import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createAccountDtoSchema } from '../../../models';
import { AccountService } from '../../../services/account';
import { EndpointHandlerError, ErrorMessages } from '../../../utils/errors';
import { EndpointHandler } from '../../../utils/types';

function createAccountHandlerFactory(
  accountService: AccountService
): EndpointHandler {
  return async function createAccountHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!createAccountDtoSchema.safeParse(req.body).success) {
        res.status(StatusCodes.BAD_REQUEST).type('application/json').json({
          message: ErrorMessages.CREATE_ACCOUNT_INVALID_ACCOUNT_INFO,
        });
        return;
      }

      const result = await accountService.create(req.body);

      res
        .status(StatusCodes.CREATED)
        .type('application/json')
        .json({ id: result });
      return;
    } catch (error) {
      const errorMessage = (error as Error).message;

      if (
        errorMessage.includes(ErrorMessages.CREATE_ACCOUNT_EMAIL_ALREADY_IN_USE)
      ) {
        res.status(StatusCodes.CONFLICT).type('application/json').json({
          message: ErrorMessages.CREATE_ACCOUNT_EMAIL_ALREADY_IN_USE,
        });
        return;
      }

      if (
        errorMessage.includes(
          ErrorMessages.CREATE_ACCOUNT_USERHANDLE_ALREADY_IN_USE
        )
      ) {
        res.status(StatusCodes.CONFLICT).type('application/json').json({
          message: ErrorMessages.CREATE_ACCOUNT_USERHANDLE_ALREADY_IN_USE,
        });
        return;
      }

      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'createAccountHandler',
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

export { createAccountHandlerFactory };
