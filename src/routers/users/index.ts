import app from "configuration/firebase";
import { Router } from "express";
import { assoc, map, omit } from "ramda";
import { authorize } from "routers/middlewares/authorize";

const router = Router();

router.use(authorize);

router.get('/', (_, res) => {
  return app.auth().listUsers().then((values) => {
    const hidden = map(omit(['passwordHash', 'passwordSalt']), values.users);
    return res.send(assoc('users', hidden)(values));
  })
})

export default router;