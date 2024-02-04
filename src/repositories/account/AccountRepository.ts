import { Sequelize, Transaction } from 'sequelize';

import { ICreateAccountDto } from '../../models';
import { RepositoryError } from '../../utils/errors';

class AccountRepository {
  // private readonly db: ModelStatic<SelectionModel>;
  constructor(private readonly sequelize: Sequelize) {
    //   this.db = this.sequelize.model('selection');
  }

  async create(accountDto: ICreateAccountDto): Promise<string> {
    const transaction = await this.getTransaction();
    try {
      await transaction.commit();
      return '';
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Could not create new account', {
        cause: error as Error,
        details: {
          repository: 'account',
          input: accountDto,
        },
      });
    }
  }

  private async getTransaction(): Promise<Transaction> {
    const t = await this.sequelize.transaction();
    return t;
  }
}

export { AccountRepository };
