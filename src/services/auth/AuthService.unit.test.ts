import jsonwebtoken from 'jsonwebtoken';

import { JWTTokenRepository } from '../../repositories/token';
import { AuthService } from './AuthService';

jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const mockJWTTokenRepository = {
    create: jest.fn(),
  };

  describe('jwt token', () => {
    describe('access token', () => {
      it('should issue a new access token', () => {
        const mockTokenPayload = { accountId: 'thisuserexists' };

        const mockToken = 'token';
        (jsonwebtoken.sign as jest.Mock).mockReturnValueOnce(mockToken);

        const authService = new AuthService(
          mockJWTTokenRepository as any as JWTTokenRepository
        );

        const result = authService.issueAccessToken(mockTokenPayload);

        expect(result).toEqual(mockToken);
      });

      it('should verify a access token', () => {
        const mockTokenPayload = { accountId: 'thisuserexists' };

        const mockToken = 'token';
        (jsonwebtoken.verify as jest.Mock).mockReturnValueOnce(
          mockTokenPayload
        );

        const authService = new AuthService(
          mockJWTTokenRepository as any as JWTTokenRepository
        );

        const result = authService.verifyAccessToken(mockToken);

        expect(result).toEqual(mockTokenPayload);
      });

      it('should invalidate a given accessToken', async () => {
        const mockAccountId = 'someid';
        const mockTokenExpiration = 1234;
        const mockToken = 'token';
        const mockInvalidatedTokenId = 'invalidatedTokenRegisterId';
        (mockJWTTokenRepository.create as jest.Mock).mockResolvedValueOnce(
          mockInvalidatedTokenId
        );

        (jsonwebtoken.verify as jest.Mock).mockReturnValueOnce({
          accountId: mockAccountId,
          exp: mockTokenExpiration,
        });

        const authService = new AuthService(
          mockJWTTokenRepository as any as JWTTokenRepository
        );

        const result = await authService.invalidateAccessToken(mockToken);

        expect(result).toEqual(mockInvalidatedTokenId);
      });
    });

    describe('refresh token', () => {
      it('should issue a new refresh token', () => {
        const mockTokenPayload = { accountId: 'thisuserexists' };

        const mockToken = 'token';
        (jsonwebtoken.sign as jest.Mock).mockReturnValueOnce(mockToken);

        const authService = new AuthService(
          mockJWTTokenRepository as any as JWTTokenRepository
        );

        const result = authService.issueRefreshToken(mockTokenPayload);

        expect(result).toEqual(mockToken);
      });

      it('should verify a refresh token', () => {
        const mockTokenPayload = { accountId: 'thisuserexists' };

        const mockToken = 'token';
        (jsonwebtoken.verify as jest.Mock).mockReturnValueOnce(
          mockTokenPayload
        );

        const authService = new AuthService(
          mockJWTTokenRepository as any as JWTTokenRepository
        );

        const result = authService.verifyRefreshToken(mockToken);

        expect(result).toEqual(mockTokenPayload);
      });

      it('should invalidate a given refreshToken', async () => {
        const mockAccountId = 'someid';
        const mockTokenExpiration = 1234;
        const mockToken = 'token';
        const mockInvalidatedTokenId = 'invalidatedTokenRegisterId';
        (mockJWTTokenRepository.create as jest.Mock).mockResolvedValueOnce(
          mockInvalidatedTokenId
        );

        (jsonwebtoken.verify as jest.Mock).mockReturnValueOnce({
          accountId: mockAccountId,
          exp: mockTokenExpiration,
        });

        const authService = new AuthService(
          mockJWTTokenRepository as any as JWTTokenRepository
        );

        const result = await authService.invalidateRefreshToken(mockToken);

        expect(result).toEqual(mockInvalidatedTokenId);
      });
    });
  });
});
