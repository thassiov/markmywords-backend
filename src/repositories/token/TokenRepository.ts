import { ModelStatic, Op, Sequelize, Transaction } from 'sequelize';

import { IJWTToken, JWTTokenModel } from '../../models';
import { RepositoryError } from '../../utils/errors';

class JWTTokenRepository {
  db: ModelStatic<JWTTokenModel>;

  constructor(private readonly sequelize: Sequelize) {
    this.db = this.sequelize.model('invalidated_jwttokens');
  }

  async create(token: IJWTToken): Promise<string> {
    const transaction = await this.getTransaction();
    try {
      const newToken = await this.db.create<JWTTokenModel>(token, {
        transaction,
      });
      await transaction.commit();

      return newToken.get('id') as string;
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Could not store new account', {
        cause: error as Error,
        details: {
          repository: 'token',
          input: token,
        },
      });
    }
  }

  async remove(tokenString: string): Promise<boolean> {
    const transaction = await this.getTransaction();
    try {
      const result = await this.db.destroy<JWTTokenModel>({
        transaction,
        where: {
          token: {
            [Op.eq]: tokenString,
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
      throw new RepositoryError('Could not remove token', {
        cause: error as Error,
        details: {
          repository: 'token',
        },
      });
    }
  }

  async retrieve(tokenString: string): Promise<IJWTToken | null> {
    try {
      const result = await this.db.findOne<JWTTokenModel>({
        where: {
          token: {
            [Op.eq]: tokenString,
          },
        },
      });

      if (!result) {
        return null;
      }

      return result.toJSON();
    } catch (error) {
      throw new RepositoryError('Could not retrieve token from db', {
        cause: error as Error,
        details: {
          repository: 'token',
        },
      });
    }
  }

  private async getTransaction(): Promise<Transaction> {
    const t = await this.sequelize.transaction();
    return t;
  }
}

export { JWTTokenRepository };
