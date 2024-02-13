import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import { db } from '../db';

class JWTTokenModel extends Model {}

JWTTokenModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('access', 'refresh'),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'invalidated_jwttokens',
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['token'],
      },
    ],
  }
);

const jwtTokenStringSchema = z
  .string()
  .regex(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/);

const jwtTokenSchema = z.object({
  id: z.string().uuid().optional(),
  token: jwtTokenStringSchema,
  type: z.enum(['access', 'refresh']),
  expiresAt: z.date(),
  accountId: z.string().uuid(),
});

type IJWTToken = z.infer<typeof jwtTokenSchema>;

export { IJWTToken, JWTTokenModel };
