import bcryptjs from 'bcryptjs';

import { ICreateAccounAndProfileDto } from '../../models';
import { AccountRepository, ProfileRepository } from '../../repositories';
import { ErrorMessages } from '../../utils/errors';
import { AccountService } from './AccountService';

jest.mock('bcryptjs');

describe('account service', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const mockAccountRepository = {
    create: jest.fn(),
    remove: jest.fn(),
    retrieveSafeFields: jest.fn(),
  };

  const mockProfileRepository = {
    create: jest.fn(),
    retrieveByAccountId: jest.fn(),
  };

  describe('create', () => {
    it('create a new account with profile', async () => {
      const mockAccountId = 'someaccountid';
      const mockAccountInfo = {
        name: 'somename',
        email: 'someemail@email.com',
        handle: 'somehandle',
        password: 'avalidpassword',
      };

      const mockSalt = 'salt';
      const mockHash = 'hash';
      (bcryptjs.genSalt as jest.Mock).mockResolvedValueOnce(mockSalt);
      (bcryptjs.hash as jest.Mock).mockResolvedValueOnce(mockHash);
      (mockAccountRepository.create as jest.Mock).mockResolvedValueOnce(
        mockAccountId
      );

      const accountService = new AccountService(
        mockAccountRepository as any as AccountRepository,
        mockProfileRepository as any as ProfileRepository
      );

      const result = await accountService.create(mockAccountInfo);

      expect(result).toEqual(mockAccountId);
      expect(mockAccountRepository.create).toHaveBeenCalledWith({
        email: mockAccountInfo.email,
        handle: mockAccountInfo.handle,
        password: mockHash,
      });
      expect(mockProfileRepository.create).toHaveBeenCalledWith({
        name: mockAccountInfo.name,
        accountId: mockAccountId,
      });
    });

    it.each([
      [{ email: 'someemail@email.com', handle: 'somehandle' }],
      [{ email: 'someemail@email.com', name: 'somename' }],
      [{ name: 'somename', handle: 'somehandle' }],
      [{ email: 'someemail@email.com' }],
      [{ name: 'somename' }],
      [{ handle: 'somehandle' }],
      [{}],
    ] as unknown[])(
      'fails by not sending required information (%p)',
      async (mockAccountInfo) => {
        const accountService = new AccountService(
          mockAccountRepository as any as AccountRepository,
          mockProfileRepository as any as ProfileRepository
        );

        expect(() =>
          accountService.create(mockAccountInfo as ICreateAccounAndProfileDto)
        ).rejects.toThrow(ErrorMessages.CREATE_ACCOUNT_INVALID_ACCOUNT_INFO);
      }
    );

    it.each([
      [ErrorMessages.CREATE_ACCOUNT_EMAIL_ALREADY_IN_USE],
      [ErrorMessages.CREATE_ACCOUNT_USERHANDLE_ALREADY_IN_USE],
    ])(
      'fails by trying to create an account with unique fields already in use (%p)',
      async (errorMessage) => {
        const mockAccountInfo = {
          name: 'somename',
          email: 'someemail@email.com',
          handle: 'somehandle',
          password: 'avalidpassword',
        };

        (mockAccountRepository.create as jest.Mock).mockRejectedValueOnce(
          new Error(errorMessage)
        );

        const accountService = new AccountService(
          mockAccountRepository as any as AccountRepository,
          mockProfileRepository as any as ProfileRepository
        );

        expect(() => accountService.create(mockAccountInfo)).rejects.toThrow(
          errorMessage
        );
      }
    );
  });

  describe('remove', () => {
    it('remove an existing account', async () => {
      const mockAccountId = 'someaccountid';

      (mockAccountRepository.remove as jest.Mock).mockResolvedValueOnce(true);

      const accountService = new AccountService(
        mockAccountRepository as any as AccountRepository,
        mockProfileRepository as any as ProfileRepository
      );

      const result = await accountService.remove(mockAccountId);

      expect(result).toEqual(true);
    });
  });

  describe('retrieve', () => {
    it('retrieve an existing account', async () => {
      const mockAccountId = 'someaccountid';
      const mockAccountInfo = {
        id: mockAccountId,
        handle: 'somehandle',
        email: 'someemail@email.com',
      };

      const mockProfileInfo = {
        name: 'somename',
      };

      (
        mockAccountRepository.retrieveSafeFields as jest.Mock
      ).mockResolvedValueOnce(mockAccountInfo);
      (
        mockProfileRepository.retrieveByAccountId as jest.Mock
      ).mockResolvedValueOnce(mockProfileInfo);

      const accountService = new AccountService(
        mockAccountRepository as any as AccountRepository,
        mockProfileRepository as any as ProfileRepository
      );

      const result = await accountService.retrieve(mockAccountId);

      expect(result).toEqual({ ...mockAccountInfo, ...mockProfileInfo });
    });
  });

  describe('password operations', () => {
    describe('hashing', () => {
      it('should hash a given password', async () => {
        const mockPassword = 'thispasswordissecure';
        const mockSalt = 'salt';
        const mockHash = 'hash';
        (bcryptjs.genSalt as jest.Mock).mockResolvedValueOnce(mockSalt);
        (bcryptjs.hash as jest.Mock).mockResolvedValueOnce(mockHash);

        const accountService = new AccountService(
          mockAccountRepository as any as AccountRepository,
          mockProfileRepository as any as ProfileRepository
        );

        const result = await accountService.hashPassword(mockPassword);

        expect(result).toEqual(mockHash);
        expect(bcryptjs.genSalt).toHaveBeenCalledTimes(1);
        expect(bcryptjs.hash).toHaveBeenCalledWith(mockPassword, mockSalt);
      });
    });

    describe('verifying', () => {
      it('should compare a plain text password with a hashed password', async () => {
        const mockPassword = 'thispasswordissecure';
        const mockHash = 'hash';
        (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(true);

        const accountService = new AccountService(
          mockAccountRepository as any as AccountRepository,
          mockProfileRepository as any as ProfileRepository
        );

        const result = await accountService.verifyPasswordHash(
          mockPassword,
          mockHash
        );

        expect(result).toEqual(true);
        expect(bcryptjs.compare).toHaveBeenCalledWith(mockPassword, mockHash);
      });
    });
  });
});
