import express from 'express';
import routers from 'routers';

const app = express();

app.use('/', routers.rootRouter);

export default app;