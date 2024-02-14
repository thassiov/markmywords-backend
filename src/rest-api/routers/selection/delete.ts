import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { SelectionService } from '../../../services';
import { EndpointHandlerError, ErrorMessages } from '../../../utils/errors';
import { EndpointHandler } from '../../../utils/types';

const selectionIdSchema = z.string().uuid();

function deleteSelectionHandlerFactory(
  selectionService: SelectionService
): EndpointHandler {
  return async function deleteSelectionHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!selectionIdSchema.safeParse(req.params.id).success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: ErrorMessages.INVALID_ID,
        });
        return;
      }

      const result = await selectionService.remove(req.params.id as string);

      if (!result) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ErrorMessages.COULD_NOT_DELETE_SELECTION,
        });
        return;
      }

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'deleteSelectionHandler',
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

export { deleteSelectionHandlerFactory };
