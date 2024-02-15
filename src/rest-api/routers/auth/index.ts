import { Router } from 'express';

import { AccountService } from '../../../services/account';
import { AuthService } from '../../../services/auth';
import { createAccountHandlerFactory } from '../account/create';
import { loginHandlerFactory } from './login';
import { logoutHandlerFactory } from './logout';
import { refreshSessionHandlerFactory } from './refresh';

function setupSignupLoginRouter(
  authService: AuthService,
  accountService: AccountService
): Router {
  const router = Router();

  router.post('/signup', createAccountHandlerFactory(accountService));
  router.post('/login', loginHandlerFactory(authService, accountService));

  return router;
}

function setupSessionRouter(authService: AuthService): Router {
  const router = Router();

  router.post('/logout', logoutHandlerFactory(authService));
  router.post('/refresh', refreshSessionHandlerFactory(authService));

  return router;
}

export { setupSignupLoginRouter, setupSessionRouter };
