import app from '../configuration/firebase';
import { VcardError } from '../interfaces/shared/vcard-error';
import { tryCatchAsync } from '../utilities/fp-utils';

const createUser = async (email: string, password: string) => {
  return await tryCatchAsync(() => app.auth().createUser({ email, password }), (error) => {
    const { message } = error;
    return new VcardError('persistence_error', message ?? 'failed to create user');
  })
}

const userService = {
  createUser,
}

export default userService;
