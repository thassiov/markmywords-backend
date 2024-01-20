type IDB = {
  create: (...args: unknown[]) => Promise<string>;
};

const db: IDB = {
  create: async (..._: unknown[]) => 'id',
};

export { db, IDB };
