import { Router } from 'express';

import { SelectionService } from '../../../services';
import { createSelectionHandlerFactory } from './create';
import { deleteSelectionHandlerFactory } from './delete';
import { retrieveSelectionHandlerFactory } from './retrieve';

function setupSelectionRouter(selectionService: SelectionService): Router {
  const router = Router();

  router.post('/', createSelectionHandlerFactory(selectionService));
  router.get(
    '/:selectionId',
    retrieveSelectionHandlerFactory(selectionService)
  );
  router.delete(
    '/:selectionId',
    deleteSelectionHandlerFactory(selectionService)
  );

  return router;
}

export { setupSelectionRouter };
