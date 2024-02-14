import { Sequelize, Transaction } from 'sequelize';

import { ProfileModel } from '../../models/profile';
import { ErrorMessages } from '../../utils/errors';
import { ProfileRepository } from './ProfileRepository';

jest.mock('sequelize');

describe('Profile Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new profile', async () => {
      const mockProfileId = 'someprofileid';
      const mockProfileInfo = {
        accountId: 'someaccountid',
        name: 'somename',
      };

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(ProfileModel, 'create').mockResolvedValueOnce({
        get: () => mockProfileId,
      });

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(ProfileModel);

      const profileRepository = new ProfileRepository(sequelize);

      const result = await profileRepository.create(mockProfileInfo);

      expect(result).toEqual(mockProfileId);
    });
  });

  describe('retrieve', () => {
    it('should retrieve a profile record by the associated accountId', async () => {
      const mockAccountId = 'someaccountid';
      const mockProfileInfo = {
        accountId: mockAccountId,
        name: 'somename',
        id: 'someid',
      };

      const mockAccountSafeFields = {
        toJSON: () => mockProfileInfo,
      };

      const sequelize = new Sequelize();

      jest
        .spyOn(ProfileModel, 'findOne')
        .mockResolvedValueOnce(mockAccountSafeFields as any);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(ProfileModel);

      const profileRepository = new ProfileRepository(sequelize);

      const result = await profileRepository.retrieveByAccountId(mockAccountId);

      expect(result).toEqual(mockProfileInfo);
    });

    it('should fail to retrieve a profile record that does not exist by an accountId', async () => {
      const mockAccountId = 'someaccountid';

      const sequelize = new Sequelize();

      jest.spyOn(ProfileModel, 'findOne').mockResolvedValueOnce(null);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(ProfileModel);

      const profileRepository = new ProfileRepository(sequelize);

      expect(() =>
        profileRepository.retrieveByAccountId(mockAccountId)
      ).rejects.toThrow(ErrorMessages.PROFILE_NOT_FOUND);
    });

    it('should retrieve a profile record by profile id', async () => {
      const mockProfileId = 'someprofileid';
      const mockProfileInfo = {
        accountId: 'someaccountId',
        name: 'somename',
        id: mockProfileId,
      };

      const mockAccountSafeFields = {
        toJSON: () => mockProfileInfo,
      };

      const sequelize = new Sequelize();

      jest
        .spyOn(ProfileModel, 'findOne')
        .mockResolvedValueOnce(mockAccountSafeFields as any);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(ProfileModel);

      const profileRepository = new ProfileRepository(sequelize);

      const result = await profileRepository.retrieve(mockProfileId);

      expect(result).toEqual(mockProfileInfo);
    });

    it('should fail to retrieve a profile record that does not exist by a profile id', async () => {
      const mockProfileId = 'someprofileid';

      const sequelize = new Sequelize();

      jest.spyOn(ProfileModel, 'findOne').mockResolvedValueOnce(null);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(ProfileModel);

      const profileRepository = new ProfileRepository(sequelize);

      expect(() =>
        profileRepository.retrieveByAccountId(mockProfileId)
      ).rejects.toThrow(ErrorMessages.PROFILE_NOT_FOUND);
    });
  });
});
