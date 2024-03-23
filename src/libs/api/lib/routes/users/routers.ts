import { Hono } from "hono";
import pool from "../../../../db/index.js";
import { zValidator } from "@hono/zod-validator";
import { CreateUserSchema, GetByIdSchema } from "./schemas";

export const usersRouter = new Hono()
  .get("/", async (c) => {
    try {
      const res = await pool.query("SELECT * FROM users");
      return c.json(res);
    } catch (err) {
      return c.json(err);
    }
  })
  .get("/:id", zValidator("param", GetByIdSchema), async (c) => {
    const id = c.req.valid("param");

    const queryText = "SELECT * FROM users WHERE id = $1";
    const queryValues = [id.id];

    try {
      const res = await pool.query(queryText, queryValues);
      return c.json(res);
    } catch (err) {
      return c.json(err);
    }
  })
  .post("/", zValidator("json", CreateUserSchema), async (c) => {
    const { username, email, password } = c.req.valid("json");

    const queryText =
      "INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *";
    const queryValues = [username, email, password];

    try {
      const res = await pool.query(queryText, queryValues);
      return c.json(res);
    } catch (e) {
      return c.json(e);
    }
  });
