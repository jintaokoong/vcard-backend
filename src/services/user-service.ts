import app from '../configuration/firebase';
import { VcardError } from '../interfaces/shared/vcard-error';
import { tryCatchAsync } from '../utilities/fp-utils';
import { defaultTo, ifElse, pipe, prop } from 'ramda';
import { Either } from '../interfaces/fp/either';

const elevateUser = (uid: string) =>
  app.auth().setCustomUserClaims(uid, { admin: true });

const setUserType = (uid: string) => async (type: string) => {
  return ifElse(
    (type) => type === 'admin',
    async () =>
      await tryCatchAsync(
        () => elevateUser(uid),
        pipe(
          (error) => error.message,
          (msg) =>
            new VcardError(
              'persistence_error',
              defaultTo('failed to set user type')(msg),
            ),
        ),
      ),
    (): Either<VcardError, void> => ({ _tag: 'Right', value: undefined }),
  )(type);
};

const createUser = async (email: string, password: string) => {
  return await tryCatchAsync(
    () => app.auth().createUser({ email, password }),
    (error) => {
      const { message } = error;
      return new VcardError(
        'persistence_error',
        message ?? 'failed to create user',
      );
    },
  );
};

const deleteUser = async (uid: string) => {
  return await tryCatchAsync(
    () => app.auth().deleteUser(uid),
    pipe(
      prop('message'),
      defaultTo('failed to delete user'),
      (message) => new VcardError('persistence_error', message as string),
    ),
  );
};

const userService = {
  createUser,
  deleteUser,
  elevateUser,
  setUserType,
};

export default userService;
