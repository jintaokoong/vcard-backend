import app from 'configuration/firebase';
import { generate } from 'generate-password';
import { Router } from 'express';
import { assoc, identity, map, omit } from 'ramda';
import { authorize } from 'routers/middlewares/authorize';
import authorizeElevated from '../middlewares/authorize-elevated';
import { inviteUserReqSchema } from '../../validations/invite-user-req';
import { tryCatchAsync } from '../../utilities/fp-utils';
import { ValidationError } from 'yup';
import { compose, send } from '../../utilities/email-utils';
import { get } from '../../configuration/envvar';
import emailService from '../../services/email-service';
import userService from '../../services/user-service';
import { VcardError } from '../../interfaces/shared/vcard-error';
import { auth } from 'firebase-admin';
import UserRecord = auth.UserRecord;

const router = Router();

router.use(authorize, authorizeElevated).get('/', (_, res) => {
  return app.auth().listUsers().then((values) => {
    const hidden = map(omit(['passwordHash', 'passwordSalt']), values.users);
    return res.send(assoc('users', hidden)(values));
  })
})

router.post('/', (req, res) => {
  const { body } = req;
  return app.auth().createUser({ email: body.email, password: body.password })
    .then((val) => {
      return res.send(val);
  });
});

router.use(authorize, authorizeElevated).post('/invite', async (req, res) => {
  const { body } = req;
  const result = await tryCatchAsync(() => inviteUserReqSchema.validate(body), (error) => error);
  if (result._tag === 'Left') {
    const message = result.value instanceof ValidationError ? result.value.errors.join(', ') : result.value.message;
    return res.status(400).send({ message: message });
  }
  const pass = generate({
    length: 16,
  });
  const createUserResult = await userService.createUser(body.email, pass);
  if (createUserResult._tag === 'Left') {
    return res.status(500).send(createUserResult.value.getSelf());
  }
  return emailService.sendInvitation(body.email, pass).then(() => {
    return res.send({ message: 'invitation sent' });
  }).catch((error) => {
    console.error(error);
    return res.status(500).send({ message: 'server error' })
  })
})

router.use(authorize, authorizeElevated).get('/elevate', (_, res) => {
  return res.send({ message: 'user authorized' });
});

router.use(authorize).post('/elevate', (req, res) => {
  return app.auth().setCustomUserClaims('', { admin: true })
    .then(() => {
      return res.send({ message: 'user elevated' });
  });
})

export default router;
