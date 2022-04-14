import { Either } from '../interfaces/fp/either';
import { VcardError } from '../interfaces/shared/vcard-error';

export const tryCatchAsync = async <T, U extends any>(
  operation: () => Promise<U>,
  handler: (error: any) => T,
): Promise<Either<T, U>> => {
  try {
    const resp = await operation();
    return {
      _tag: "Right",
      value: resp,
    };
  } catch (err) {
    return {
      _tag: "Left",
      value: handler(err),
    };
  }
};
