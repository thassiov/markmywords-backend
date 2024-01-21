import { z } from 'zod';
import {
  ICreateSelectionDto,
  IGetSelectionDto,
  createSelectionDtoSchema,
} from '../../models/selection';
import { SelectionRepository } from '../../repositories/selection';
import { ServiceError } from '../../utils/errors';
import { htmlToPlainText } from '../../utils/text-parsers';

const selectionIdSchema = z.string().uuid();

class SelectionService {
  constructor(private readonly repository: SelectionRepository) {}

  async createNew(selection: ICreateSelectionDto): Promise<string> {
    try {
      createSelectionDtoSchema.parse(selection);
      selection.text = htmlToPlainText(selection.rawText);
      const selectionId = await this.repository.createNew(selection);
      return selectionId;
    } catch (error) {
      throw new ServiceError('Could not create new selection', {
        cause: error as Error,
        details: {
          service: 'selection',
          input: selection,
        },
      });
    }
  }

  async retrieveSelection(
    selectionId: string
  ): Promise<IGetSelectionDto | null> {
    try {
      selectionIdSchema.parse(selectionId);
      const selection = await this.repository.retrieveSelection(selectionId);

      if (!selection) {
        // @NOTE maybe log here
        return null;
      }

      return selection;
    } catch (error) {
      throw new ServiceError('Could not retrieve selection', {
        cause: error as Error,
        details: {
          service: 'selection',
          input: selectionId,
        },
      });
    }
  }

  async deleteSelection(selectionId: string): Promise<boolean> {
    try {
      selectionIdSchema.parse(selectionId);

      const result = await this.repository.deleteSelection(selectionId);

      if (!result) {
        return false;
      }

      return true;
    } catch (error) {
      throw new ServiceError('Could not delete selection', {
        cause: error as Error,
        details: {
          service: 'selection',
          input: selectionId,
        },
      });
    }
  }
}

export { SelectionService };
