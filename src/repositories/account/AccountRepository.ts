import { ModelStatic, Op, Sequelize, Transaction } from 'sequelize';

import { ICreateAccountDto } from '../../models';
import { AccountModel } from '../../models/account';
import { RepositoryError } from '../../utils/errors';

class AccountRepository {
  private readonly db: ModelStatic<AccountModel>;
  constructor(private readonly sequelize: Sequelize) {
    this.db = this.sequelize.model('account');
  }

  async create(accountDto: ICreateAccountDto): Promise<string> {
    const transaction = await this.getTransaction();
    try {
      const newAccount = await this.db.create<AccountModel>(accountDto, {
        transaction,
      });
      await transaction.commit();

      return newAccount.get('id') as string;
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

  async remove(accountId: string): Promise<boolean> {
    const transaction = await this.getTransaction();
    try {
      const result = await this.db.destroy<AccountModel>({
        transaction,
        where: {
          id: {
            [Op.eq]: accountId,
          },
        },
      });

      await transaction.commit();

      if (!result) {
        return false;
      }

      return true;
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Could not create new account', {
        cause: error as Error,
        details: {
          repository: 'account',
          input: accountId,
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
