import {
  ICreateAccounAndProfileDto,
  createAccountAndProfileDtoSchema,
} from '../../models';
import { AccountRepository, ProfileRepository } from '../../repositories';
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
      const accountInfo = {
        email: newAccountDto.email,
        handle: newAccountDto.handle,
      };

      const profileInfo = { name: newAccountDto.name };

      // @NOTE it is important to make both operations under the same transaction.
      // I'll do it later as this works for now
      const accountId = await this.accRepository.create(accountInfo);
      await this.profileRepository.create({ ...profileInfo, accountId });

      return accountId;
    } catch (error) {
      throw new ServiceError('Could not create new account', {
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
      throw new ServiceError('Could not remove', {
        cause: error as Error,
        details: {
          service: 'account',
          input: accountId,
        },
      });
    }
  }
}

export { AccountService };
