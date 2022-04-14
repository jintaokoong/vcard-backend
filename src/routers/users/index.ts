import app from 'configuration/firebase';
import { generate } from 'generate-password';
import { Router } from 'express';
import { assoc, map, omit } from 'ramda';
import { authorize } from 'routers/middlewares/authorize';
import authorizeElevated from 'routers/middlewares/authorize-elevated';
import {
  InviteUserReq,
  inviteUserReqSchema,
} from '../../validations/invite-user-req';
import emailService from 'services/email-service';
import userService from 'services/user-service';
import validationService from 'services/validation-service';
import { foldR } from '../../utilities/fp-utils';

const router = Router();

router.use(authorize, authorizeElevated).get('/', (_, res) => {
  return app
    .auth()
    .listUsers()
    .then((values) => {
      const hidden = map(omit(['passwordHash', 'passwordSalt']), values.users);
      return res.send(assoc('users', hidden)(values));
    });
});

// TODO: to be removed
router.post('/', (req, res) => {
  const { body } = req;
  return app
    .auth()
    .createUser({ email: body.email, password: body.password })
    .then((val) => {
      return res.send(val);
    });
});

router.use(authorize, authorizeElevated).post('/invite', async (req, res) => {
  const { body } = req;
  const validationResult = await validationService.validate<
    typeof body,
    typeof inviteUserReqSchema,
    InviteUserReq
  >(inviteUserReqSchema)(body);
  if (validationResult._tag === 'Left') {
    return res.status(400).send(validationResult.value.getSelf());
  }
  const pass = generate({
    length: 16,
  });
  const createUserResult = await userService.createUser(body.email, pass);
  if (createUserResult._tag === 'Left') {
    return res.status(400).send(createUserResult.value.getSelf());
  }
  const setUserTypeResult = await userService.setUserType(
    createUserResult.value.uid,
  )(validationResult.value.type);
  if (setUserTypeResult._tag === 'Left') {
    return res.status(500).send(setUserTypeResult.value.getSelf());
  }
  const emailResult = await emailService.sendInvitation(
    validationResult.value.email,
    pass,
  );
  if (emailResult._tag === 'Left') {
    return res.status(500).send(emailResult.value.getSelf());
  }
  return res.send({ data: 'invitation sent' });
});

router.use(authorize, authorizeElevated).delete('/:id', async (req, res) => {
  const deleteUserResult = await userService.deleteUser(req.params.id);
  return foldR(deleteUserResult)(
    () => res.send({ message: 'deleted' }),
    (error) => res.send(500).send(error.getSelf()),
  );
});

// TODO: to be removed
router.use(authorize, authorizeElevated).get('/elevate', (_, res) => {
  return res.send({ message: 'user authorized' });
});

// TODO: to be removed
router.use(authorize).post('/elevate', (req, res) => {
  return app
    .auth()
    .setCustomUserClaims('', { admin: true })
    .then(() => {
      return res.send({ message: 'user elevated' });
    });
});

export default router;
