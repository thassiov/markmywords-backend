import { getMockReq, getMockRes } from '@jest-mock/express';

import { selectionService } from '../../../services';
import { getMockSelection } from '../../../utils/tests/mocks/selection';
import { retrieveSelectionHandler } from './retrieve';
import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';

jest.mock('../../../services');

describe('REST: selection retrieveSelectionHandler', () => {
  it('should retrieve a selection by its id', async () => {
    const mockSelection = getMockSelection();
    (selectionService.retrieveSelection as jest.Mock).mockResolvedValueOnce(
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
    (selectionService.retrieveSelection as jest.Mock).mockResolvedValueOnce(
      null
    );

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
    (selectionService.retrieveSelection as jest.Mock).mockResolvedValueOnce(
      null
    );

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
