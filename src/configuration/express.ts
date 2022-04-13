import express from 'express';
import routers from 'routers';

const app = express();

app.use('/', routers.rootRouter);
app.use('/users', routers.userRouter);

export default app;