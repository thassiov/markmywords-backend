import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { createCommentRequestDtoSchema } from '../../../models';
import { SelectionService } from '../../../services';
import { CommentService } from '../../../services/comment';
import { EndpointHandlerError, ErrorMessages } from '../../../utils/errors';
import { EndpointHandler } from '../../../utils/types';

const selectionIdSchema = z.string().uuid();

function createCommentHandlerFactory(
  commentService: CommentService,
  selectionService: SelectionService
): EndpointHandler {
  return async function createCommentHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!selectionIdSchema.safeParse(req.params?.selectionId).success) {
        res.status(StatusCodes.BAD_REQUEST).type('application/json').json({
          message: ErrorMessages.INVALID_ID,
        });
        return;
      }

      if (!createCommentRequestDtoSchema.safeParse(req.body).success) {
        res.status(StatusCodes.BAD_REQUEST).type('application/json').json({
          message: ErrorMessages.CREATE_COMMENT_INVALID_DATA_FORMAT,
        });
        return;
      }

      const selection = await selectionService.retrieve(
        req.params.selectionId as string
      );

      if (!selection) {
        res.status(StatusCodes.NOT_FOUND).type('application/json').json({
          message: ErrorMessages.SELECTION_NOT_FOUND,
        });
        return;
      }

      // @TODO the `accountId` will be sent in the querystring for now, but
      // I'll add the auth middleware later so this info can be better managed
      const result = await commentService.create({
        ...req.body,
        selectionId: req.params.selectionId,
        accountId: req.query.accountId,
      });

      res
        .status(StatusCodes.CREATED)
        .type('application/json')
        .json({ id: result });
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'createCommentHandler',
          request: {
            method: req.method,
            headers: req.headers,
            body: req.body,
            url: req.url,
          },
        },
      });
    }
  };
}

export { createCommentHandlerFactory };
