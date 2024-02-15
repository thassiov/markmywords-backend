import { Request } from 'express';

import { RequestContextData } from '../../utils/types';

class Context {
  static _bindings = new WeakMap<Request, Context>();

  public data: RequestContextData = {};

  static bind(req: Request): void {
    const ctx = new Context();
    Context._bindings.set(req, ctx);
  }

  static get(req: Request): RequestContextData | null {
    const ctx = Context._bindings.get(req);

    if (!ctx) {
      return null;
    }

    return ctx.data;
  }
}

export { Context };
