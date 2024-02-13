import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

import { AuthService } from './AuthService';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  describe('password operations', () => {
    describe('hashing', () => {
      it('should hash a given password', async () => {
        const mockPassword = 'thispasswordissecure';
        const mockSalt = 'salt';
        const mockHash = 'hash';
        (bcryptjs.genSalt as jest.Mock).mockResolvedValueOnce(mockSalt);
        (bcryptjs.hash as jest.Mock).mockResolvedValueOnce(mockHash);

        const authService = new AuthService();

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

        const authService = new AuthService();

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
        const mockTokenPayload = { userId: 'thisuserexists' };

        const mockToken = 'token';
        (jsonwebtoken.sign as jest.Mock).mockReturnValueOnce(mockToken);

        const authService = new AuthService();

        const result = authService.issueAccessToken(mockTokenPayload);

        expect(result).toEqual(mockToken);
      });

      it('should verify a access token', () => {
        const mockTokenPayload = { userId: 'thisuserexists' };

        const mockToken = 'token';
        (jsonwebtoken.verify as jest.Mock).mockReturnValueOnce(
          mockTokenPayload
        );

        const authService = new AuthService();

        const result = authService.verifyAccessToken(
          mockToken,
          mockTokenPayload
        );

        expect(result).toEqual(true);
      });
    });

    describe('refresh token', () => {
      it('should issue a new refresh token', () => {
        const mockTokenPayload = { userId: 'thisuserexists' };

        const mockToken = 'token';
        (jsonwebtoken.sign as jest.Mock).mockReturnValueOnce(mockToken);

        const authService = new AuthService();

        const result = authService.issueRefreshToken(mockTokenPayload);

        expect(result).toEqual(mockToken);
      });

      it('should verify a refresh token', () => {
        const mockTokenPayload = { userId: 'thisuserexists' };

        const mockToken = 'token';
        (jsonwebtoken.verify as jest.Mock).mockReturnValueOnce(
          mockTokenPayload
        );

        const authService = new AuthService();

        const result = authService.verifyRefreshToken(
          mockToken,
          mockTokenPayload
        );

        expect(result).toEqual(true);
      });
    });
  });
});
