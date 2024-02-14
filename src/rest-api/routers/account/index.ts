import { Router } from 'express';

import { AccountService } from '../../../services/account';
import { createAccountHandlerFactory } from './create';
import { removeAccountHandlerFactory } from './remove';

function setupAccountRouter(accountService: AccountService): Router {
  const router = Router();

  router.post('/signup', createAccountHandlerFactory(accountService));
  router.delete(
    '/accounts/:accountId',
    removeAccountHandlerFactory(accountService)
  );

  return router;
}

export { setupAccountRouter };
