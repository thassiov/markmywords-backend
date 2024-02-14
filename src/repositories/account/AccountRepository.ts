import {
  ModelStatic,
  Op,
  Sequelize,
  Transaction,
  WhereOptions,
} from 'sequelize';

import { ICreateAccountDto } from '../../models';
import {
  AccountModel,
  IAccount,
  IAccountSafeFields,
} from '../../models/account';
import { RepositoryError } from '../../utils/errors';

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
  ): Promise<IAccountSafeFields | null> {
    const options = { fields: ['id'], value: accountId };
    return this.retrieveSafeFields(options);
  }

  async retrieveSafeFieldsByUserhandleOrEmail(
    accountIdentifier: string
  ): Promise<IAccountSafeFields | null> {
    const options = { fields: ['email', 'handle'], value: accountIdentifier };
    return this.retrieveSafeFields(options);
  }

  async retrieveByAccountId(accountId: string): Promise<IAccount | null> {
    const options = { fields: ['id'], value: accountId };
    return this.retrieve(options);
  }

  async retrieveByUserhandleOrEmail(
    accountIdentifier: string
  ): Promise<IAccount | null> {
    const options = { fields: ['email', 'handle'], value: accountIdentifier };
    return this.retrieve(options);
  }

  private async retrieveSafeFields(
    queryOptions: QueryForKeysOptions
  ): Promise<IAccountSafeFields | null> {
    try {
      const account = await this.db.findOne<AccountModel>({
        where: this.setQueryOptions(queryOptions),
        attributes: ['id', 'email', 'handle'],
      });

      if (!account) {
        return null;
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

  private async retrieve(
    queryOptions: QueryForKeysOptions
  ): Promise<IAccount | null> {
    try {
      const account = await this.db.findOne<AccountModel>({
        where: this.setQueryOptions(queryOptions),
      });

      if (!account) {
        return null;
      }

      return account.toJSON();
    } catch (error) {
      throw new RepositoryError('Could not retrieve account', {
        cause: error as Error,
        details: {
          repository: 'account',
        },
      });
    }
  }

  private async getTransaction(): Promise<Transaction> {
    const t = await this.sequelize.transaction();
    return t;
  }

  private setQueryOptions(queryOptions: QueryForKeysOptions): WhereOptions {
    return queryOptions.fields
      .map((field) => ({
        [field]: { [Op.eq]: queryOptions.value },
      }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }
}

export { AccountRepository };
