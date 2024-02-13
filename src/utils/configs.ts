import { config } from 'dotenv';

config();

const configs = {
  dbType: process.env.DB_TYPE || 'sqlite',
  dbLocation: process.env.DB_LOCATION || '/tmp/mmwdatabase.sqlite',
  dbUser: process.env.DB_USER || 'localuser',
  dbPassword: process.env.DB_PASSWORD || 'password',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT as string) || 5432,
  dbName: process.env.DB_NAME || 'mmw',
  apiPort: parseInt(process.env.API_PORT as string) || 8080,
  appEnvironment: process.env.NODE_ENV || 'development',
  appMinAccountPasswordLength:
    parseInt(process.env.APP_MIN_ACCOUNT_PASSWORD_LENGTH as string) || 8,
  appAccountPasswordSaltGenRounds:
    parseInt(process.env.APP_ACCOUNT_PASSWORD_SALT_GEN_ROUNDS as string) || 12,
};

export { configs };
