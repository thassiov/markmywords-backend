import { Sequelize, Transaction } from 'sequelize';

import { AccountModel } from '../../models';
import { ErrorMessages } from '../../utils/errors';
import { AccountRepository } from './AccountRepository';

jest.mock('sequelize');

describe('Account Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new account', async () => {
      const mockAccountId = 'someaccountid';
      const mockAccountInfo = {
        email: 'someemail@email.com',
        handle: 'somehandle',
        password: 'somepassword',
      };

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(AccountModel, 'create').mockResolvedValueOnce({
        get: () => mockAccountId,
      });

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(AccountModel);

      const accountRepository = new AccountRepository(sequelize);

      const result = await accountRepository.create(mockAccountInfo);

      expect(result).toEqual(mockAccountId);
    });
  });

  describe('remove', () => {
    it('should remove a account', async () => {
      const mockAccountId = 'someaccountid';

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(AccountModel, 'destroy').mockResolvedValueOnce(1);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(AccountModel);

      const accountRepository = new AccountRepository(sequelize);

      const result = await accountRepository.remove(mockAccountId);

      expect(result).toEqual(true);
    });

    it('should remove a account', async () => {
      const mockAccountId = 'someaccountid';

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(AccountModel, 'destroy').mockResolvedValueOnce(1);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(AccountModel);

      const accountRepository = new AccountRepository(sequelize);

      const result = await accountRepository.remove(mockAccountId);

      expect(result).toEqual(true);
    });
  });

  describe('retrieve', () => {
    it('should retrieve safe fields (no password) from the account', async () => {
      const mockAccountId = 'someaccountid';
      const mockAccountInfo = {
        id: 'someid',
        email: 'someemail@email.com',
        handle: 'somehandle',
      };

      const mockAccountSafeFields = {
        toJSON: () => mockAccountInfo,
      };

      const sequelize = new Sequelize();

      jest
        .spyOn(AccountModel, 'findOne')
        .mockResolvedValueOnce(mockAccountSafeFields as any);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(AccountModel);

      const accountRepository = new AccountRepository(sequelize);

      const result = await accountRepository.retrieveSafeFields(mockAccountId);

      expect(result).toEqual(mockAccountInfo);
    });

    it('should fail by trying to retrieve safe fields from an account that does not exist', async () => {
      const mockAccountId = 'doesnoexist';

      const sequelize = new Sequelize();

      jest.spyOn(AccountModel, 'findOne').mockResolvedValueOnce(null);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(AccountModel);

      const accountRepository = new AccountRepository(sequelize);

      expect(() =>
        accountRepository.retrieveSafeFields(mockAccountId)
      ).rejects.toThrow(ErrorMessages.ACCOUNT_NOT_FOUND);
    });

    it('should retrieve all record data from the account', async () => {
      const mockAccountId = 'someaccountid';
      const mockAccountInfo = {
        id: 'someid',
        email: 'someemail@email.com',
        handle: 'somehandle',
        password: 'somehashedpassword',
      };

      const mockAccountSafeFields = {
        toJSON: () => mockAccountInfo,
      };

      const sequelize = new Sequelize();

      jest
        .spyOn(AccountModel, 'findOne')
        .mockResolvedValueOnce(mockAccountSafeFields as any);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(AccountModel);

      const accountRepository = new AccountRepository(sequelize);

      const result = await accountRepository.retrieve(mockAccountId);

      expect(result).toEqual(mockAccountInfo);
    });

    it('should fail by trying to retrieve all record data from an account that does not exist', async () => {
      const mockAccountId = 'doesnoexist';

      const sequelize = new Sequelize();

      jest.spyOn(AccountModel, 'findOne').mockResolvedValueOnce(null);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(AccountModel);

      const accountRepository = new AccountRepository(sequelize);

      expect(() => accountRepository.retrieve(mockAccountId)).rejects.toThrow(
        ErrorMessages.ACCOUNT_NOT_FOUND
      );
    });
  });
});
