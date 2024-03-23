import { Hono } from "hono";
import pool from "../../../../db/index.js";
import { zValidator } from "@hono/zod-validator";
import {
  CreateApplicationSchema,
  GetByApplicationIdSchema,
  GetByIdSchema,
} from "./schemas";

export const applicationsRouter = new Hono()
  .get("/", async (c) => {
    try {
      const res = await pool.query("SELECT * FROM applications");
      return c.json(res);
    } catch (err) {
      return c.json(err);
    }
  })
  .get("/:id", zValidator("param", GetByIdSchema), async (c) => {
    const id = c.req.valid("param");
    const queryText = "SELECT * FROM applications WHERE id = $1";
    const queryValues = [id.id];
    try {
      const res = await pool.query(queryText, queryValues);
      return c.json(res);
    } catch (err) {
      return c.json(err);
    }
  })
  .get(
    "/getAllEmails/:applicationid",
    zValidator("param", GetByApplicationIdSchema),
    async (c) => {
      const id = c.req.valid("param");
      const queryText = "SELECT * FROM emails WHERE applicationid = $1";
      const queryValues = [id.applicationid];
      try {
        const res = await pool.query(queryText, queryValues);
        return c.json(res);
      } catch (err) {
        return c.json(err);
      }
    },
  )
  .post("/", zValidator("json", CreateApplicationSchema), async (c) => {
    const { role, userid, company, status } = c.req.valid("json");

    const queryText =
      "INSERT INTO applications(role, company, userid, status) VALUES($1, $2, $3, $4) RETURNING *";
    const queryValues = [role, company, userid, status];

    try {
      const res = await pool.query(queryText, queryValues);
      return c.json(res);
    } catch (e) {
      console.log(e);
      return c.json(e);
    }
  });
