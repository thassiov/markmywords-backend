import { faker } from '@faker-js/faker';

import { ICreateSelectionDto } from '../../models/selection';
import { SelectionService } from '.';
import {
  getMockSelection,
  selections,
} from '../../utils/tests/mocks/selection';
import { htmlToPlainText } from '../../utils/text-parsers';
import { selectionRepository } from '../../repositories';

jest.mock('../../repositories/selection');

jest.mock('../../utils/text-parsers', () => {
  return {
    htmlToPlainText: jest.fn().mockImplementation(() => selections[0]!.text),
  };
});

describe('Selection Service', () => {
  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new selection', async () => {
      const mockId = faker.string.uuid();
      (selectionRepository.createNew as jest.Mock).mockResolvedValueOnce(
        mockId
      );
      const selectionService = new SelectionService(selectionRepository);
      const mockSelection = getMockSelection();

      const id = await selectionService.createNew(
        mockSelection as ICreateSelectionDto
      );

      expect(id).toEqual(mockId);
    });

    it('should create a selection and the text must be stripped of html tags', async () => {
      const mockId = faker.string.uuid();
      (selectionRepository.createNew as jest.Mock).mockResolvedValueOnce(
        mockId
      );
      const selectionService = new SelectionService(selectionRepository);

      const mockSelection = getMockSelection({ useCleanText: false });

      const id = await selectionService.createNew(
        mockSelection as ICreateSelectionDto
      );

      expect(typeof id).toBe('string');
      expect(htmlToPlainText).toHaveBeenCalledWith(selections[0]!.rawText);
    });
  });

  describe('retrieve', () => {
    it('should resolve with selection that does not exist', async () => {
      const ghostSelection = crypto.randomUUID();
      (
        selectionRepository.retrieveSelection as jest.Mock
      ).mockResolvedValueOnce(null);

      const selectionService = new SelectionService(selectionRepository);

      expect(selectionService.retrieveSelection(ghostSelection)).resolves.toBe(
        null
      );
    });

    it('should retrieve the selection', async () => {
      const selectionId = crypto.randomUUID();
      const mockSelection = getMockSelection();
      (
        selectionRepository.retrieveSelection as jest.Mock
      ).mockResolvedValueOnce(mockSelection);

      const selectionService = new SelectionService(selectionRepository);
      const result = await selectionService.retrieveSelection(selectionId);

      expect(result).toBe(mockSelection);
    });
  });

  describe('delete', () => {
    it('should resolve with selection that does not exist', async () => {
      const selectionId = crypto.randomUUID();
      (selectionRepository.deleteSelection as jest.Mock).mockResolvedValueOnce(
        false
      );

      const selectionService = new SelectionService(selectionRepository);
      expect(selectionService.deleteSelection(selectionId)).resolves.toBe(
        false
      );
    });

    it('should delete the selection', async () => {
      const selectionId = crypto.randomUUID();
      (selectionRepository.deleteSelection as jest.Mock).mockResolvedValueOnce(
        true
      );

      const selectionService = new SelectionService(selectionRepository);
      expect(selectionService.deleteSelection(selectionId)).resolves.toBe(true);
    });
  });
});
