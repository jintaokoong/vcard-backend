import cors from "cors";
import express from "express";
import routers from "routers";

const app = express();

app.use(
  cors({
    origin: ["https://localhost:3000"],
  })
);

app.use("/", routers.rootRouter);
app.use("/users", routers.userRouter);

export default app;
