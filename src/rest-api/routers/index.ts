import { Router } from 'express';

import { Services } from '../../utils/types';
import { requiresAuthenticationMiddlewareFactory } from '../middlewares/requiresAuthentication';
import { setupAccountRouter } from './account';
import { setupSessionRouter, setupSignupLoginRouter } from './auth';
import { setupCommentRouter } from './comment';
import { setupSelectionRouter } from './selection';

function setupRouter(services: Services): Router {
  const router = Router();

  const requiresAuthentication = requiresAuthenticationMiddlewareFactory(
    services.auth
  );

  router.use('/', setupSignupLoginRouter(services.auth, services.account));
  router.use(
    '/session',
    requiresAuthentication,
    setupSessionRouter(services.auth)
  );
  router.use(
    '/accounts',
    requiresAuthentication,
    setupAccountRouter(services.account)
  );
  router.use(
    '/selections',
    requiresAuthentication,
    setupSelectionRouter(services.selection, services.comment)
  );
  router.use(
    '/comments',
    requiresAuthentication,
    setupCommentRouter(services.comment)
  );

  return router;
}

export { setupRouter };
