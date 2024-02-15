import { NextFunction, Request, Response } from 'express';

import { SelectionService } from '../services';
import { AccountService } from '../services/account';
import { AuthService } from '../services/auth';
import { CommentService } from '../services/comment';

export type EndpointHandler = (req: Request, res: Response) => Promise<void>;
export type ApiMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type Services = {
  selection: SelectionService;
  account: AccountService;
  comment: CommentService;
  auth: AuthService;
};

export type RequestContextData = {
  [key: string]: any;
};
