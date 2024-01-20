import { faker } from '@faker-js/faker';

import { ICreateSelectionDto, ISelection } from '../../models/selection';
import { SelectionService } from '.';
import { SelectionRepository } from '../../repositories/selection';
import { selections } from '../../utils/tests/mocks/selection';
import { htmlToPlainText } from '../../utils/text-parsers';
import { IDB } from '../../models/db';

// jest.mock('../../repositories/selection');
jest.mock('../../utils/text-parsers', () => {
  return {
    htmlToPlainText: jest.fn().mockImplementation(() => selections[0]!.text),
  };
});

type MockSelectionOpts = {
  includeId?: boolean;
  useCleanText?: boolean;
};

function getMockSelection(
  opts: MockSelectionOpts = { includeId: false, useCleanText: true }
) {
  const mockSelection = {
    id: opts.includeId ? faker.string.uuid() : undefined,
    rawText: opts.useCleanText ? selections[0]!.text : selections[0]!.rawText,
    url: faker.internet.url(),
  } as ISelection;

  return mockSelection;
}

describe('Selection Service', () => {
  describe('create', () => {
    it.each([[null], ['selection'], [1], [[]], [{}], [{ url: 1, raw: 1 }]])(
      'should fail with invalid data format (%p)',
      async (selection) => {
        const mockSelectionRepository = new SelectionRepository({} as IDB);
        jest
          .spyOn(mockSelectionRepository, 'createNew')
          .mockImplementation(async (_: ICreateSelectionDto) =>
            faker.string.uuid()
          );

        const selectionService = new SelectionService(mockSelectionRepository);
        expect(() =>
          selectionService.createNew(selection as ICreateSelectionDto)
        ).rejects.toThrow('Could not create new selection');
      }
    );

    it('should create a new selection', async () => {
      const mockSelectionRepository = new SelectionRepository({} as IDB);
      jest
        .spyOn(mockSelectionRepository, 'createNew')
        .mockImplementation(async (_: ICreateSelectionDto) =>
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
      const mockSelectionRepository = new SelectionRepository({} as IDB);
      jest
        .spyOn(mockSelectionRepository, 'createNew')
        .mockImplementation(async (_: ICreateSelectionDto) =>
          faker.string.uuid()
        );
      const selectionService = new SelectionService(mockSelectionRepository);

      const mockSelection = getMockSelection({ useCleanText: false });

      // @TODO mock the function that stripts html tags and check the values

      const id = await selectionService.createNew(
        mockSelection as ICreateSelectionDto
      );

      expect(typeof id).toBe('string');
      expect(htmlToPlainText).toHaveBeenCalledWith(selections[0]!.rawText);
    });
  });

  describe('retrieve', () => {
    it.todo('should fail with invalid selection id');
    it.todo('should fail with selection that does not exist');
    it.todo('should retrieve the selection');
  });

  describe('delete', () => {
    it.todo('should fail with invalid selection id');
    it.todo('should fail with selection that does not exist');
    it.todo('should delete the selection');
  });
});
