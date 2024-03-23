import { Hono } from "hono";

export const testRouter = new Hono().get("/", async (c) => {
  return c.json("Hello!");
});
