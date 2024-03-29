import { SelectionService } from '.';
import { ICreateSelectionDto } from '../../models/selection';
import { SelectionRepository } from '../../repositories/selection';
import {
  getMockSelection,
  selections,
} from '../../utils/tests/mocks/selection';
import { htmlToPlainText } from '../../utils/text-parsers';

jest.mock('../../utils/text-parsers', () => {
  return {
    htmlToPlainText: jest.fn().mockImplementation(() => selections[0]!.text),
  };
});

describe('Selection Service', () => {
  const mockSelectionRepository = {
    create: jest.fn(),
    retrieve: jest.fn(),
    remove: jest.fn(),
  };

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new selection', async () => {
      const mockId = 'somemockid';
      (mockSelectionRepository.create as jest.Mock).mockResolvedValueOnce(
        mockId
      );
      const selectionService = new SelectionService(
        mockSelectionRepository as any as SelectionRepository
      );
      const mockSelection = getMockSelection();

      const id = await selectionService.create(
        mockSelection as ICreateSelectionDto
      );

      expect(id).toEqual(mockId);
    });

    it('should create a selection and the text must be stripped of html tags', async () => {
      const mockId = 'somemockid';
      (mockSelectionRepository.create as jest.Mock).mockResolvedValueOnce(
        mockId
      );
      const selectionService = new SelectionService(
        mockSelectionRepository as any as SelectionRepository
      );

      const mockSelection = getMockSelection({ useCleanText: false });

      const id = await selectionService.create(
        mockSelection as ICreateSelectionDto
      );

      expect(typeof id).toBe('string');
      expect(htmlToPlainText).toHaveBeenCalledWith(selections[0]!.rawText);
    });
  });

  describe('retrieve', () => {
    it('should resolve with selection that does not exist', async () => {
      const ghostSelection = crypto.randomUUID();
      (mockSelectionRepository.retrieve as jest.Mock).mockResolvedValueOnce(
        null
      );

      const selectionService = new SelectionService(
        mockSelectionRepository as any as SelectionRepository
      );

      expect(selectionService.retrieve(ghostSelection)).resolves.toBe(null);
    });

    it('should retrieve the selection', async () => {
      const selectionId = crypto.randomUUID();
      const mockSelection = getMockSelection();
      (mockSelectionRepository.retrieve as jest.Mock).mockResolvedValueOnce(
        mockSelection
      );

      const selectionService = new SelectionService(
        mockSelectionRepository as any as SelectionRepository
      );
      const result = await selectionService.retrieve(selectionId);

      expect(result).toBe(mockSelection);
    });
  });

  describe('delete', () => {
    it('should resolve with selection that does not exist', async () => {
      const selectionId = crypto.randomUUID();
      (mockSelectionRepository.remove as jest.Mock).mockResolvedValueOnce(
        false
      );

      const selectionService = new SelectionService(
        mockSelectionRepository as any as SelectionRepository
      );
      expect(selectionService.remove(selectionId)).resolves.toBe(false);
    });

    it('should delete the selection', async () => {
      const selectionId = crypto.randomUUID();
      (mockSelectionRepository.remove as jest.Mock).mockResolvedValueOnce(true);

      const selectionService = new SelectionService(
        mockSelectionRepository as any as SelectionRepository
      );
      expect(selectionService.remove(selectionId)).resolves.toBe(true);
    });
  });
});
