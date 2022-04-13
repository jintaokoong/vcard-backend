import { Router } from "express";

const router = Router();

router.get('/', (_, res) => {
  res.send({
    message: 'service is up!',
  });
})

export default router;