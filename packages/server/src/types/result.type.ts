import type { TyranError, ValueOf } from 'shared';

export type ResultErrorCode = ValueOf<typeof TyranError> | (string & {});

export type Result =
  | {
    status: 'SUCCESS';
    data?: unknown;
  }
  | {
    status: 'ERROR';
    errorCode: ResultErrorCode;
  };
