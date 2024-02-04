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

export enum ErrorMessages {
  CREATE_ACCOUNT_INVALID_ACCOUNT_INFO = 'Account information is invalid',
  CREATE_ACCOUNT_EMAIL_ALREADY_IN_USE = 'Email already in use',
  CREATE_ACCOUNT_USERHANDLE_ALREADY_IN_USE = 'User handle already in use',
}
