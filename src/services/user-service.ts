import app from '../configuration/firebase';
import { VcardError } from '../interfaces/shared/vcard-error';
import { tryCatchAsync } from '../utilities/fp-utils';
import { defaultTo, pipe, prop } from 'ramda';

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
};

export default userService;
