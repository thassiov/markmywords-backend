import { Router } from 'express';

import { SelectionService } from '../../../services';
import { CommentService } from '../../../services/comment';
import { createCommentHandlerFactory } from '../comment/create';
import { createSelectionHandlerFactory } from './create';
import { deleteSelectionHandlerFactory } from './delete';
import { retrieveSelectionHandlerFactory } from './retrieve';

function setupSelectionRouter(
  selectionService: SelectionService,
  commentService: CommentService
): Router {
  const router = Router();

  router.post('/', createSelectionHandlerFactory(selectionService));
  router.get(
    '/:selectionId',
    retrieveSelectionHandlerFactory(selectionService)
  );

  // @TODO for now these routes will be handled by endpoints handlers in another directory
  router.post(
    '/:selectionId/comment',
    createCommentHandlerFactory(commentService, selectionService)
  );

  router.delete(
    '/:selectionId',
    deleteSelectionHandlerFactory(selectionService)
  );

  return router;
}

export { setupSelectionRouter };
