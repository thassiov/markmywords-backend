import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { CommentService } from '../../../services/comment';
import { EndpointHandlerError, ErrorMessages } from '../../../utils/errors';
import { EndpointHandler } from '../../../utils/types';

const commentIdSchema = z.string().uuid();

function removeCommentHandlerFactory(
  commentService: CommentService
): EndpointHandler {
  return async function removeCommentHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!commentIdSchema.safeParse(req.params?.commentId).success) {
        res.status(StatusCodes.BAD_REQUEST).type('application/json').json({
          message: ErrorMessages.INVALID_ID,
        });
        return;
      }

      const result = await commentService.remove(
        req.params?.commentId as string
      );

      if (!result) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .type('application/json')
          .json({
            message: ErrorMessages.COULD_NOT_DELETE_COMMENT,
          });
        return;
      }

      res.status(StatusCodes.NO_CONTENT).type('application/json').send();
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'removeCommentHandler',
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

export { removeCommentHandlerFactory };
