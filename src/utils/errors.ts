import { logger } from './logger';

type ErrorOpts = {
  details?: Record<string, unknown>;
  cause?: Error;
  logError?: boolean;
};

export class CustomError extends Error {
  details?: Record<string, unknown>;
  cause?: Error;

  constructor(message: string, opts?: ErrorOpts) {
    super(message);
    this.name = 'CustomError';

    if (opts) {
      if (opts.details) {
        this.details = opts.details;
      }

      if (opts.cause) {
        this.cause = opts.cause;
        if (opts.cause.message) {
          this.message += `: ${opts.cause.message}`;
        }
      }

      if (opts.logError) {
        logger.error(this);
      }
    }
  }
}

export class ServiceError extends CustomError {
  name = 'ServiceError';
}

export class RepositoryError extends CustomError {
  name = 'RepositoryError';
}

export class SelectionDataConversionError extends CustomError {
  name = 'SelectionDataConversionError';
}

export class DatabaseInstanceError extends CustomError {
  name = 'DatabaseInstanceError';
}

export class EndpointHandlerError extends CustomError {
  name = 'EndpointHandlerError';
}

export class ApiMiddlewareError extends CustomError {
  name = 'ApiMiddlewareError';
}

export class ValidationError extends CustomError {
  name = 'ValidationError';
}

export class ApplicationError extends CustomError {
  name = 'ApplicationError';
}

export class NotFoundError extends CustomError {
  name = 'NotFoundError';
}

const ErrorMessagesAuthorizationMiddleware = {
  REQUEST_NOT_AUTHORIZED: "Not authorized to perform the request's action",
};

const ErrorMessagesAccount = {
  CREATE_ACCOUNT_INVALID_ACCOUNT_INFO: 'Account information is invalid',
  CREATE_ACCOUNT_EMAIL_ALREADY_IN_USE: 'Email already in use',
  CREATE_ACCOUNT_USERHANDLE_ALREADY_IN_USE: 'User handle already in use',
  ACCOUNT_NOT_FOUND: 'Account not found',
  COULD_NOT_DELETE_ACCOUNT: 'The account could not be deleted',
};

const ErrorMessagesLogin = {
  LOGIN_INVALID_DATA_INFO: 'Login information is invalid',
  LOGIN_WRONG_USERNAME_OR_PASSWORD: 'Wrong username or password',
};

const ErrorMessagesSelection = {
  CREATE_SELECTION_INVALID_DATA_FORMAT:
    "The selection's data format is invalid",
  SELECTION_NOT_FOUND: 'Selection not found',
  COULD_NOT_DELETE_SELECTION: 'The selection could not be deleted',
};

const ErrorMessagesProfile = {
  PROFILE_NOT_FOUND: 'Profile not found',
};

const ErrorMessagesComment = {
  CREATE_COMMENT_INVALID_DATA_FORMAT: "The comment's data format is invalid",
  CREATE_COMMENT_BODY_NOT_DEFINED: "The comment's body is not defined",
  COULD_NOT_DELETE_COMMENT: 'The comment could not be deleted',
  COMMENT_NOT_FOUND: 'Comment not found',
};

const ErrorMessagesShared = {
  INVALID_ID: 'The provided id is invalid',
};

export const ErrorMessages = {
  ...ErrorMessagesAccount,
  ...ErrorMessagesLogin,
  ...ErrorMessagesSelection,
  ...ErrorMessagesProfile,
  ...ErrorMessagesComment,
  ...ErrorMessagesShared,
  ...ErrorMessagesAuthorizationMiddleware,
};
