import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { selectionService } from '../../../services';
import { EndpointHandlerError } from '../../../utils/errors';

const selectionIdSchema = z.string().uuid();

async function deleteSelectionHandler(
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

    const result = await selectionService.deleteSelection(
      req.params.id as string
    );

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Selection was not deleted',
        selectionId: req.params.id,
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
}

export { deleteSelectionHandler };
