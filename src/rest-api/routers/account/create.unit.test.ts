import { getMockReq, getMockRes } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';

import { AccountService } from '../../../services/account';
import { ErrorMessages } from '../../../utils/errors';
import { createAccountHandlerFactory } from './create';

describe('REST: account create', () => {
  const mockAccountService = {
    create: jest.fn(),
  };

  it('should create a new account', async () => {
    const mockAccountInfo = {
      handle: 'somehandler',
      name: 'some name',
      email: 'thisemail@is.fake',
    };

    const createAccountHandler = createAccountHandlerFactory(
      mockAccountService as any as AccountService
    );
    (mockAccountService.create as jest.Mock).mockResolvedValueOnce('someid');

    const mockReq = getMockReq({
      body: mockAccountInfo,
    });
    const mockRes = getMockRes().res;
    await createAccountHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      id: 'someid',
    });
  });

  it('should fail by sending invalid data format', async () => {
    const mockAccountInfo = {
      handle1: 'somehandler',
      name1: 'some name',
      email1: 'thisemail@is.fake',
    };

    const createAccountHandler = createAccountHandlerFactory(
      mockAccountService as any as AccountService
    );

    const mockReq = getMockReq({
      body: mockAccountInfo,
    });
    const mockRes = getMockRes().res;
    await createAccountHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.CREATE_ACCOUNT_INVALID_ACCOUNT_INFO,
    });
  });

  it.each([
    [ErrorMessages.CREATE_ACCOUNT_EMAIL_ALREADY_IN_USE],
    [ErrorMessages.CREATE_ACCOUNT_USERHANDLE_ALREADY_IN_USE],
  ] as unknown[])(
    'fails by trying to create an account with unique fields already in use (%p)',
    async (errorMessage) => {
      const mockAccountInfo = {
        handle: 'somehandler',
        name: 'some name',
        email: 'thisemail@is.fake',
      };

      (mockAccountService.create as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage as string)
      );

      const createAccountHandler = createAccountHandlerFactory(
        mockAccountService as any as AccountService
      );

      const mockReq = getMockReq({
        body: mockAccountInfo,
      });
      const mockRes = getMockRes().res;
      await createAccountHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
      expect(mockRes.type).toHaveBeenCalledWith('application/json');
      expect(mockRes.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
    }
  );
});
