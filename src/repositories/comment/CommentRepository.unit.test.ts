import { Sequelize, Transaction } from 'sequelize';

import { CommentModel } from '../../models';
import { CommentRepository } from './CommentRepository';

jest.mock('sequelize');

describe('Comment Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('creates a new comment', async () => {
      const mockComment = {
        accountId: 'accountId',
        selectionId: 'selectionId',
        body: 'the comment body',
      };

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(CommentModel, 'create').mockResolvedValueOnce({
        get: () => 'fakeid',
      });

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(CommentModel);

      const commentRepository = new CommentRepository(sequelize);

      const result = await commentRepository.create(mockComment);

      expect(result).toEqual('fakeid');
    });
  });
});
