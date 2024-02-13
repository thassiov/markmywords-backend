import { ICreateCommentDto } from '../../models/comment';
import { CommentRepository } from '../../repositories/comment';
import { ErrorMessages } from '../../utils/errors';
import { SelectionService } from '../selection';
import { CommentService } from './CommentService';

describe('Comment Service', () => {
  const mockCommentRepository = {
    create: jest.fn(),
    retrieve: jest.fn(),
    remove: jest.fn(),
  };

  const mockSelectionService = {
    retrieve: jest.fn(),
  };

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new comment in a existing selection', async () => {
      const mockComment = {
        accountId: 'accountId',
        selectionId: 'selectionId',
        body: 'the comment body',
      };
      const mockCommentId = 'commendId';
      (mockCommentRepository.create as jest.Mock).mockResolvedValueOnce(
        mockCommentId
      );

      (mockSelectionService.retrieve as jest.Mock).mockResolvedValueOnce(true);

      const commentService = new CommentService(
        mockCommentRepository as any as CommentRepository,
        {
          selection: mockSelectionService as any as SelectionService,
        }
      );

      const id = await commentService.create(mockComment as ICreateCommentDto);

      expect(id).toEqual(mockCommentId);
    });

    it('should fail to create a new comment when the selection does not exist', async () => {
      const mockComment = {
        accountId: 'accountId',
        selectionId: 'selectionId',
        body: 'the comment body',
      };

      (mockSelectionService.retrieve as jest.Mock).mockResolvedValueOnce(null);

      const commentService = new CommentService(
        mockCommentRepository as any as CommentRepository,
        {
          selection: mockSelectionService as any as SelectionService,
        }
      );

      expect(() =>
        commentService.create(mockComment as ICreateCommentDto)
      ).rejects.toThrow(ErrorMessages.SELECTION_NOT_FOUND);
    });
  });
});
