import { upperFirst } from './upper-first';

export class UniqueConstraintError<T extends string> extends Error {
  constructor(param: T) {
    super(`${upperFirst(param)} must be unique.`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UniqueConstraintError);
    }
  }
}

export class InvalidPropertyError<T> extends Error {
  constructor(param: T) {
    super(`${param}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError);
    }
  }
}

export class RequiredParameterError<T> extends Error {
  constructor(param: T) {
    super(`${param} can not be null or undefined.`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError);
    }
  }
}

export class InvalidOperationError<T> extends Error {
  constructor(param: T) {
    super(`${param}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidOperationError);
    }
  }
}

export class NotFoundError<T> extends Error {
  constructor(param: T) {
    super(`${param}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

export class UnauthorizedError<T> extends Error {
  constructor(param: T) {
    super(`${param}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

export class ForbiddenError<T> extends Error {
  constructor(param: T) {
    super(`${param}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}
