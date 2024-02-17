import { compare } from 'bcryptjs';
import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ModelStatic, Op, Sequelize } from 'sequelize';
import Supertest from 'supertest';

import { AccountModel } from '../../models';
import { ProfileModel } from '../../models/profile';
import { AccountRepository, ProfileRepository } from '../../repositories';
import { AccountService } from '../../services/account';
import { ErrorMessages } from '../../utils/errors';
import { setupServer } from './setupServer';

describe('INTEGRATION: signup, login and session routes', () => {
  let api: Express,
    db: Sequelize,
    accountModel: ModelStatic<AccountModel>,
    profileModel: ModelStatic<ProfileModel>,
    mockAccountService: AccountService;

  beforeAll(async () => {
    const server = await setupServer();
    api = server.api;
    db = server.db;
    accountModel = db.model('account');
    profileModel = db.model('profile');
    mockAccountService = new AccountService(
      {} as AccountRepository,
      {} as ProfileRepository
    );
  });

  afterEach(async () => {
    //cleanup
    await db.truncate();
  });

  describe('/signup', () => {
    it('should signup with valid data', async () => {
      const mockAccountInfo = {
        handle: 'somehandler',
        name: 'some name',
        email: 'thisemail@is.fake',
        password: 'somepassword',
      };

      const response = await Supertest(api)
        .post('/api/v1/signup')
        .send(mockAccountInfo)
        .set('Accept', 'application/json');

      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.status).toEqual(StatusCodes.CREATED);
      const account = await accountModel.findOne({
        where: { email: { [Op.eq]: mockAccountInfo.email } },
      });

      expect(account).not.toBe(null);

      const { id, password } = account!.toJSON();
      expect(response.body.id).toEqual(id);
      const passwordCheck = await compare(mockAccountInfo.password, password);
      expect(passwordCheck).toEqual(true);

      const profileCount = await profileModel.count({
        where: { name: { [Op.eq]: mockAccountInfo.name } },
      });

      expect(profileCount).toEqual(1);
    });

    it.each([
      [{ email: 'someemail@email.com', handle: 'somehandle' }],
      [{ email: 'someemail@email.com', name: 'somename' }],
      [{ name: 'somename', handle: 'somehandle' }],
      [{ email: 'someemail@email.com' }],
      [{ name: 'somename' }],
      [{ handle: 'somehandle' }],
      [{}],
    ] as object[])(
      'fails by not sending required information (%p)',
      async (mockAccountInfo) => {
        const response = await Supertest(api)
          .post('/api/v1/signup')
          .send(mockAccountInfo)
          .set('Accept', 'application/json');

        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
        expect(response.body.message).toEqual(
          ErrorMessages.CREATE_ACCOUNT_INVALID_ACCOUNT_INFO
        );
      }
    );

    it('fails by trying to create an account with a user handle already in use', async () => {
      const mockHandle = 'somehandle1';
      const mockAccountInfo = {
        name: 'somename',
        email: 'someemail1@email.com',
        handle: mockHandle,
        password: 'avalidpassword',
      };

      await accountModel.create({
        email: 'someotheremail1@email.com',
        handle: mockHandle,
        password: mockAccountInfo.password,
      });

      const response = await Supertest(api)
        .post('/api/v1/signup')
        .send(mockAccountInfo)
        .set('Accept', 'application/json');

      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.status).toEqual(StatusCodes.CONFLICT);
      expect(response.body.message).toEqual(
        ErrorMessages.CREATE_ACCOUNT_USERHANDLE_ALREADY_IN_USE
      );
    });

    it('fails by trying to create an account with a email already in use', async () => {
      const mockEmail = 'someemail2@email.com';
      const mockAccountInfo = {
        name: 'somename',
        email: mockEmail,
        handle: 'somehandle2',
        password: 'avalidpassword',
      };

      await accountModel.create({
        email: mockAccountInfo.email,
        handle: 'someotherhandle2',
        password: mockAccountInfo.password,
      });

      const response = await Supertest(api)
        .post('/api/v1/signup')
        .send(mockAccountInfo)
        .set('Accept', 'application/json');

      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.status).toEqual(StatusCodes.CONFLICT);
      expect(response.body.message).toEqual(
        ErrorMessages.CREATE_ACCOUNT_EMAIL_ALREADY_IN_USE
      );
    });
  });

  describe('/login', () => {
    it('should login an existing user with user handle', async () => {
      const mockUserhandle = 'someuserhandle';
      const mockPassword = 'somepassword';
      const mockHashedPassword =
        await mockAccountService.hashPassword(mockPassword);
      const mockLoginData = {
        login: mockUserhandle,
        password: mockPassword,
      };

      await accountModel.create({
        email: 'someemail1@email.com',
        handle: mockUserhandle,
        password: mockHashedPassword,
      });

      const apiResponse = await Supertest(api)
        .post('/api/v1/login')
        .send(mockLoginData)
        .set('Accept', 'application/json');

      expect(apiResponse.status).toEqual(StatusCodes.OK);
      expect(
        (apiResponse.headers['set-cookie'] as unknown as Array<string>).some(
          (cookie) =>
            ['accessToken', 'Max-Age', 'Domain', 'HttpOnly'].every((prop) =>
              cookie.includes(prop)
            )
        )
      ).toEqual(true);

      expect(
        (apiResponse.headers['set-cookie'] as unknown as Array<string>).some(
          (cookie) =>
            ['refreshToken', 'Max-Age', 'Domain', 'HttpOnly'].every((prop) =>
              cookie.includes(prop)
            )
        )
      ).toEqual(true);
    });
  });
});
