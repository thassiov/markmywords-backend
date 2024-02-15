import cookie from 'cookie';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '../../services/auth';
import { ApiMiddlewareError, ErrorMessages } from '../../utils/errors';
import { ApiMiddleware } from '../../utils/types';
import { Context } from '../lib/requestContext';

function requiresAuthenticationMiddlewareFactory(
  authService: AuthService
): ApiMiddleware {
  return async function requiresAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');

      if (!cookies.accessToken || !cookies.refreshToken) {
        res.status(StatusCodes.UNAUTHORIZED).type('application/json').json({
          message: ErrorMessages.REQUEST_NOT_AUTHORIZED,
        });
        return;
      }

      const accessTokenPayload = authService.verifyAccessToken(
        cookies.accessToken as string
      );

      if (!accessTokenPayload) {
        res.status(StatusCodes.UNAUTHORIZED).type('application/json').json({
          message: ErrorMessages.REQUEST_NOT_AUTHORIZED,
        });
        return;
      }

      const wasInvalidaded = await authService.wasJWTTokenInvalidated(
        cookies.accessToken
      );

      if (wasInvalidaded) {
        res.status(StatusCodes.UNAUTHORIZED).type('application/json').json({
          message: ErrorMessages.REQUEST_NOT_AUTHORIZED,
        });
        return;
      }

      const ctx = Context.get(req);

      if (!ctx) {
        throw new ApiMiddlewareError(
          'Could not fetch context object for the isAuthorized middleware'
        );
      }

      ctx.accountId = accessTokenPayload.accountId;
      ctx.accessToken = cookies.accessToken;
      ctx.refreshToken = cookies.refreshToken;

      next();
    } catch (error) {
      throw new ApiMiddlewareError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'isAuthorized',
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

export { requiresAuthenticationMiddlewareFactory };
