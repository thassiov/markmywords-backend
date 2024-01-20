import { db } from '../models/db';
import { SelectionRepository } from './selection';

const selectionRepository = new SelectionRepository(db);

export { selectionRepository };
