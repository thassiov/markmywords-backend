import { getMockReq, getMockRes } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';

import { SelectionService } from '../../../services';
import { getMockSelection } from '../../../utils/tests/mocks/selection';
import { createSelectionHandlerFactory } from './create';

describe('REST: selection createNewHandler', () => {
  const mockSelectionService = {
    create: jest.fn(),
  };

  it('should create a new selection', async () => {
    const createSelectionHandler = createSelectionHandlerFactory(
      mockSelectionService as any as SelectionService
    );

    (mockSelectionService.create as jest.Mock).mockResolvedValueOnce('someid');
    const mockSelection = getMockSelection();

    const mockReq = getMockReq({
      body: mockSelection,
    });
    const mockRes = getMockRes().res;
    await createSelectionHandler(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      id: 'someid',
    });
  });

  it('should fail by sending the wrong data formst', async () => {
    const createSelectionHandler = createSelectionHandlerFactory(
      mockSelectionService as any as SelectionService
    );

    const mockReq = getMockReq({
      body: { someField: true, rawText: [] },
    });
    const mockRes = getMockRes().res;
    await createSelectionHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message:
        'Invalid request body format. Please ensure the request body follows the expected format.',
    });
  });
});
