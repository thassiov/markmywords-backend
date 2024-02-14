import cookie from 'cookie';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { loginDtoSchema } from '../../../models';
import { AccountService } from '../../../services/account';
import { AuthService } from '../../../services/auth';
import { configs } from '../../../utils/configs';
import { EndpointHandlerError, ErrorMessages } from '../../../utils/errors';
import { EndpointHandler } from '../../../utils/types';

function loginHandlerFactory(
  authService: AuthService,
  accountService: AccountService
): EndpointHandler {
  return async function loginHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!loginDtoSchema.safeParse(req.body).success) {
        res.status(StatusCodes.BAD_REQUEST).type('application/json').json({
          message: ErrorMessages.LOGIN_INVALID_DATA_INFO,
        });
        return;
      }

      const account =
        await accountService.retrieveByUserhandleOrEmailIfPasswordMatches(
          req.body.login,
          req.body.password
        );

      if (!account) {
        res.status(StatusCodes.UNAUTHORIZED).type('application/json').json({
          message: ErrorMessages.LOGIN_WRONG_USERNAME_OR_PASSWORD,
        });
        return;
      }

      const tokenPayload = { accountId: account.id };
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
          handler: 'loginHandler',
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

export { loginHandlerFactory };
