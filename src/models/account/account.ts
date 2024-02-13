import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import { configs } from '../../utils/configs';
import { db } from '../db';

class AccountModel extends Model {}

AccountModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'account',
    paranoid: true,
  }
);

const accountSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  handle: z.string().min(4),
  password: z.string().min(configs.appMinAccountPasswordLength),
});

const createAccountAndProfileDtoSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  handle: z.string().min(4),
  password: z.string().min(configs.appMinAccountPasswordLength),
});

const createAccountDtoSchema = z.object({
  email: z.string().email(),
  handle: z.string().min(4),
  password: z.string().min(configs.appMinAccountPasswordLength),
});

const retrieveAccountAndProfileDtoSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  handle: z.string().min(4),
  name: z.string().min(1),
});

type IAccount = z.infer<typeof accountSchema>;
type ICreateAccountDto = z.infer<typeof createAccountDtoSchema>;
type ICreateAccounAndProfileDto = z.infer<
  typeof createAccountAndProfileDtoSchema
>;
type IRetrieveAccountAndProfileDto = z.infer<
  typeof retrieveAccountAndProfileDtoSchema
>;

export {
  AccountModel,
  IAccount,
  accountSchema,
  ICreateAccountDto,
  createAccountDtoSchema,
  createAccountAndProfileDtoSchema,
  ICreateAccounAndProfileDto,
  IRetrieveAccountAndProfileDto,
};
