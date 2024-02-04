import { faker } from '@faker-js/faker';

import { ICreateAccounAndProfileDto } from '../../models';
import { AccountRepository, ProfileRepository } from '../../repositories';
import { ErrorMessages } from '../../utils/errors';
import { AccountService } from './AccountService';

describe('account service', () => {
  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const mockAccountRepository = {
    create: jest.fn(),
  };

  const mockProfileRepository = {
    create: jest.fn(),
  };

  describe('create', () => {
    it('create a new account with profile', async () => {
      const mockAccountId = faker.string.uuid();
      const mockAccountInfo = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        handle: faker.internet.userName(),
      };

      (mockAccountRepository.create as jest.Mock).mockResolvedValueOnce(
        mockAccountId
      );

      const accountService = new AccountService(
        mockAccountRepository as any as AccountRepository,
        mockProfileRepository as any as ProfileRepository
      );

      const result = await accountService.create(mockAccountInfo);

      expect(result).toEqual(mockAccountId);
    });

    it.each([
      [{ email: faker.internet.email(), handle: faker.internet.userName() }],
      [{ email: faker.internet.email(), name: faker.person.fullName() }],
      [{ name: faker.person.fullName(), handle: faker.internet.userName() }],
      [{ email: faker.internet.email() }],
      [{ name: faker.person.fullName() }],
      [{ handle: faker.internet.userName() }],
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
          name: faker.person.fullName(),
          email: faker.internet.email(),
          handle: faker.internet.userName(),
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
});
