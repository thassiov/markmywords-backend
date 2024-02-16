import { compare } from 'bcryptjs';
import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ModelStatic, Op, Sequelize } from 'sequelize';
import Supertest from 'supertest';

import { AccountModel } from '../../models';
import { ProfileModel } from '../../models/profile';
import { ErrorMessages } from '../../utils/errors';
import { setupServer } from './setupServer';

describe('INTEGRATION: signup, login and session routes', () => {
  let api: Express,
    db: Sequelize,
    // tokenModel: ModelStatic<JWTTokenModel>,
    accountModel: ModelStatic<AccountModel>,
    profileModel: ModelStatic<ProfileModel>;

  beforeAll(async () => {
    const server = await setupServer();
    api = server.api;
    db = server.db;
    // tokenModel = db.model('invalidated_jwttokens');
    accountModel = db.model('account');
    profileModel = db.model('profile');
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
});
