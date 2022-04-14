import cors from "cors";
import express from "express";
import routers from "routers";
import { json } from 'body-parser';

const app = express();

app.use(
  cors({
    origin: ["https://localhost:3000"],
  })
);
app.use(json());

app.use("/", routers.rootRouter);
app.use("/users", routers.userRouter);

export default app;
