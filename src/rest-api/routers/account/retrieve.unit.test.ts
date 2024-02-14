import { getMockReq, getMockRes } from '@jest-mock/express';
import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';

import { AccountService } from '../../../services/account';
import { ErrorMessages, NotFoundError } from '../../../utils/errors';
import { retrieveAccountHandlerFactory } from './retrieve';

describe('REST: account retrieveAccountHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const mockAccountService = {
    retrieve: jest.fn(),
  };

  it('should retrieve an existing account', async () => {
    const mockAccount = {
      id: 'someaccountid',
      email: 'someemail@email.com',
      handle: 'somehandle',
      name: 'somename',
    };

    const retrieveAccountHandler = retrieveAccountHandlerFactory(
      mockAccountService as any as AccountService
    );

    (mockAccountService.retrieve as jest.Mock).mockResolvedValueOnce(
      mockAccount
    );

    const mockReq = getMockReq({
      params: { accountId: randomUUID() },
    });
    const mockRes = getMockRes().res;

    await retrieveAccountHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockRes.json).toHaveBeenCalledWith({ profile: mockAccount });
  });

  it('should fail by providing a account id with invalid format', async () => {
    const mockAccountId = 'someaccountid';

    const retrieveAccountHandler = retrieveAccountHandlerFactory(
      mockAccountService as any as AccountService
    );

    const mockReq = getMockReq({
      params: { accountId: mockAccountId },
    });
    const mockRes = getMockRes().res;

    await retrieveAccountHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.INVALID_ID,
    });
  });

  it('should fail by trying to retrieve an account that does not exist', async () => {
    const retrieveAccountHandler = retrieveAccountHandlerFactory(
      mockAccountService as any as AccountService
    );

    (mockAccountService.retrieve as jest.Mock).mockRejectedValueOnce(
      new NotFoundError(ErrorMessages.ACCOUNT_NOT_FOUND)
    );

    const mockReq = getMockReq({
      params: { accountId: randomUUID() },
    });
    const mockRes = getMockRes().res;

    await retrieveAccountHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.ACCOUNT_NOT_FOUND,
    });
  });
});
