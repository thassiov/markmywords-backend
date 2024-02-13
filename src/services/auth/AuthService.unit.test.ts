import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

import { JWTTokenRepository } from '../../repositories/token';
import { AuthService } from './AuthService';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const mockJWTTokenRepository = {
    create: jest.fn(),
  };

  describe('password operations', () => {
    describe('hashing', () => {
      it('should hash a given password', async () => {
        const mockPassword = 'thispasswordissecure';
        const mockSalt = 'salt';
        const mockHash = 'hash';
        (bcryptjs.genSalt as jest.Mock).mockResolvedValueOnce(mockSalt);
        (bcryptjs.hash as jest.Mock).mockResolvedValueOnce(mockHash);

        const authService = new AuthService(
          mockJWTTokenRepository as any as JWTTokenRepository
        );

        const result = await authService.hashPassword(mockPassword);

        expect(result).toEqual(mockHash);
        expect(bcryptjs.genSalt).toHaveBeenCalledTimes(1);
        expect(bcryptjs.hash).toHaveBeenCalledWith(mockPassword, mockSalt);
      });
    });

    describe('verifying', () => {
      it('should compare a plain text password with a hashed password', async () => {
        const mockPassword = 'thispasswordissecure';
        const mockHash = 'hash';
        (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(true);

        const authService = new AuthService(
          mockJWTTokenRepository as any as JWTTokenRepository
        );

        const result = await authService.verifyPasswordHash(
          mockPassword,
          mockHash
        );

        expect(result).toEqual(true);
        expect(bcryptjs.compare).toHaveBeenCalledWith(mockPassword, mockHash);
      });
    });
  });

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

        const result = authService.verifyAccessToken(
          mockToken,
          mockTokenPayload
        );

        expect(result).toEqual(true);
      });

      it('catches an error when verifying a token with tampered payload', () => {
        const mockTokenPayload = { accountId: 'thisuserexists' };

        const mockToken = 'token';
        (jsonwebtoken.verify as jest.Mock).mockReturnValueOnce({
          accountId: 'thisuserdoesnotexist',
        });

        const authService = new AuthService(
          mockJWTTokenRepository as any as JWTTokenRepository
        );

        expect(() =>
          authService.verifyAccessToken(mockToken, mockTokenPayload)
        ).toThrow(
          'Could not verify jwt token: Expected values to be strictly deep-equal'
        );
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

        const result = authService.verifyRefreshToken(
          mockToken,
          mockTokenPayload
        );

        expect(result).toEqual(true);
      });

      it('catches an error when verifying a token with tampered payload', () => {
        const mockTokenPayload = { accountId: 'thisuserexists' };

        const mockToken = 'token';
        (jsonwebtoken.verify as jest.Mock).mockReturnValueOnce({
          accountId: 'thisuserdoesnotexist',
        });

        const authService = new AuthService(
          mockJWTTokenRepository as any as JWTTokenRepository
        );

        expect(() =>
          authService.verifyRefreshToken(mockToken, mockTokenPayload)
        ).toThrow(
          'Could not verify jwt token: Expected values to be strictly deep-equal'
        );
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
