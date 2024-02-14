import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import { db } from '../db';

class CommentModel extends Model {}

CommentModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
    highlight_beginning: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    highlight_end: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'comment',
    paranoid: true,
  }
);

const createCommentRequestDtoSchema = z.object({
  body: z.string().min(1),
  highlight_beginning: z.number().min(1).optional(),
  highlight_end: z.number().min(1).optional(),
});

const createCommentDtoSchema = z.object({
  body: z.string().min(1),
  selectionId: z.string().uuid(),
  accountId: z.string().uuid(),
  highlight_beginning: z.number().min(1).optional(),
  highlight_end: z.number().min(1).optional(),
});

const commentSchema = createCommentDtoSchema;

type ICreateCommentDto = z.infer<typeof createCommentDtoSchema>;
type IComment = z.infer<typeof commentSchema>;

export {
  ICreateCommentDto,
  createCommentDtoSchema,
  commentSchema,
  IComment,
  CommentModel,
  createCommentRequestDtoSchema,
};
