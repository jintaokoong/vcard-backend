import { Either } from '../interfaces/fp/either';

export const tryCatchAsync = async <T, U extends any>(
  operation: () => Promise<U>,
  handler: (error: any) => T,
): Promise<Either<T, U>> => {
  try {
    const resp = await operation();
    return {
      _tag: 'Right',
      value: resp,
    };
  } catch (err) {
    return {
      _tag: 'Left',
      value: handler(err),
    };
  }
};

export const foldR =
  <T, U extends any>(either: Either<T, U>) =>
  (right: (value: U) => any, left: (value: T) => any) => {
    if (either._tag === 'Left') {
      return left(either.value);
    } else {
      return right(either.value);
    }
  };

export const fold =
  <T, U extends any>(right: (value: U) => any, left: (value: T) => any) =>
  (either: Either<T, U>) => {
    if (either._tag === 'Left') {
      return left(either.value);
    } else {
      return right(either.value);
    }
  };
