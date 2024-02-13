type ErrorOpts = {
  details?: Record<string, unknown>;
  cause?: Error;
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

export class ValidationError extends CustomError {
  name = 'ValidationError';
}

export class ApplicationError extends CustomError {
  name = 'ApplicationError';
}

export class NotFoundError extends CustomError {
  name = 'NotFoundError';
}

export enum ErrorMessages {
  CREATE_ACCOUNT_INVALID_ACCOUNT_INFO = 'Account information is invalid',
  CREATE_ACCOUNT_EMAIL_ALREADY_IN_USE = 'Email already in use',
  CREATE_ACCOUNT_USERHANDLE_ALREADY_IN_USE = 'User handle already in use',
  SELECTION_NOT_FOUND = 'Selection not found',
  ACCOUNT_NOT_FOUND = 'Account not found',
  PROFILE_NOT_FOUND = 'Profile not found',
  COMMENT_NOT_FOUND = 'Comment not found',
  CREATE_COMMENT_BODY_NOT_DEFINED = "The comment's body is not defined",
}
