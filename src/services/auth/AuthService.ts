import { compare, genSalt, hash } from 'bcryptjs';

import { configs } from '../../utils/configs';
import { ServiceError } from '../../utils/errors';

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
}

export { AuthService };
