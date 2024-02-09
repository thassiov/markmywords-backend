import { DatabaseInstanceError } from '../utils/errors';
import { logger } from '../utils/logger';
import {
  AccountModel,
  IAccount,
  ICreateAccounAndProfileDto,
  ICreateAccountDto,
  accountSchema,
  createAccountAndProfileDtoSchema,
  createAccountDtoSchema,
} from './account';
import {
  CommentModel,
  IComment,
  ICreateCommentDto,
  commentSchema,
  createCommentDtoSchema,
} from './comment';
import { db } from './db';
import {
  ICreateProfileDto,
  IProfile,
  ProfileModel,
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

AccountModel.hasOne(ProfileModel, {
  foreignKey: {
    name: 'accountId',
    allowNull: false,
  },
});
ProfileModel.belongsTo(AccountModel);

AccountModel.hasMany(SelectionModel, {
  foreignKey: {
    name: 'accountId',
    allowNull: false,
  },
});
SelectionModel.belongsTo(AccountModel);

AccountModel.hasMany(CommentModel, {
  foreignKey: {
    name: 'accountId',
    allowNull: false,
  },
});
CommentModel.belongsTo(AccountModel);

SelectionModel.hasMany(CommentModel, {
  foreignKey: {
    name: 'selectionId',
    allowNull: false,
  },
});
CommentModel.belongsTo(SelectionModel);

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
  CommentModel,
  IComment,
  ICreateCommentDto,
  commentSchema,
  createCommentDtoSchema,
};
