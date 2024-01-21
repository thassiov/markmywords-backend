import { config } from 'dotenv';

config();

const configs = {
  dbType: process.env.DB_TYPE || 'sqlite',
  dbLocation: process.env.DB_LOCATION || '/tmp/mmwdatabase.sqlite',
  dbUser: process.env.DB_USER || 'localuser',
  dbPassword: process.env.DB_PASSWORD || 'password',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || 5432,
  dbName: process.env.DB_NAME || 'mmw',
  apiPort: process.env.API_PORT || 8080,
  appEnvironment: process.env.NODE_ENV || 'development',
};

export { configs };
