import { getMockReq, getMockRes } from '@jest-mock/express';
import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';

import { SelectionService } from '../../../services';
import { deleteSelectionHandlerFactory } from './delete';

describe('REST: selection deleteSelectionHandler', () => {
  const mockSelectionService = {
    remove: jest.fn(),
  };

  it('should delete a selection by its id', async () => {
    const deleteSelectionHandler = deleteSelectionHandlerFactory(
      mockSelectionService as any as SelectionService
    );
    (mockSelectionService.remove as jest.Mock).mockResolvedValueOnce(true);

    const mockReq = getMockReq({
      params: { id: randomUUID() },
    });
    const mockRes = getMockRes().res;

    await deleteSelectionHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(mockRes.send).toHaveBeenCalledWith();
  });

  it('should fail to delete a section', async () => {
    const deleteSelectionHandler = deleteSelectionHandlerFactory(
      mockSelectionService as any as SelectionService
    );

    (mockSelectionService.remove as jest.Mock).mockResolvedValueOnce(false);

    const mockId = randomUUID();
    const mockReq = getMockReq({
      params: { id: mockId },
    });
    const mockRes = getMockRes().res;

    await deleteSelectionHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Selection was not deleted',
      selectionId: mockId,
    });
  });

  it('should fail by providing a selection id with invalid format', async () => {
    const deleteSelectionHandler = deleteSelectionHandlerFactory(
      mockSelectionService as any as SelectionService
    );

    (mockSelectionService.remove as jest.Mock).mockResolvedValueOnce(null);

    const mockId = 'invalidid';

    const mockReq = getMockReq({
      params: { id: mockId },
    });
    const mockRes = getMockRes().res;

    await deleteSelectionHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message:
        'Invalid request param format. Please ensure the request param follows the expected format.',
    });
  });
});
