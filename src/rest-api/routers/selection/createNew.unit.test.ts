import { getMockReq, getMockRes } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';

import { selectionService } from '../../../services';
import { getMockSelection } from '../../../utils/tests/mocks/selection';
import { createNewHandler } from './createNew';

jest.mock('../../../services');

describe('REST: selection createNewHandler', () => {
  it('should create a new selection', async () => {
    (selectionService.createNew as jest.Mock).mockResolvedValueOnce('someid');
    const mockSelection = getMockSelection();

    const mockReq = getMockReq({
      body: mockSelection,
    });
    const mockRes = getMockRes().res;
    await createNewHandler(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      id: 'someid',
    });
  });

  it('should fail by sending the wrong data formst', async () => {
    const mockReq = getMockReq({
      body: { someField: true, rawText: [] },
    });
    const mockRes = getMockRes().res;
    await createNewHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message:
        'Invalid request body format. Please ensure the request body follows the expected format.',
    });
  });
});
