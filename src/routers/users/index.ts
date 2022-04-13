import app from "configuration/firebase";
import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
  return app.auth().listUsers().then((values) => {
    return res.send(values);
  })
})

export default router;