import {
  ICreateSelectionDto,
  createSelectionDtoSchema,
} from '../../models/selection';
import { SelectionRepository } from '../../repositories/selection';
import { ServiceError } from '../../utils/errors';
import { htmlToPlainText } from '../../utils/text-parsers';

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
}

export { SelectionService };
