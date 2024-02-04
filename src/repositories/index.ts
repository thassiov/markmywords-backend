import { db } from '../models/db';
import { AccountRepository } from './account';
import { ProfileRepository } from './profile';
import { SelectionRepository } from './selection';

const selectionRepository = new SelectionRepository(db);

export { selectionRepository, AccountRepository, ProfileRepository };
