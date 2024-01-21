import { faker } from '@faker-js/faker';

import { ICreateSelectionDto } from '../../models/selection';
import { SelectionService } from '.';
import { SelectionRepository } from '../../repositories/selection';
import {
  getMockSelection,
  selections,
} from '../../utils/tests/mocks/selection';
import { htmlToPlainText } from '../../utils/text-parsers';
import { Sequelize } from 'sequelize';

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
    it.each([[null], ['selection'], [1], [[]], [{}], [{ url: 1, raw: 1 }]])(
      'should fail with invalid data format (%p)',
      async (selection) => {
        const mockSelectionRepository = new SelectionRepository(
          {} as Sequelize
        );
        jest
          .spyOn(mockSelectionRepository, 'createNew')
          .mockImplementationOnce(async (_: ICreateSelectionDto) =>
            faker.string.uuid()
          );

        const selectionService = new SelectionService(mockSelectionRepository);
        expect(() =>
          selectionService.createNew(selection as ICreateSelectionDto)
        ).rejects.toThrow('Could not create new selection');
      }
    );

    it('should create a new selection', async () => {
      const mockSelectionRepository = new SelectionRepository({} as Sequelize);
      jest
        .spyOn(mockSelectionRepository, 'createNew')
        .mockImplementationOnce(async (_: ICreateSelectionDto) =>
          faker.string.uuid()
        );
      const selectionService = new SelectionService(mockSelectionRepository);
      const mockSelection = getMockSelection();

      const id = await selectionService.createNew(
        mockSelection as ICreateSelectionDto
      );

      expect(typeof id).toBe('string');
    });

    it('should create a selection and the text must be stripped of html tags', async () => {
      const mockSelectionRepository = new SelectionRepository({} as Sequelize);
      jest
        .spyOn(mockSelectionRepository, 'createNew')
        .mockImplementationOnce(async (_: ICreateSelectionDto) =>
          faker.string.uuid()
        );
      const selectionService = new SelectionService(mockSelectionRepository);

      const mockSelection = getMockSelection({ useCleanText: false });

      const id = await selectionService.createNew(
        mockSelection as ICreateSelectionDto
      );

      expect(typeof id).toBe('string');
      expect(htmlToPlainText).toHaveBeenCalledWith(selections[0]!.rawText);
    });
  });

  describe('retrieve', () => {
    it.each([[null], ['////'], [1], [{}], [true]])(
      'should fail with invalid selection id',
      async (failtyId) => {
        const mockSelectionRepository = new SelectionRepository(
          {} as Sequelize
        );
        jest
          .spyOn(mockSelectionRepository, 'retrieveSelection')
          .mockImplementationOnce(async (_: string) => getMockSelection());

        const selectionService = new SelectionService(mockSelectionRepository);
        expect(() =>
          selectionService.retrieveSelection(failtyId as string)
        ).rejects.toThrow('Could not retrieve selection');
      }
    );

    it('should resolve with selection that does not exist', async () => {
      const ghostSelection = crypto.randomUUID();
      const mockSelectionRepository = new SelectionRepository({} as Sequelize);
      jest
        .spyOn(mockSelectionRepository, 'retrieveSelection')
        .mockResolvedValueOnce(null);

      const selectionService = new SelectionService(mockSelectionRepository);

      expect(selectionService.retrieveSelection(ghostSelection)).resolves.toBe(
        null
      );
    });

    it('should retrieve the selection', async () => {
      const selectionId = crypto.randomUUID();
      const mockSelection = getMockSelection();
      const mockSelectionRepository = new SelectionRepository({} as Sequelize);
      jest
        .spyOn(mockSelectionRepository, 'retrieveSelection')
        .mockResolvedValueOnce(mockSelection);

      const selectionService = new SelectionService(mockSelectionRepository);
      const result = await selectionService.retrieveSelection(selectionId);

      expect(result).toBe(mockSelection);
    });
  });

  describe('delete', () => {
    it.each([[null], ['////'], [1], [{}], [true]])(
      'should fail with invalid selection id',
      async (failtyId) => {
        const mockSelectionRepository = new SelectionRepository(
          {} as Sequelize
        );
        jest
          .spyOn(mockSelectionRepository, 'deleteSelection')
          .mockRejectedValueOnce(async (_: string) => getMockSelection());

        const selectionService = new SelectionService(mockSelectionRepository);
        expect(() =>
          selectionService.deleteSelection(failtyId as string)
        ).rejects.toThrow('Could not delete selection');
      }
    );

    it('should resolve with selection that does not exist', async () => {
      const selectionId = crypto.randomUUID();
      const mockSelectionRepository = new SelectionRepository({} as Sequelize);
      jest
        .spyOn(mockSelectionRepository, 'deleteSelection')
        .mockResolvedValueOnce(false);

      const selectionService = new SelectionService(mockSelectionRepository);
      expect(selectionService.deleteSelection(selectionId)).resolves.toBe(
        false
      );
    });

    it('should delete the selection', async () => {
      const selectionId = crypto.randomUUID();
      const mockSelectionRepository = new SelectionRepository({} as Sequelize);
      jest
        .spyOn(mockSelectionRepository, 'deleteSelection')
        .mockResolvedValueOnce(true);

      const selectionService = new SelectionService(mockSelectionRepository);
      expect(selectionService.deleteSelection(selectionId)).resolves.toBe(true);
    });
  });
});
