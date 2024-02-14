import { getMockReq, getMockRes } from '@jest-mock/express';
import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';

import { AccountService } from '../../../services/account';
import { ErrorMessages } from '../../../utils/errors';
import { removeAccountHandlerFactory } from './remove';

describe('REST: account removeAccountHandler', () => {
  const mockAccountService = {
    remove: jest.fn(),
  };

  it('should remove an account by its id', async () => {
    const removeAccountHandler = removeAccountHandlerFactory(
      mockAccountService as any as AccountService
    );
    (mockAccountService.remove as jest.Mock).mockResolvedValueOnce(true);

    const mockReq = getMockReq({
      params: { accountId: randomUUID() },
    });
    const mockRes = getMockRes().res;

    await removeAccountHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(mockRes.send).toHaveBeenCalledWith();
  });

  it('should fail to remove an account that does not exist', async () => {
    const removeAccountHandler = removeAccountHandlerFactory(
      mockAccountService as any as AccountService
    );
    (mockAccountService.remove as jest.Mock).mockResolvedValueOnce(false);

    const mockReq = getMockReq({
      params: { accountId: randomUUID() },
    });
    const mockRes = getMockRes().res;

    await removeAccountHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.COULD_NOT_DELETE_ACCOUNT,
    });
  });

  it('should fail to remove an account by providing an invalid accountId', async () => {
    const accountId = 'invalid';

    const removeAccountHandler = removeAccountHandlerFactory(
      mockAccountService as any as AccountService
    );

    const mockReq = getMockReq({
      params: { accountId },
    });
    const mockRes = getMockRes().res;

    await removeAccountHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.INVALID_ID,
    });
  });
});
