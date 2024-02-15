import { Sequelize, Transaction } from 'sequelize';

import { IJWTToken, JWTTokenModel } from '../../models';
import { JWTTokenRepository } from './TokenRepository';

jest.mock('sequelize');

describe('JWTToken Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('registers a new access token in the invalidated_jwttokens table', async () => {
      const mockToken: IJWTToken = {
        token: 'some.jwt.token',
        accountId: 'someaccount',
        expiresAt: new Date(Date.now() + 86400 * 1000),
        type: 'access',
      };

      const mockTokenId = 'fakeid';

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(JWTTokenModel, 'create').mockResolvedValueOnce({
        get: () => mockTokenId,
      });

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(JWTTokenModel);

      const tokenRepository = new JWTTokenRepository(sequelize);

      const result = await tokenRepository.create(mockToken);

      expect(result).toEqual(mockTokenId);
    });

    it('registers a new refresh token in the invalidated_jwttokens table', async () => {
      const mockToken: IJWTToken = {
        token: 'some.jwt.token',
        accountId: 'someaccount',
        expiresAt: new Date(Date.now() + 86400 * 1000),
        type: 'refresh',
      };

      const mockTokenId = 'fakeid';

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(JWTTokenModel, 'create').mockResolvedValueOnce({
        get: () => mockTokenId,
      });

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(JWTTokenModel);

      const tokenRepository = new JWTTokenRepository(sequelize);

      const result = await tokenRepository.create(mockToken);

      expect(result).toEqual(mockTokenId);
    });
  });

  describe('remove', () => {
    it('removes a jwt token from the invalidated_jwttokens table', async () => {
      const mockJWTTokenString = 'some.jwt.token';

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest.spyOn(mockTransaction, 'commit').mockResolvedValueOnce();
      jest.spyOn(mockTransaction, 'rollback').mockResolvedValueOnce();
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(JWTTokenModel, 'destroy').mockResolvedValueOnce(1);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(JWTTokenModel);

      const tokenRepository = new JWTTokenRepository(sequelize);

      const result = await tokenRepository.remove(mockJWTTokenString);

      expect(result).toEqual(true);
    });
  });

  describe('retrieve', () => {
    it('retrieves an invalidated toke from the db', async () => {
      const mockJWTTokenString = 'some.jwt.token';
      const mockJWTRecord = {
        id: 'someid',
        token: mockJWTTokenString,
        type: 'access',
        expiresAt: new Date(),
        accountId: 'someaccountid',
      };

      const sequelize = new Sequelize();

      jest.spyOn(JWTTokenModel, 'findOne').mockResolvedValueOnce({
        toJSON: () => mockJWTRecord,
      } as JWTTokenModel);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(JWTTokenModel);

      const tokenRepository = new JWTTokenRepository(sequelize);

      const result = await tokenRepository.retrieve(mockJWTTokenString);

      expect(result).toEqual(mockJWTRecord);
    });

    it('tries to retrieve an invalidated toke from the db that does not exist', async () => {
      const mockJWTTokenString = 'some.jwt.token';

      const sequelize = new Sequelize();

      jest.spyOn(JWTTokenModel, 'findOne').mockResolvedValueOnce(null);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(JWTTokenModel);

      const tokenRepository = new JWTTokenRepository(sequelize);

      const result = await tokenRepository.retrieve(mockJWTTokenString);

      expect(result).toEqual(null);
    });
  });
});
