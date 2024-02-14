import { Router } from 'express';

import { CommentService } from '../../../services/comment';

function setupCommentRouter(commentService: CommentService): Router {
  const router = Router();

  return router;
}

export { setupCommentRouter };
