import { ICreateSelectionDto, IGetSelectionDto } from '../../models/selection';
import { SelectionRepository } from '../../repositories/selection';
import { ServiceError } from '../../utils/errors';
import { htmlToPlainText } from '../../utils/text-parsers';

class SelectionService {
  constructor(private readonly repository: SelectionRepository) {}

  async create(selectionDto: ICreateSelectionDto): Promise<string> {
    try {
      selectionDto.text = htmlToPlainText(selectionDto.rawText);
      const selectionId = await this.repository.create(selectionDto);
      return selectionId;
    } catch (error) {
      throw new ServiceError('Could not create new selection', {
        cause: error as Error,
        details: {
          service: 'selection',
          input: selectionDto,
        },
      });
    }
  }

  async retrieve(selectionId: string): Promise<IGetSelectionDto | null> {
    try {
      const selection = await this.repository.retrieve(selectionId);

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

  async remove(selectionId: string): Promise<boolean> {
    try {
      const result = await this.repository.remove(selectionId);

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
