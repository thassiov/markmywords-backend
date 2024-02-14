import { Router } from 'express';

import { CommentService } from '../../../services/comment';
import { removeCommentHandlerFactory } from './remove';

function setupCommentRouter(commentService: CommentService): Router {
  const router = Router();

  router.delete('/:commentId', removeCommentHandlerFactory(commentService));

  return router;
}

export { setupCommentRouter };
