import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '../../../services/auth';
import { EndpointHandlerError } from '../../../utils/errors';
import { EndpointHandler, RequestContextData } from '../../../utils/types';
import { Context } from '../../lib/requestContext';

function logoutHandlerFactory(authService: AuthService): EndpointHandler {
  return async function logoutHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const ctx = Context.get(req) as RequestContextData;

      const { accessToken, refreshToken } = ctx as {
        accessToken: string;
        refreshToken: string;
      };

      await Promise.allSettled([
        authService.invalidateAccessToken(accessToken),
        authService.invalidateRefreshToken(refreshToken),
      ]);

      res.status(StatusCodes.OK).send();
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'logoutHandler',
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

export { logoutHandlerFactory };
