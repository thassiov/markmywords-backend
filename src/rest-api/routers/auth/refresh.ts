import cookie from 'cookie';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '../../../services/auth';
import { configs } from '../../../utils/configs';
import { EndpointHandlerError, ErrorMessages } from '../../../utils/errors';
import { EndpointHandler } from '../../../utils/types';

function refreshSessionHandlerFactory(
  authService: AuthService
): EndpointHandler {
  return async function refreshSessionHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');

      if (!cookies.accessToken || !cookies.refreshToken) {
        res.status(StatusCodes.UNAUTHORIZED).type('application/json').json({
          message: ErrorMessages.REQUEST_NOT_AUTHORIZED,
        });
        return;
      }

      const refreshTokenPayload = authService.verifyRefreshToken(
        cookies.refreshToken as string
      );

      if (!refreshTokenPayload) {
        res.status(StatusCodes.UNAUTHORIZED).type('application/json').json({
          message: ErrorMessages.REQUEST_NOT_AUTHORIZED,
        });
        return;
      }

      const wasInvalidaded = await authService.wasJWTTokenInvalidated(
        cookies.refreshToken
      );

      if (wasInvalidaded) {
        res.status(StatusCodes.UNAUTHORIZED).type('application/json').json({
          message: ErrorMessages.REQUEST_NOT_AUTHORIZED,
        });
        return;
      }

      await Promise.allSettled([
        authService.invalidateAccessToken(cookies.accessToken),
        authService.invalidateRefreshToken(cookies.refreshToken),
      ]);

      const tokenPayload = { accountId: refreshTokenPayload.accountId };
      const accessToken = authService.issueAccessToken(tokenPayload);
      const refreshToken = authService.issueRefreshToken(tokenPayload);

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('accessToken', accessToken, {
          httpOnly: configs.appCookiesHttpOnly,
          maxAge: configs.appCookiesAccessTokenMaxAge,
          secure: configs.appCookiesSecure,
          domain: configs.appCookiesDomain,
        })
      );

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('refreshToken', refreshToken, {
          httpOnly: configs.appCookiesHttpOnly,
          maxAge: configs.appCookiesRefreshTokenMaxAge,
          secure: configs.appCookiesSecure,
          domain: configs.appCookiesDomain,
        })
      );

      res.status(StatusCodes.OK).send();
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'refreshSessionHandler',
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

export { refreshSessionHandlerFactory };
