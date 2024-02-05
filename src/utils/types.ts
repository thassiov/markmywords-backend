import { Request, Response } from "express";

export type EndpointHandler = (req: Request, res: Response) => Promise<void>;
