import { sign, verify } from 'jsonwebtoken';
import { deepStrictEqual } from 'node:assert/strict';

import { JWTTokenRepository } from '../../repositories/token';
import { configs } from '../../utils/configs';
import { ServiceError, ValidationError } from '../../utils/errors';

// @NOTE I think I'll set it to 'accountId: <string>, roles: [<string>]' later on
type TokenPayload = { accountId: string };
type TokenType = 'access' | 'refresh';
const JWT_ALGORITHM = 'RS256';

class AuthService {
  constructor(private readonly repository: JWTTokenRepository) {}

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

  async invalidateAccessToken(accessToken: string): Promise<string> {
    try {
      const secretOrPubKey =
        configs.appJWTAccessTokenPublicKey || configs.appJWTAccessTokenSecret;

      const tokenId = await this.invalidateJWTToken(
        accessToken,
        secretOrPubKey,
        'access'
      );

      return tokenId;
    } catch (error) {
      throw new ServiceError('Error during access token invalidation', {
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

  async invalidateRefreshToken(refreshToken: string): Promise<string> {
    try {
      const secretOrPubKey =
        configs.appJWTRefreshTokenPublicKey || configs.appJWTRefreshTokenSecret;

      const tokenId = await this.invalidateJWTToken(
        refreshToken,
        secretOrPubKey,
        'refresh'
      );

      return tokenId;
    } catch (error) {
      throw new ServiceError('Error during refresh token invalidation', {
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

  private async invalidateJWTToken(
    accessToken: string,
    secretOrPubKey: string,
    tokenType: TokenType
  ): Promise<string> {
    try {
      const { exp, accountId } = verify(accessToken, secretOrPubKey) as {
        exp: number;
        accountId: string;
      };

      const expiresAt = new Date(exp * 1000);

      const tokenId = await this.repository.create({
        accountId,
        expiresAt,
        token: accessToken,
        type: tokenType,
      });

      return tokenId;
    } catch (error) {
      throw new ServiceError('Error during jwt token invalidation', {
        cause: error as Error,
        details: {
          service: 'auth',
        },
      });
    }
  }
}

export { AuthService };
