import { SelectionDto } from '../../models';
import { IDB } from '../../models/db';
import { ICreateSelectionDto, IGetSelectionDto } from '../../models/selection';

class SelectionRepository {
  constructor(private readonly db: IDB) {}

  async createNew(selection: ICreateSelectionDto): Promise<string> {
    const selectionData = SelectionDto.createSelectionDtoToModel(selection);
    const id = await this.db.create(selectionData);
    return id;
  }

  async retrieveSelection(
    selectionId: string
  ): Promise<IGetSelectionDto | null> {
    const selection = await this.db.findOne(selectionId);

    if (!selection) {
      return null;
    }

    return SelectionDto.modelToGetSelection(selection);
  }

  async deleteSelection(selectionId: string): Promise<boolean> {
    const result = await this.db.deleteOne(selectionId);

    if (!result) {
      return false;
    }

    return true;
  }
}

export { SelectionRepository };
