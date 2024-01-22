import { DatabaseInstanceError } from '../utils/errors';
import { logger } from '../utils/logger';
import { db } from './db';
import {
  IGetSelectionDto,
  ISelection,
  SelectionDto,
  SelectionModel,
  getSelectionDtoSchema,
  selectionSchema,
} from './selection';

async function syncDb(): Promise<void> {
  try {
    logger.info('Syncing models to the database');
    await db.sync();
  } catch (error) {
    throw new DatabaseInstanceError('Could not sync models to the database', {
      cause: error as Error,
    });
  }
}

export {
  SelectionModel,
  selectionSchema,
  getSelectionDtoSchema,
  IGetSelectionDto,
  ISelection,
  SelectionDto,
  syncDb,
};
