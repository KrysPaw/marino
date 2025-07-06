import type { Result, ResultErrorCode } from '../types/result.type';

export const result = <T extends Result['status']>(
  status: T,
  dataOrErrorCode?: T extends 'SUCCESS' ? unknown : ResultErrorCode
): Result => {
  if (status === 'SUCCESS') {
    return { status, data: dataOrErrorCode } as Result;
  }

  return { status, errorCode: dataOrErrorCode } as Result;
};
