import { Request, Response } from 'express';

import { SelectionService } from '../services';
import { AccountService } from '../services/account';

export type EndpointHandler = (req: Request, res: Response) => Promise<void>;

export type Services = {
  selection: SelectionService;
  account: AccountService;
};
