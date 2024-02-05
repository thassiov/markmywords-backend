import { getMockReq, getMockRes } from '@jest-mock/express';
import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';

import { SelectionService } from '../../../services';
import { getMockSelection } from '../../../utils/tests/mocks/selection';
import { retrieveSelectionHandlerFactory } from './retrieve';

describe('REST: selection retrieveSelectionHandler', () => {
  const mockSelectionService = {
    retrieve: jest.fn(),
  };

  it('should retrieve a selection by its id', async () => {
    const mockSelection = getMockSelection();
    const retrieveSelectionHandler = retrieveSelectionHandlerFactory(
      mockSelectionService as any as SelectionService
    );

    (mockSelectionService.retrieve as jest.Mock).mockResolvedValueOnce(
      mockSelection
    );

    const mockReq = getMockReq({
      params: { id: randomUUID() },
    });
    const mockRes = getMockRes().res;

    await retrieveSelectionHandler(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ selection: mockSelection });
  });

  it('should fail by trying to retrieve a selection that does not exist', async () => {
    const retrieveSelectionHandler = retrieveSelectionHandlerFactory(
      mockSelectionService as any as SelectionService
    );

    (mockSelectionService.retrieve as jest.Mock).mockResolvedValueOnce(null);

    const mockId = randomUUID();

    const mockReq = getMockReq({
      params: { id: mockId },
    });
    const mockRes = getMockRes().res;

    await retrieveSelectionHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Selection was not found',
      selectionId: mockId,
    });
  });

  it('should fail by providing a selection id with invalid format', async () => {
    const retrieveSelectionHandler = retrieveSelectionHandlerFactory(
      mockSelectionService as any as SelectionService
    );

    (mockSelectionService.retrieve as jest.Mock).mockResolvedValueOnce(null);

    const mockId = 'invalidid';

    const mockReq = getMockReq({
      params: { id: mockId },
    });
    const mockRes = getMockRes().res;

    await retrieveSelectionHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message:
        'Invalid request param format. Please ensure the request param follows the expected format.',
    });
  });
});
