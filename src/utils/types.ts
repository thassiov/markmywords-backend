import { Request, Response } from 'express';

import { SelectionService } from '../services';

export type EndpointHandler = (req: Request, res: Response) => Promise<void>;

export type Services = {
  selection: SelectionService;
};
