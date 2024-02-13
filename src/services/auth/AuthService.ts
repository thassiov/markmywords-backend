import { compare, genSalt, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { deepStrictEqual } from 'node:assert/strict';

import { configs } from '../../utils/configs';
import { ServiceError, ValidationError } from '../../utils/errors';

// @NOTE I think I'll set it to 'userid: <string>, roles: [<string>]' later on
type TokenPayload = { userId: string };
const JWT_ALGORITHM = 'RS256';

class AuthService {
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await genSalt(configs.appAccountPasswordSaltGenRounds);
      const newHash = await hash(password, salt);
      return newHash;
    } catch (error) {
      throw new ServiceError('Could not hash password', {
        cause: error as Error,
        details: {
          service: 'auth',
        },
      });
    }
  }

  async verifyPasswordHash(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    try {
      const result = await compare(password, passwordHash);
      return result;
    } catch (error) {
      throw new ServiceError('Could not verify password hash', {
        cause: error as Error,
        details: {
          service: 'auth',
        },
      });
    }
  }

  issueAccessToken(payload: TokenPayload): string {
    try {
      const secretOrPrivKey =
        configs.appJWTAccessTokenPrivateKey || configs.appJWTAccessTokenSecret;

      return this.issueJWTToken(
        payload,
        secretOrPrivKey,
        configs.appJWTAccessTokenExpirationInSeconds
      );
    } catch (error) {
      throw new ServiceError('Error during access token issue', {
        cause: error as Error,
        details: {
          service: 'auth',
          input: { payload },
        },
      });
    }
  }

  verifyAccessToken(accessToken: string, payload: TokenPayload): boolean {
    try {
      const secretOrPubKey =
        configs.appJWTAccessTokenPublicKey || configs.appJWTAccessTokenSecret;

      return this.verifyJWTToken(accessToken, payload, secretOrPubKey);
    } catch (error) {
      throw new ServiceError('Error during access token verification', {
        cause: error as Error,
        details: {
          service: 'auth',
        },
      });
    }
  }

  issueRefreshToken(payload: TokenPayload): string {
    try {
      const secretOrPrivKey =
        configs.appJWTRefreshTokenPrivateKey ||
        configs.appJWTRefreshTokenSecret;

      return this.issueJWTToken(payload, secretOrPrivKey);
    } catch (error) {
      throw new ServiceError('Error during refresh token issue', {
        cause: error as Error,
        details: {
          service: 'auth',
          input: { payload },
        },
      });
    }
  }

  verifyRefreshToken(refreshToken: string, payload: TokenPayload): boolean {
    try {
      const secretOrPubKey =
        configs.appJWTRefreshTokenPublicKey || configs.appJWTRefreshTokenSecret;

      return this.verifyJWTToken(refreshToken, payload, secretOrPubKey);
    } catch (error) {
      throw new ServiceError('Error during refresh token verification', {
        cause: error as Error,
        details: {
          service: 'auth',
        },
      });
    }
  }

  private issueJWTToken(
    payload: TokenPayload,
    secretOrPrivateKey: string,
    expiresIn?: number
  ): string {
    try {
      const token = sign(payload, secretOrPrivateKey, {
        expiresIn,
        algorithm: JWT_ALGORITHM,
      });

      return token;
    } catch (error) {
      throw new ServiceError('Could not issue jwt token', {
        cause: error as Error,
        details: {
          service: 'auth',
          input: { payload },
        },
      });
    }
  }

  private verifyJWTToken(
    accessToken: string,
    payload: TokenPayload,
    secretOrPublicKey: string
  ): boolean {
    try {
      const tokenPayload = verify(accessToken, secretOrPublicKey, {
        algorithms: [JWT_ALGORITHM],
      });

      // @NOTE if this check fails, it will throw an error
      deepStrictEqual(tokenPayload, payload);

      return true;
    } catch (error) {
      const errorName = (error as Error).name;
      const jwtErrors = [
        'TokenExpiredError',
        'JsonWebTokenError',
        'NotBeforeError',
      ];

      if (jwtErrors.includes(errorName)) {
        throw new ValidationError('Invalid access token', {
          cause: error as Error,
          details: { input: accessToken },
        });
      }

      throw new ServiceError('Could not verify jwt token', {
        cause: error as Error,
        details: {
          service: 'auth',
        },
      });
    }
  }
}

export { AuthService };
