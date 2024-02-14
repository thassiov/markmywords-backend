import { Router } from 'express';

import { Services } from '../../utils/types';
import { setupAccountRouter } from './account';
import { setupCommentRouter } from './comment';
import { setupSelectionRouter } from './selection';

function setupRouter(services: Services): Router {
  const router = Router();

  // @TODO will need to create a 'is-authenticated' middleware

  router.use('/', setupAccountRouter(services.account));
  router.use(
    '/selections',
    setupSelectionRouter(services.selection, services.comment)
  );
  router.use('/comments', setupCommentRouter(services.comment));

  return router;
}

export { setupRouter };
