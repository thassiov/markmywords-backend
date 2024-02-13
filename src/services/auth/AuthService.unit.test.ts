import bcryptjs from 'bcryptjs';

import { AuthService } from './AuthService';

jest.mock('bcryptjs');

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
});
