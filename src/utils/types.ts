import { Request, Response } from 'express';

import { SelectionService } from '../services';
import { AccountService } from '../services/account';
import { CommentService } from '../services/comment';

export type EndpointHandler = (req: Request, res: Response) => Promise<void>;

export type Services = {
  selection: SelectionService;
  account: AccountService;
  comment: CommentService;
};
