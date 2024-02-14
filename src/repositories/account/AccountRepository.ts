import { ModelStatic, Op, Sequelize, Transaction } from 'sequelize';

import { ICreateAccountDto } from '../../models';
import {
  AccountModel,
  IAccount,
  IAccountSafeFields,
} from '../../models/account';
import {
  ErrorMessages,
  NotFoundError,
  RepositoryError,
} from '../../utils/errors';

type QueryForKeysOptions = {
  fields: string[];
  value: string;
};

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

  async retrieveSafeFieldsByAccountId(
    accountId: string
  ): Promise<IAccountSafeFields> {
    const options = { fields: ['id'], value: accountId };
    return this.retrieveSafeFields(options);
  }

  async retrieveSafeFieldsByUserhandleOrEmail(
    accountIdentifier: string
  ): Promise<IAccountSafeFields> {
    const options = { fields: ['email', 'handle'], value: accountIdentifier };
    return this.retrieveSafeFields(options);
  }

  private async retrieveSafeFields(
    queryOptions: QueryForKeysOptions
  ): Promise<IAccountSafeFields> {
    try {
      const where = queryOptions.fields
        .map((field) => ({
          [field]: { [Op.eq]: queryOptions.value },
        }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});

      const account = await this.db.findOne<AccountModel>({
        where,
        attributes: ['id', 'email', 'handle'],
      });

      if (!account) {
        throw new NotFoundError(ErrorMessages.ACCOUNT_NOT_FOUND);
      }

      return account.toJSON();
    } catch (error) {
      throw new RepositoryError('Could not retrieve safe fields from account', {
        cause: error as Error,
        details: {
          repository: 'account',
          input: { queryOptions },
        },
      });
    }
  }

  async retrieve(accountId: string): Promise<IAccount> {
    try {
      const account = await this.db.findOne<AccountModel>({
        where: {
          id: {
            [Op.eq]: accountId,
          },
        },
      });

      if (!account) {
        throw new NotFoundError(ErrorMessages.ACCOUNT_NOT_FOUND);
      }

      return account.toJSON();
    } catch (error) {
      throw new RepositoryError('Could not retrieve account', {
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
