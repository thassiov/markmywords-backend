import { config } from 'dotenv';

config();

const jwtConfigs = {
  // 1 day
  appJWTAccessTokenExpirationInSeconds:
    parseInt(
      process.env.APP_JWT_ACCESS_TOKEN_EXPIRATION_IN_SECONDS as string
    ) || 86400,
  appJWTAccessTokenPrivateKey:
    process.env.APP_JWT_ACCESS_TOKEN_PRIVATE_KEY || '',
  appJWTAccessTokenPublicKey: process.env.APP_JWT_ACCESS_TOKEN_PUBLIC_KEY || '',
  appJWTAccessTokenSecret:
    process.env.APP_JWT_ACCESS_SECRET || 'a_very_secure_at_secret',

  appJWTRefreshTokenPrivateKey:
    process.env.APP_JWT_REFRESH_TOKEN_PRIVATE_KEY || '',
  appJWTRefreshTokenPublicKey:
    process.env.APP_JWT_REFRESH_TOKEN_PUBLIC_KEY || '',
  appJWTRefreshTokenSecret:
    process.env.APP_JWT_REFRESH_SECRET || 'a_very_secure_rt_secret',
};

const dbConfigs = {
  dbType: process.env.DB_TYPE || 'sqlite',
  dbLocation: process.env.DB_LOCATION || '/tmp/mmwdatabase.sqlite',
  dbUser: process.env.DB_USER || 'localuser',
  dbPassword: process.env.DB_PASSWORD || 'password',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT as string) || 5432,
  dbName: process.env.DB_NAME || 'mmw',
};

const restApiConfigs = {
  apiPort: parseInt(process.env.API_PORT as string) || 8080,
  appEnvironment: process.env.NODE_ENV || 'development',
  appServerPublicKey: process.env.SERVER_PUBLIC_KEY || '',
  appServerPrivateKey: process.env.SERVER_PRIVATE_KEY || '',
  // 6 months
  appServerCookieDurationInSeconds:
    parseInt(process.env.SERVER_COOKIE_DURATION_IN_SECONDS as string) ||
    15780000,
};

const userPasswordConfigs = {
  appMinAccountPasswordLength:
    parseInt(process.env.APP_MIN_ACCOUNT_PASSWORD_LENGTH as string) || 8,
  appAccountPasswordSaltGenRounds:
    parseInt(process.env.APP_ACCOUNT_PASSWORD_SALT_GEN_ROUNDS as string) || 12,
};

const configs = {
  ...dbConfigs,
  ...restApiConfigs,
  ...userPasswordConfigs,
  ...jwtConfigs,
};

export { configs };
