import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { SelectionService } from '../../../services';
import { EndpointHandlerError } from '../../../utils/errors';
import { EndpointHandler } from '../../../utils/types';

const selectionIdSchema = z.string().uuid();

function retrieveSelectionHandlerFactory(
  selectionService: SelectionService
): EndpointHandler {
  return async function retrieveSelectionHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!selectionIdSchema.safeParse(req.params.id).success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message:
            'Invalid request param format. Please ensure the request param follows the expected format.',
        });
        return;
      }

      const result = await selectionService.retrieve(req.params.id as string);

      if (!result) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: 'Selection was not found',
          selectionId: req.params.id,
        });
        return;
      }

      res.status(StatusCodes.OK).json({ selection: result });
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'retrieveSelection',
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

export { retrieveSelectionHandlerFactory };
