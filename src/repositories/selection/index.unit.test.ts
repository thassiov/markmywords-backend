import { Sequelize, Transaction } from 'sequelize';

import { SelectionRepository } from '.';
import { SelectionModel } from '../../models';
import { getMockSelection } from '../../utils/tests/mocks/selection';

jest.mock('sequelize');

describe('Selection Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('creates a new selection', async () => {
      const mockSelection = getMockSelection();

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(SelectionModel, 'create').mockResolvedValueOnce({
        get: () => 'fakeid',
      });

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(SelectionModel);

      const selectionRepository = new SelectionRepository(sequelize);

      const result = await selectionRepository.createNew(mockSelection);

      expect(result).toBe('fakeid');
    });
  });

  describe('retrieve', () => {
    it('gets a selection', async () => {
      const mockSelection = getMockSelection();

      const sequelize = new Sequelize();

      jest.spyOn(SelectionModel, 'findOne').mockResolvedValueOnce({
        toJSON: () => mockSelection,
      } as SelectionModel);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(SelectionModel);

      const selectionRepository = new SelectionRepository(sequelize);

      const result = await selectionRepository.retrieveSelection('someid');

      expect(result).toEqual(mockSelection);
    });

    it('fails by trying to get a selection that does not exist', async () => {
      const sequelize = new Sequelize();

      jest.spyOn(SelectionModel, 'findOne').mockResolvedValueOnce(null);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(SelectionModel);

      const selectionRepository = new SelectionRepository(sequelize);

      const result = await selectionRepository.retrieveSelection('someid');

      expect(result).toEqual(null);
    });
  });

  describe('delete', () => {
    it('deletes a selection', async () => {
      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(SelectionModel, 'destroy').mockResolvedValueOnce(1);
      jest.spyOn(sequelize, 'model').mockReturnValueOnce(SelectionModel);

      const selectionRepository = new SelectionRepository(sequelize);

      const result = await selectionRepository.deleteSelection('someid');

      expect(result).toBe(true);
    });

    it('fails by trying to delete a selection that does not exist', async () => {
      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(SelectionModel, 'destroy').mockResolvedValueOnce(0);
      jest.spyOn(sequelize, 'model').mockReturnValueOnce(SelectionModel);

      const selectionRepository = new SelectionRepository(sequelize);

      const result = await selectionRepository.deleteSelection('someid');

      expect(result).toBe(false);
    });
  });
});
