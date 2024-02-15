import { getMockReq, getMockRes } from '@jest-mock/express';
import cookie from 'cookie';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '../../../services/auth';
import { configs } from '../../../utils/configs';
import { ErrorMessages } from '../../../utils/errors';
import { refreshSessionHandlerFactory } from './refresh';

jest.mock('cookie', () => {
  const original = jest.requireActual('cookie');

  return {
    ...original,
    parse: jest.fn(),
  };
});

describe('REST: session refresh refreshSessionHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const mockAuthService = {
    verifyRefreshToken: jest.fn(),
    wasJWTTokenInvalidated: jest.fn(),
    issueAccessToken: jest.fn(),
    issueRefreshToken: jest.fn(),
    invalidateAccessToken: jest.fn(),
    invalidateRefreshToken: jest.fn(),
  };

  it('should refresh an token pair with a valid refresh token', async () => {
    const mockRefreshTokenPayload = { accountId: 'someaccountid' };
    const mockOldAccessToken = 'someold.access.token';
    const mockNewAccessToken = 'somenew.access.token';
    const mockOldRefreshToken = 'someold.refresh.token';
    const mockNewRefreshToken = 'somenew.refresh.token';
    const mockCookieValues = {
      accessToken: mockOldAccessToken,
      refreshToken: mockOldRefreshToken,
    };

    (cookie.parse as jest.Mock).mockReturnValueOnce(mockCookieValues);
    (mockAuthService.verifyRefreshToken as jest.Mock).mockReturnValueOnce(
      mockRefreshTokenPayload
    );
    (mockAuthService.wasJWTTokenInvalidated as jest.Mock).mockResolvedValueOnce(
      false
    );
    (mockAuthService.invalidateAccessToken as jest.Mock).mockResolvedValueOnce(
      Promise.resolve()
    );
    (mockAuthService.invalidateRefreshToken as jest.Mock).mockResolvedValueOnce(
      Promise.resolve()
    );
    (mockAuthService.issueAccessToken as jest.Mock).mockReturnValueOnce(
      mockNewAccessToken
    );
    (mockAuthService.issueRefreshToken as jest.Mock).mockReturnValueOnce(
      mockNewRefreshToken
    );

    const refreshSessionHandler = refreshSessionHandlerFactory(
      mockAuthService as any as AuthService
    );

    const mockReq = getMockReq({ cookies: 'dont-eat-this-cookies' });
    const mockRes = getMockRes().res;

    await refreshSessionHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockRes.setHeader).toHaveBeenNthCalledWith(
      1,
      'Set-Cookie',
      `accessToken=${mockNewAccessToken}; Max-Age=${configs.appCookiesAccessTokenMaxAge}; Domain=${configs.appCookiesDomain}${configs.appCookiesHttpOnly ? '; HttpOnly' : undefined}`
    );

    expect(mockRes.setHeader).toHaveBeenNthCalledWith(
      2,
      'Set-Cookie',
      `refreshToken=${mockNewRefreshToken}; Max-Age=${configs.appCookiesRefreshTokenMaxAge}; Domain=${configs.appCookiesDomain}${configs.appCookiesHttpOnly ? '; HttpOnly' : undefined}`
    );
    expect(mockRes.send).toHaveBeenCalled();
  });

  it('should fail to refresh without the proper cookies', async () => {
    const mockOldAccessToken = 'someold.access.token';
    const mockOldRefreshToken = 'someold.refresh.token';
    const mockCookieValues = {
      accessToken1: mockOldAccessToken,
      refreshToken1: mockOldRefreshToken,
    };

    (cookie.parse as jest.Mock).mockReturnValueOnce(mockCookieValues);

    const refreshSessionHandler = refreshSessionHandlerFactory(
      mockAuthService as any as AuthService
    );

    const mockReq = getMockReq({ cookies: 'dont-eat-this-cookies' });
    const mockRes = getMockRes().res;

    await refreshSessionHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.REQUEST_NOT_AUTHORIZED,
    });
  });

  it('should fail to refresh with an invalid refresh token (eg. expired/malformed)', async () => {
    const mockOldAccessToken = 'someold.access.token';
    const mockOldRefreshToken = 'someold.refresh.token';
    const mockCookieValues = {
      accessToken: mockOldAccessToken,
      refreshToken: mockOldRefreshToken,
    };

    (cookie.parse as jest.Mock).mockReturnValueOnce(mockCookieValues);
    (mockAuthService.verifyRefreshToken as jest.Mock).mockReturnValueOnce(null);

    const refreshSessionHandler = refreshSessionHandlerFactory(
      mockAuthService as any as AuthService
    );

    const mockReq = getMockReq({ cookies: 'dont-eat-this-cookies' });
    const mockRes = getMockRes().res;

    await refreshSessionHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.REQUEST_NOT_AUTHORIZED,
    });
  });

  it('should fail to refresh with an invalidated refresh token (added to the invalid tokens table)', async () => {
    const mockRefreshTokenPayload = { accountId: 'someaccountid' };
    const mockOldAccessToken = 'someold.access.token';
    const mockOldRefreshToken = 'someold.refresh.token';
    const mockCookieValues = {
      accessToken: mockOldAccessToken,
      refreshToken: mockOldRefreshToken,
    };

    (cookie.parse as jest.Mock).mockReturnValueOnce(mockCookieValues);
    (mockAuthService.verifyRefreshToken as jest.Mock).mockReturnValueOnce(
      mockRefreshTokenPayload
    );
    (mockAuthService.wasJWTTokenInvalidated as jest.Mock).mockResolvedValueOnce(
      true
    );

    const refreshSessionHandler = refreshSessionHandlerFactory(
      mockAuthService as any as AuthService
    );

    const mockReq = getMockReq({ cookies: 'dont-eat-this-cookies' });
    const mockRes = getMockRes().res;

    await refreshSessionHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.REQUEST_NOT_AUTHORIZED,
    });
  });
});
