import { DatabaseInstanceError } from '../utils/errors';
import { logger } from '../utils/logger';
import {
  IAccount,
  ICreateAccounAndProfileDto,
  ICreateAccountDto,
  accountSchema,
  createAccountAndProfileDtoSchema,
  createAccountDtoSchema,
} from './account';
import { db } from './db';
import {
  ICreateProfileDto,
  IProfile,
  createProfileDto,
  profileSchema,
} from './profile';
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
  IProfile,
  profileSchema,
  IAccount,
  accountSchema,
  createAccountDtoSchema,
  ICreateAccountDto,
  createAccountAndProfileDtoSchema,
  ICreateAccounAndProfileDto,
  ICreateProfileDto,
  createProfileDto,
};
