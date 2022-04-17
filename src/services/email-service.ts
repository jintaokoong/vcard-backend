import { get } from '../configuration/envvar';
import { compose, send } from '../utilities/email-utils';
import { tryCatchAsync } from '../utilities/fp-utils';
import { defaultTo, prop } from 'ramda';
import { VcardError } from '../interfaces/shared/vcard-error';

const sendInvitation = async (email: string, pass: string) => {
  const origin = get('GMAIL');
  if (!origin) {
    return {
      _tag: 'Left',
      value: new VcardError('server_error', 'Server configuration error'),
    };
  }
  const contents = compose(
    origin,
    email,
    'Invitation to Vcard App',
    `You have been invited to use vcard app, here is your temporary password ${pass}. Click <a href='${get(
      'FRONTEND_URL',
    )}'>here</a> to start creating your first card.`,
  );
  return tryCatchAsync(
    () => send(contents),
    (error) => {
      const message = prop('message', error);
      return new VcardError(
        'server_error',
        defaultTo('Something went wrong')(message),
      );
    },
  );
};

const emailService = {
  sendInvitation,
};

export default emailService;
