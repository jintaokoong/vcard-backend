import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import routers from 'routers';
import { getOr } from './envvar';

const app = express();

const whitelist = getOr('WHITELIST', '');

app.use(
  cors({
    origin: whitelist.split(','),
  }),
);
app.use(json());

app.use('/', routers.rootRouter);
app.use('/users', routers.userRouter);
app.use('/cards', routers.cardRouter);

export default app;
