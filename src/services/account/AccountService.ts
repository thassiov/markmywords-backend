import { compare, genSalt, hash } from 'bcryptjs';

import {
  IAccount,
  IAccountSafeFields,
  ICreateAccounAndProfileDto,
  IRetrieveAccountAndProfileDto,
  createAccountAndProfileDtoSchema,
} from '../../models';
import { AccountRepository, ProfileRepository } from '../../repositories';
import { configs } from '../../utils/configs';
import {
  ErrorMessages,
  ServiceError,
  ValidationError,
} from '../../utils/errors';

class AccountService {
  constructor(
    private readonly accRepository: AccountRepository,
    private readonly profileRepository: ProfileRepository
  ) {}

  async create(newAccountDto: ICreateAccounAndProfileDto): Promise<string> {
    try {
      if (!createAccountAndProfileDtoSchema.safeParse(newAccountDto).success) {
        throw new ValidationError(
          ErrorMessages.CREATE_ACCOUNT_INVALID_ACCOUNT_INFO
        );
      }

      const hashedPassword = await this.hashPassword(newAccountDto.password);

      const accountInfo = {
        email: newAccountDto.email,
        handle: newAccountDto.handle,
        password: hashedPassword,
      };

      const profileInfo = { name: newAccountDto.name };

      // @NOTE it is important to make both operations under the same transaction.
      // I'll do it later as this works for now
      const accountId = await this.accRepository.create(accountInfo);
      await this.profileRepository.create({ ...profileInfo, accountId });

      return accountId;
    } catch (error) {
      throw new ServiceError('Could not store new account record', {
        cause: error as Error,
        details: {
          service: 'account',
          input: newAccountDto,
        },
      });
    }
  }

  async remove(accountId: string): Promise<boolean> {
    try {
      return this.accRepository.remove(accountId);
    } catch (error) {
      throw new ServiceError('Could not remove account', {
        cause: error as Error,
        details: {
          service: 'account',
          input: accountId,
        },
      });
    }
  }

  async retrieve(
    accountId: string
  ): Promise<IRetrieveAccountAndProfileDto | null> {
    try {
      const accountInfo =
        await this.accRepository.retrieveSafeFieldsByAccountId(accountId);

      if (!accountInfo) {
        return null;
      }

      const profileInfo =
        await this.profileRepository.retrieveByAccountId(accountId);

      if (!profileInfo) {
        return null;
      }

      return {
        id: accountInfo.id,
        name: profileInfo.name,
        handle: accountInfo.handle,
        email: accountInfo.email,
      } as IRetrieveAccountAndProfileDto;
    } catch (error) {
      throw new ServiceError('Could not retrieve account', {
        cause: error as Error,
        details: {
          service: 'account',
          input: accountId,
        },
      });
    }
  }

  async retrieveByUserhandleOrEmailIfPasswordMatches(
    accountIdentifier: string,
    password: string
  ): Promise<Omit<IAccount, 'password'> | null> {
    try {
      const account =
        await this.accRepository.retrieveByUserhandleOrEmail(accountIdentifier);

      if (!account) {
        return null;
      }

      const { password: hashedPassword, ...rest } = account;

      const isMatch = await this.verifyPasswordHash(password, hashedPassword);

      if (!isMatch) {
        return null;
      }

      return rest;
    } catch (error) {
      throw new ServiceError('Could not retrieve account', {
        cause: error as Error,
        details: {
          service: 'account',
          input: { accountIdentifier },
        },
      });
    }
  }

  async retrieveSafeFieldsByUserhandleOrEmail(
    accountIdentifier: string
  ): Promise<IAccountSafeFields | null> {
    try {
      return this.accRepository.retrieveSafeFieldsByUserhandleOrEmail(
        accountIdentifier
      );
    } catch (error) {
      throw new ServiceError('Could not retrieve account', {
        cause: error as Error,
        details: {
          service: 'account',
          input: { accountIdentifier },
        },
      });
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await genSalt(configs.appAccountPasswordSaltGenRounds);
      const newHash = await hash(password, salt);
      return newHash;
    } catch (error) {
      throw new ServiceError('Could not hash password', {
        cause: error as Error,
        details: {
          service: 'account',
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
          service: 'account',
        },
      });
    }
  }
}

export { AccountService };
