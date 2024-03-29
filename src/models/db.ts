import { Sequelize } from 'sequelize';

import { configs } from '../utils/configs';
import { DatabaseInstanceError } from '../utils/errors';

let db: Sequelize;

try {
  const dbConnectString =
    configs.dbType == 'sqlite'
      ? `${configs.dbType}:${configs.dbLocation}`
      : `${configs.dbType}://${configs.dbUser}:${configs.dbPassword}@${configs.dbHost}:${configs.dbPort}/${configs.dbName}`;

  db = new Sequelize(dbConnectString, { logging: false });
} catch (error) {
  throw new DatabaseInstanceError(
    'Error creating database instance. Please check the database configuration and connection parameters',
    { cause: error as Error }
  );
}

export { db };
