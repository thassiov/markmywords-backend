import { NextFunction, Request, Response } from 'express';

import { Context } from '../lib/requestContext';

function addContext(req: Request, _: Response, next: NextFunction): void {
  Context.bind(req);
  next();
}

export { addContext };
