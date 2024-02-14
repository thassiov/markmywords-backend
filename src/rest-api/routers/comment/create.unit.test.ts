import { getMockReq, getMockRes } from '@jest-mock/express';
import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';

import { SelectionService } from '../../../services';
import { CommentService } from '../../../services/comment';
import { ErrorMessages } from '../../../utils/errors';
import { createCommentHandlerFactory } from './create';

describe('REST: comment createAccountHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const mockCommentService = {
    create: jest.fn(),
  };

  const mockSelectionService = {
    retrieve: jest.fn(),
  };

  it('should create a new comment', async () => {
    const mockAccountId = randomUUID();
    const mockSelectionId = randomUUID();
    const mockCommentId = randomUUID();
    const mockComment = {
      body: 'some lorem ipsum text',
      highlight_beginning: 1,
      highlight_end: 5,
    };

    const createCommentHandler = createCommentHandlerFactory(
      mockCommentService as any as CommentService,
      mockSelectionService as any as SelectionService
    );

    (mockSelectionService.retrieve as jest.Mock).mockResolvedValueOnce({});
    (mockCommentService.create as jest.Mock).mockResolvedValueOnce(
      mockCommentId
    );

    const mockReq = getMockReq({
      body: mockComment,
      params: { selectionId: mockSelectionId },
      query: { accountId: mockAccountId },
    });

    const mockRes = getMockRes().res;
    await createCommentHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      id: mockCommentId,
    });
  });

  it('should fail by sending a invalid selectionId', async () => {
    const mockSelectionId = 'someselectionid';

    const createCommentHandler = createCommentHandlerFactory(
      mockCommentService as any as CommentService,
      mockSelectionService as any as SelectionService
    );

    const mockReq = getMockReq({
      params: { selectionId: mockSelectionId },
    });

    const mockRes = getMockRes().res;
    await createCommentHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.INVALID_ID,
    });
  });

  it('should fail by sending a invalid comment data format', async () => {
    const mockSelectionId = randomUUID();
    const mockComment = {
      body1: 'some lorem ipsum text',
      highlight_beginning1: 1,
      highlight_end1: 5,
    };

    const createCommentHandler = createCommentHandlerFactory(
      mockCommentService as any as CommentService,
      mockSelectionService as any as SelectionService
    );

    const mockReq = getMockReq({
      body: mockComment,
      params: { selectionId: mockSelectionId },
    });

    const mockRes = getMockRes().res;
    await createCommentHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.CREATE_COMMENT_INVALID_DATA_FORMAT,
    });
  });

  it('should fail by trying to create a comment in a selection that does not exist', async () => {
    const mockSelectionId = randomUUID();
    const mockComment = {
      body: 'some lorem ipsum text',
      highlight_beginning: 1,
      highlight_end: 5,
    };

    const createCommentHandler = createCommentHandlerFactory(
      mockCommentService as any as CommentService,
      mockSelectionService as any as SelectionService
    );

    (mockSelectionService.retrieve as jest.Mock).mockResolvedValueOnce(null);

    const mockReq = getMockReq({
      body: mockComment,
      params: { selectionId: mockSelectionId },
    });

    const mockRes = getMockRes().res;
    await createCommentHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.SELECTION_NOT_FOUND,
    });
  });
});
