import { Express } from 'express';
import { Sequelize } from 'sequelize';

import { startApi } from '..';
import { db } from '../../models';
import {
  AccountRepository,
  ProfileRepository,
  SelectionRepository,
} from '../../repositories';
import { CommentRepository } from '../../repositories/comment';
import { JWTTokenRepository } from '../../repositories/token';
import { SelectionService } from '../../services';
import { AccountService } from '../../services/account';
import { AuthService } from '../../services/auth';
import { CommentService } from '../../services/comment';
import { Services } from '../../utils/types';

type IntegrationTestServerHelpers = {
  api: Express;
  db: Sequelize;
};

async function setupServer(): Promise<IntegrationTestServerHelpers> {
  const tokenRepository = new JWTTokenRepository(db);
  const accountRepository = new AccountRepository(db);
  const profileRepository = new ProfileRepository(db);
  const selectionRepository = new SelectionRepository(db);
  const commentRepository = new CommentRepository(db);

  const authService = new AuthService(tokenRepository);
  const accountService = new AccountService(
    accountRepository,
    profileRepository
  );
  const selectionService = new SelectionService(selectionRepository);
  const commentService = new CommentService(
    commentRepository,
    selectionService
  );

  await db.sync();

  const services: Services = {
    auth: authService,
    account: accountService,
    selection: selectionService,
    comment: commentService,
  };

  const api = startApi(services, false) as Express;

  return { api, db };
}

export { setupServer };
