import { Hono } from "hono";
import { mainRouter } from "./libs/api/index.js";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

const app = new Hono().use("*", cors()).route("/", mainRouter);

serve({
  fetch: app.fetch,
  port: 3000,
}).on("listening", () => {
  console.log(">>> API running on: http://localhost:3000");
});

export default mainRouter;
