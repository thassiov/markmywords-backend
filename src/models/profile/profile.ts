import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import { db } from '../db';

class ProfileModel extends Model {}

ProfileModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'profile',
    paranoid: true,
  }
);

const profileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  accountId: z.string().uuid(),
});

const createProfileDto = z.object({
  name: z.string().min(1),
  accountId: z.string().uuid(),
});

type IProfile = z.infer<typeof profileSchema>;
type ICreateProfileDto = z.infer<typeof createProfileDto>;

export {
  ProfileModel,
  IProfile,
  profileSchema,
  ICreateProfileDto,
  createProfileDto,
};
