import { getMockReq, getMockRes } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '../../../services/auth';
import { RequestContextData } from '../../../utils/types';
import { Context } from '../../lib/requestContext';
import { logoutHandlerFactory } from './logout';

describe('REST: logout logoutHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const mockAuthService = {
    invalidateAccessToken: jest.fn(),
    invalidateRefreshToken: jest.fn(),
  };

  it('should logout a user (invalidates access token)', async () => {
    const mockAccessToken = 'some.access.token';
    const mockRefreshToken = 'some.refresh.token';
    const mockReq = getMockReq();
    const mockRes = getMockRes().res;
    Context.bind(mockReq);
    const mockContext = Context.get(mockReq) as RequestContextData;
    mockContext.accessToken = mockAccessToken;
    mockContext.refreshToken = mockRefreshToken;

    (mockAuthService.invalidateAccessToken as jest.Mock).mockResolvedValueOnce(
      Promise.resolve()
    );
    (mockAuthService.invalidateRefreshToken as jest.Mock).mockResolvedValueOnce(
      Promise.resolve()
    );

    const logoutHandler = logoutHandlerFactory(
      mockAuthService as any as AuthService
    );

    await logoutHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockRes.send).toHaveBeenCalled();
  });

  // I want to make sure invalidation happens even with an invalid refresh token but a valida access token
  it('should logout a user with an invalid refresh token (invalidates access token)', async () => {
    const mockAccessToken = 'some.access.token';
    const mockRefreshToken = 'some.refresh.token';
    const mockReq = getMockReq();
    const mockRes = getMockRes().res;
    Context.bind(mockReq);
    const mockContext = Context.get(mockReq) as RequestContextData;
    mockContext.accessToken = mockAccessToken;
    mockContext.refreshToken = mockRefreshToken;

    (mockAuthService.invalidateAccessToken as jest.Mock).mockResolvedValueOnce(
      Promise.resolve()
    );
    (mockAuthService.invalidateRefreshToken as jest.Mock).mockResolvedValueOnce(
      Promise.reject(new Error('Invalid refresh token'))
    );

    const logoutHandler = logoutHandlerFactory(
      mockAuthService as any as AuthService
    );

    await logoutHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockRes.send).toHaveBeenCalled();
  });
});
