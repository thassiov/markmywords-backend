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

  describe('remove', () => {
    it('should remove a comment', async () => {
      const mockCommentId = 'somecommentid';

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(CommentModel, 'destroy').mockResolvedValueOnce(1);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(CommentModel);

      const commentRepository = new CommentRepository(sequelize);

      const result = await commentRepository.remove(mockCommentId);

      expect(result).toEqual(true);
    });

    it('should fail to remove a comment that does not exist', async () => {
      const mockCommentId = 'doesnotexist';

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(CommentModel, 'destroy').mockResolvedValueOnce(0);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(CommentModel);

      const commentRepository = new CommentRepository(sequelize);

      const result = await commentRepository.remove(mockCommentId);

      expect(result).toEqual(false);
    });
  });

  describe('edit', () => {
    it('should edit an existing comment', async () => {
      const mockCommentId = 'somecommentid';
      const mockNewCommentBody = 'the new content';

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(CommentModel, 'update').mockResolvedValueOnce([1]);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(CommentModel);

      const commentRepository = new CommentRepository(sequelize);

      const result = await commentRepository.edit(
        mockCommentId,
        mockNewCommentBody
      );

      expect(result).toEqual(true);
    });

    it('should fail to update a comment that does not exist', async () => {
      const mockCommentId = 'doesnotexist';
      const mockNewCommentBody = 'the new content';

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(CommentModel, 'update').mockResolvedValueOnce([0]);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(CommentModel);

      const commentRepository = new CommentRepository(sequelize);

      const result = await commentRepository.edit(
        mockCommentId,
        mockNewCommentBody
      );

      expect(result).toEqual(false);
    });
  });
});
