import { getMockReq, getMockRes } from '@jest-mock/express';
import cookie from 'cookie';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '../../services/auth';
import { ErrorMessages } from '../../utils/errors';
import { RequestContextData } from '../../utils/types';
import { Context } from '../lib/requestContext';
import { requiresAuthenticationMiddlewareFactory } from './requiresAuthentication';

jest.mock('cookie');

describe('REST: middleware requiresAuthentication', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const mockAuthService = {
    verifyAccessToken: jest.fn(),
    wasJWTTokenInvalidated: jest.fn(),
  };

  it('should allow the request to continue with a valid accessToken', async () => {
    const mockAccessTokenPayload = { accountId: 'someaccountid' };
    const mockCookieValues = {
      accessToken: 'some.access.token',
      refreshToken: 'some.refresh.token',
    };

    (cookie.parse as jest.Mock).mockReturnValueOnce(mockCookieValues);
    (mockAuthService.verifyAccessToken as jest.Mock).mockReturnValueOnce(
      mockAccessTokenPayload
    );
    (mockAuthService.wasJWTTokenInvalidated as jest.Mock).mockResolvedValueOnce(
      false
    );

    const requiresAuthentication = requiresAuthenticationMiddlewareFactory(
      mockAuthService as any as AuthService
    );

    const mockReq = getMockReq({ cookies: 'dont-eat-this-cookies' });
    const mockRes = getMockRes().res;
    const mockNext = getMockRes().next;
    Context.bind(mockReq);

    await requiresAuthentication(mockReq, mockRes, mockNext);

    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.type).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
    expect((Context.get(mockReq) as RequestContextData).accountId).toEqual(
      mockAccessTokenPayload.accountId
    );
    expect((Context.get(mockReq) as RequestContextData).accessToken).toEqual(
      mockCookieValues.accessToken
    );
    expect((Context.get(mockReq) as RequestContextData).refreshToken).toEqual(
      mockCookieValues.refreshToken
    );
  });

  it('should prevent the request to continue with an invalid accessToken (eg. expired/malformed)', async () => {
    const mockCookieValues = {
      accessToken: 'some.access.token',
      refreshToken: 'some.refresh.token',
    };

    (cookie.parse as jest.Mock).mockReturnValueOnce(mockCookieValues);
    (mockAuthService.verifyAccessToken as jest.Mock).mockReturnValueOnce(null);

    const requiresAuthentication = requiresAuthenticationMiddlewareFactory(
      mockAuthService as any as AuthService
    );

    const mockReq = getMockReq({ cookies: 'dont-eat-this-cookies' });
    const mockRes = getMockRes().res;
    const mockNext = getMockRes().next;
    Context.bind(mockReq);

    await requiresAuthentication(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.REQUEST_NOT_AUTHORIZED,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should prevent the request to continue with an invalidated accessToken (added to the invalid tokens table)', async () => {
    const mockAccessTokenPayload = { accountId: 'someaccountid' };
    const mockCookieValues = {
      accessToken: 'some.access.token',
      refreshToken: 'some.refresh.token',
    };

    (cookie.parse as jest.Mock).mockReturnValueOnce(mockCookieValues);
    (mockAuthService.verifyAccessToken as jest.Mock).mockReturnValueOnce(
      mockAccessTokenPayload
    );
    (mockAuthService.wasJWTTokenInvalidated as jest.Mock).mockResolvedValueOnce(
      true
    );

    const requiresAuthentication = requiresAuthenticationMiddlewareFactory(
      mockAuthService as any as AuthService
    );

    const mockReq = getMockReq({ cookies: 'dont-eat-this-cookies' });
    const mockRes = getMockRes().res;
    const mockNext = getMockRes().next;
    Context.bind(mockReq);

    await requiresAuthentication(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.REQUEST_NOT_AUTHORIZED,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
