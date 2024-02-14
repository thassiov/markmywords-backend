import { Router } from 'express';

import { AccountService } from '../../../services/account';
import { AuthService } from '../../../services/auth';
import { createAccountHandlerFactory } from '../account/create';
import { loginHandlerFactory } from './login';

function setupAuthRouter(
  authService: AuthService,
  accountService: AccountService
): Router {
  const router = Router();

  router.post('/signup', createAccountHandlerFactory(accountService));
  router.post('/login', loginHandlerFactory(authService, accountService));

  return router;
}

export { setupAuthRouter };
