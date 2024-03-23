import { Hono } from "hono";
import { usersRouter } from "./routes/users/routers.js";
import { applicationsRouter } from "./routes/applications//routers.js";
import { emailRouter } from "./routes/emails/routers.js";
import { testRouter } from "./test/routers.js";

export const mainRouter = new Hono()
  .route("/", testRouter)
  .route("/users", usersRouter)
  .route("/applications", applicationsRouter)
  .route("/emails", emailRouter);

export type AppType = typeof mainRouter;
