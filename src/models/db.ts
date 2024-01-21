import { ISelection } from './selection';

type IDB = {
  create: (...args: unknown[]) => Promise<string>;
  findOne: (_: string) => Promise<ISelection>;
  deleteOne: (_: string) => Promise<boolean>;
};

const db: IDB = {
  create: async (..._: unknown[]) => 'id',
  findOne: async (_: string) => ({}) as ISelection,
  deleteOne: async (_: string) => true,
};

export { db, IDB };
