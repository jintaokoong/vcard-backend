import app from "configuration/firebase";
import { Router } from "express";
import { assoc, map, omit } from "ramda";
import { authorize } from "routers/middlewares/authorize";
import authorizeElevated from '../middlewares/authorize-elevated';

const router = Router();

router.use(authorize).get('/', (_, res) => {
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
})

router.use(authorizeElevated).get('/elevate', (_, res) => {
  return res.send({ message: 'user authorized' });
});

router.use(authorize).post('/elevate', (req, res) => {
  return app.auth().setCustomUserClaims('', { admin: true })
    .then(() => {
      return res.send({ message: 'user elevated' });
  });
})

export default router;
