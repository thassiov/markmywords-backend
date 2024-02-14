import { getMockReq, getMockRes } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';

import { AccountService } from '../../../services/account';
import { AuthService } from '../../../services/auth';
import { configs } from '../../../utils/configs';
import { ErrorMessages } from '../../../utils/errors';
import { loginHandlerFactory } from './login';

describe('REST: login loginHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const mockAuthService = {
    issueAccessToken: jest.fn(),
    issueRefreshToken: jest.fn(),
  };

  const mockAccountService = {
    retrieveByUserhandleOrEmailIfPasswordMatches: jest.fn(),
  };

  it('should login a existing user', async () => {
    const mockAccountSafeField = { accountId: 'someaccountid' };
    const mockAccessToken = 'someaccesstoken';
    const mockRefreshToken = 'somerefreshtoken';
    const mockUserhandle = 'someuserhandle';
    const mockPassword = 'somepassword';
    const mockLoginData = {
      login: mockUserhandle,
      password: mockPassword,
    };

    const loginHandler = loginHandlerFactory(
      mockAuthService as any as AuthService,
      mockAccountService as any as AccountService
    );

    (mockAuthService.issueAccessToken as jest.Mock).mockReturnValueOnce(
      mockAccessToken
    );
    (mockAuthService.issueRefreshToken as jest.Mock).mockReturnValueOnce(
      mockRefreshToken
    );
    (
      mockAccountService.retrieveByUserhandleOrEmailIfPasswordMatches as jest.Mock
    ).mockResolvedValueOnce(mockAccountSafeField);

    const mockReq = getMockReq({
      body: mockLoginData,
    });
    const mockRes = getMockRes().res;
    await loginHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockRes.setHeader).toHaveBeenNthCalledWith(
      1,
      'Set-Cookie',
      `accessToken=${mockAccessToken}; Max-Age=${configs.appCookiesAccessTokenMaxAge}; Domain=${configs.appCookiesDomain}${configs.appCookiesHttpOnly ? '; HttpOnly' : undefined}`
    );

    expect(mockRes.setHeader).toHaveBeenNthCalledWith(
      2,
      'Set-Cookie',
      `refreshToken=${mockRefreshToken}; Max-Age=${configs.appCookiesRefreshTokenMaxAge}; Domain=${configs.appCookiesDomain}${configs.appCookiesHttpOnly ? '; HttpOnly' : undefined}`
    );
    expect(mockRes.send).toHaveBeenCalled();
  });

  it('should fail by trying to match a user and password with a record in the database returns null (user does not exist or wrong password)', async () => {
    const mockUserhandle = 'someuserhandle';
    const mockPassword = 'somepassword';
    const mockLoginData = {
      login: mockUserhandle,
      password: mockPassword,
    };

    const loginHandler = loginHandlerFactory(
      mockAuthService as any as AuthService,
      mockAccountService as any as AccountService
    );

    (
      mockAccountService.retrieveByUserhandleOrEmailIfPasswordMatches as jest.Mock
    ).mockResolvedValueOnce(null);

    const mockReq = getMockReq({
      body: mockLoginData,
    });
    const mockRes = getMockRes().res;
    await loginHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.LOGIN_WRONG_USERNAME_OR_PASSWORD,
    });
  });

  it('should failt when the login request does not have the correct data format', async () => {
    const mockLoginData = {
      login1: 'someuserhandle',
      password1: 'somepassword',
    };

    const loginHandler = loginHandlerFactory(
      mockAuthService as any as AuthService,
      mockAccountService as any as AccountService
    );

    const mockReq = getMockReq({
      body: mockLoginData,
    });
    const mockRes = getMockRes().res;
    await loginHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.LOGIN_INVALID_DATA_INFO,
    });
  });
});
