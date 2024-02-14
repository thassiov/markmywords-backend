import { getMockReq, getMockRes } from '@jest-mock/express';
import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';

import { CommentService } from '../../../services/comment';
import { ErrorMessages } from '../../../utils/errors';
import { removeCommentHandlerFactory } from './remove';

describe('REST: comment removeAccountHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const mockCommentService = {
    remove: jest.fn(),
  };

  it('should remove a comment by its id', async () => {
    const removeCommentHandler = removeCommentHandlerFactory(
      mockCommentService as any as CommentService
    );
    (mockCommentService.remove as jest.Mock).mockResolvedValueOnce(true);

    const mockReq = getMockReq({
      params: { commentId: randomUUID() },
    });
    const mockRes = getMockRes().res;

    await removeCommentHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.send).toHaveBeenCalled();
  });

  it('should fail to remove an account that does not exist', async () => {
    const removeCommentHandler = removeCommentHandlerFactory(
      mockCommentService as any as CommentService
    );
    (mockCommentService.remove as jest.Mock).mockResolvedValueOnce(false);

    const mockReq = getMockReq({
      params: { commentId: randomUUID() },
    });
    const mockRes = getMockRes().res;

    await removeCommentHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.COULD_NOT_DELETE_COMMENT,
    });
  });

  it('should fail to remove an account by providing an invalid commentId', async () => {
    const removeCommentHandler = removeCommentHandlerFactory(
      mockCommentService as any as CommentService
    );

    const mockReq = getMockReq({
      params: { commentId: 'someinvalidid' },
    });
    const mockRes = getMockRes().res;

    await removeCommentHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.type).toHaveBeenCalledWith('application/json');
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ErrorMessages.INVALID_ID,
    });
  });
});
