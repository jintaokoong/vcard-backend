import { get } from '../configuration/envvar';
import { compose, send } from '../utilities/email-utils';

const sendInvitation = (email: string, pass: string) => {
  const origin = get('GMAIL');
  if (!origin) {
    throw new Error('server environment variable not setup correctly');
  }
  const contents = compose(origin,
    email,
    'Invitation to Vcard App',
    `You have been invited to use vcard app, here is your temporary password ${pass}.`
  )
  return send(contents);
}

const emailService = {
  sendInvitation,
}

export default emailService;
