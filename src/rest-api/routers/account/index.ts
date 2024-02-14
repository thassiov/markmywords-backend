import { Router } from 'express';

import { AccountService } from '../../../services/account';
import { removeAccountHandlerFactory } from './remove';
import { retrieveAccountHandlerFactory } from './retrieve';

function setupAccountRouter(accountService: AccountService): Router {
  const router = Router();

  router.delete('/:accountId', removeAccountHandlerFactory(accountService));
  router.get('/:accountId', retrieveAccountHandlerFactory(accountService));

  return router;
}

export { setupAccountRouter };
