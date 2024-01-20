import { SelectionDto } from '../../models';
import { IDB } from '../../models/db';
import { ICreateSelectionDto } from '../../models/selection';

class SelectionRepository {
  constructor(private readonly db: IDB) {}

  async createNew(selection: ICreateSelectionDto): Promise<string> {
    const selectionData = SelectionDto.createSelectionDtoToModel(selection);
    const id = await this.db.create(selectionData);
    return id;
  }
}

export { SelectionRepository };
