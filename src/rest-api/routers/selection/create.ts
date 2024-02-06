import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  SelectionDto,
  createSelectionDtoSchema,
} from '../../../models/selection';
import { SelectionService } from '../../../services';
import { EndpointHandlerError } from '../../../utils/errors';
import { EndpointHandler } from '../../../utils/types';

function createSelectionHandlerFactory(
  selectionService: SelectionService
): EndpointHandler {
  return async function createSelectionHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!createSelectionDtoSchema.safeParse(req.body).success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message:
            'Invalid request body format. Please ensure the request body follows the expected format.',
        });
        return;
      }

      const dto = SelectionDto.rawJsonToSelectionDto(req.body);
      // @NOTE maybe I should inject the service method here instead of import it
      const result = await selectionService.create(dto);

      res.status(StatusCodes.CREATED).json({ id: result });
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'createSelectionHandler',
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

export { createSelectionHandlerFactory };
