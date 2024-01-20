import { selectionRepository } from '../repositories';
import { SelectionService } from './selection';

const selectionService = new SelectionService(selectionRepository);

export { selectionService };
