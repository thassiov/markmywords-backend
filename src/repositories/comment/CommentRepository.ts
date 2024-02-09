import { ModelStatic, Sequelize, Transaction } from 'sequelize';

import { CommentModel, ICreateCommentDto } from '../../models';
import { RepositoryError } from '../../utils/errors';

class CommentRepository {
  db: ModelStatic<CommentModel>;
  constructor(private readonly sequelize: Sequelize) {
    this.db = this.sequelize.model('comment');
  }

  async create(commmentDto: ICreateCommentDto): Promise<string> {
    const transaction = await this.getTransaction();
    try {
      const newComment = await this.db.create<CommentModel>(commmentDto, {
        transaction,
      });

      await transaction.commit();
      return newComment.get('id') as string;
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Could not create new comment', {
        cause: error as Error,
        details: {
          repository: 'comment',
          input: commmentDto,
        },
      });
    }
  }

  private async getTransaction(): Promise<Transaction> {
    const t = await this.sequelize.transaction();
    return t;
  }
}

export { CommentRepository };
