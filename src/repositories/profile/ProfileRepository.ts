import { Sequelize, Transaction } from 'sequelize';

import { ICreateProfileDto } from '../../models';
import { RepositoryError } from '../../utils/errors';

class ProfileRepository {
  // private readonly db: ModelStatic<ProfileModel>;
  constructor(private readonly sequelize: Sequelize) {
    //   this.db = this.sequelize.model('profile');
  }
  async create(profileDto: ICreateProfileDto): Promise<string> {
    const transaction = await this.getTransaction();
    try {
      await transaction.commit();
      return '';
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

  private async getTransaction(): Promise<Transaction> {
    const t = await this.sequelize.transaction();
    return t;
  }
}

export { ProfileRepository };
