import { ModelStatic, Op, Sequelize, Transaction } from 'sequelize';

import { SelectionDto } from '../../models';
import {
  ICreateSelectionDto,
  IGetSelectionDto,
  SelectionModel,
} from '../../models/selection';
import { RepositoryError } from '../../utils/errors';

class SelectionRepository {
  private readonly db: ModelStatic<SelectionModel>;
  constructor(private readonly sequelize: Sequelize) {
    this.db = this.sequelize.model('selection');
  }

  async create(selection: ICreateSelectionDto): Promise<string> {
    const transaction = await this.getTransaction();
    try {
      const selectionData = SelectionDto.createSelectionDtoToModel(selection);
      const newSelection = await this.db.create(selectionData, { transaction });
      await transaction.commit();
      return newSelection.get('id') as string;
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Could not create new selection', {
        cause: error as Error,
        details: {
          repository: 'selection',
          input: selection,
        },
      });
    }
  }

  async retrieve(selectionId: string): Promise<IGetSelectionDto | null> {
    try {
      const selection = await this.db.findOne({
        where: {
          id: {
            [Op.eq]: selectionId,
          },
        },
      });

      if (!selection) {
        return null;
      }

      return SelectionDto.modelToGetSelection(selection.toJSON());
    } catch (error) {
      throw new RepositoryError('could not retrieve selection', {
        cause: error as Error,
        details: {
          repository: 'selection',
          input: selectionId,
        },
      });
    }
  }

  async remove(selectionId: string): Promise<boolean> {
    const transaction = await this.getTransaction();

    try {
      const result = await this.db.destroy({
        transaction,
        where: {
          id: {
            [Op.eq]: selectionId,
          },
        },
      });

      await transaction.commit();

      if (!result) {
        return false;
      }

      return true;
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('could not delete selection', {
        cause: error as Error,
        details: {
          repository: 'selection',
          input: selectionId,
        },
      });
    }
  }

  private async getTransaction(): Promise<Transaction> {
    const t = await this.sequelize.transaction();
    return t;
  }
}

export { SelectionRepository };
