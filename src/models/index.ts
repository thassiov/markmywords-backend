import { DatabaseInstanceError } from '../utils/errors';
import { logger } from '../utils/logger';
import {
  AccountModel,
  IAccount,
  IAccountSafeFields,
  ICreateAccounAndProfileDto,
  ICreateAccountDto,
  IRetrieveAccountAndProfileDto,
  accountSchema,
  createAccountAndProfileDtoSchema,
  createAccountDtoSchema,
  loginDtoSchema,
} from './account';
import {
  CommentModel,
  IComment,
  ICreateCommentDto,
  commentSchema,
  createCommentDtoSchema,
  createCommentRequestDtoSchema,
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
import { IJWTToken, JWTTokenModel } from './token';

AccountModel.hasOne(ProfileModel, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'accountId',
    allowNull: false,
  },
});
ProfileModel.belongsTo(AccountModel);

AccountModel.hasMany(SelectionModel, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'accountId',
    allowNull: false,
  },
});
SelectionModel.belongsTo(AccountModel);

AccountModel.hasMany(CommentModel, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'accountId',
    allowNull: false,
  },
});
CommentModel.belongsTo(AccountModel);

AccountModel.hasMany(JWTTokenModel, {
  foreignKey: {
    name: 'accountId',
    allowNull: false,
  },
});
JWTTokenModel.belongsTo(AccountModel);

SelectionModel.hasMany(CommentModel, {
  onDelete: 'CASCADE',
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
  loginDtoSchema,
  createCommentRequestDtoSchema,
  IRetrieveAccountAndProfileDto,
  SelectionModel,
  selectionSchema,
  getSelectionDtoSchema,
  IGetSelectionDto,
  ISelection,
  SelectionDto,
  syncDb,
  db,
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
  JWTTokenModel,
  IJWTToken,
  IAccountSafeFields,
  AccountModel,
};
