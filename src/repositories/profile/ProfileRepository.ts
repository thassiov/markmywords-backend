import { ModelStatic, Op, Sequelize, Transaction } from 'sequelize';

import { ICreateProfileDto } from '../../models';
import { IProfile, ProfileModel } from '../../models/profile';
import {
  ErrorMessages,
  NotFoundError,
  RepositoryError,
} from '../../utils/errors';

class ProfileRepository {
  private readonly db: ModelStatic<ProfileModel>;
  constructor(private readonly sequelize: Sequelize) {
    this.db = this.sequelize.model('profile');
  }

  async create(profileDto: ICreateProfileDto): Promise<string> {
    const transaction = await this.getTransaction();
    try {
      const result = await this.db.create<ProfileModel>(profileDto, {
        transaction,
      });
      await transaction.commit();

      return result.get('id') as string;
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Could not create new profile', {
        cause: error as Error,
        details: {
          repository: 'profile',
          input: profileDto,
        },
      });
    }
  }

  async retrieveByAccountId(accountId: string): Promise<IProfile> {
    try {
      const profile = await this.db.findOne<ProfileModel>({
        where: {
          accountId: {
            [Op.eq]: accountId,
          },
        },
      });

      if (!profile) {
        throw new NotFoundError(ErrorMessages.PROFILE_NOT_FOUND);
      }

      return profile.toJSON();
    } catch (error) {
      throw new RepositoryError('Could not retrieve profile by accountId', {
        cause: error as Error,
        details: {
          repository: 'profile',
          input: { accountId },
        },
      });
    }
  }

  async retrieve(profileId: string): Promise<IProfile> {
    try {
      const profile = await this.db.findOne<ProfileModel>({
        where: {
          id: {
            [Op.eq]: profileId,
          },
        },
      });

      if (!profile) {
        throw new NotFoundError(ErrorMessages.PROFILE_NOT_FOUND);
      }

      return profile.toJSON();
    } catch (error) {
      throw new RepositoryError('Could not retrieve profile', {
        cause: error as Error,
        details: {
          repository: 'profile',
          input: { profileId },
        },
      });
    }
  }

  private async getTransaction(): Promise<Transaction> {
    const t = await this.sequelize.transaction();
    return t;
  }
}

export { ProfileRepository };
