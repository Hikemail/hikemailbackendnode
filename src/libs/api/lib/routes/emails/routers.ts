import { Hono } from "hono";
import pool from "../../../../db/index.js";
import { zValidator } from "@hono/zod-validator";
import {
  CreateEmailSchema,
  CreateLinkedEmailSchema,
  GetByIdSchema,
} from "./schemas";

export const emailRouter = new Hono()
  .get("/", async (c) => {
    try {
      const res = await pool.query("SELECT * FROM emails");
      return c.json(res);
    } catch (err) {
      return c.json(err);
    }
  })
  .get("/:id", zValidator("param", GetByIdSchema), async (c) => {
    const id = c.req.valid("param");

    const queryText = "SELECT * FROM emails WHERE id = $1";
    const queryValues = [id.id];

    try {
      const res = await pool.query(queryText, queryValues);
      return c.json(res);
    } catch (err) {
      return c.json(err);
    }
  })
  .post("/", zValidator("json", CreateEmailSchema), async (c) => {
    const { application, filelink } = c.req.valid("json");

    const queryText =
      "INSERT INTO emails(applicationid, filelink) VALUES($1, $2) RETURNING *";
    const queryValues = [application, filelink];
    try {
      const res = await pool.query(queryText, queryValues);
      return c.json(res);
    } catch (e) {
      return c.json(e);
    }
  })
  .post(
    "/createAndLinkEmail",
    zValidator("json", CreateLinkedEmailSchema),
    async (c) => {
      const { position, company, status, username, filelink } =
        c.req.valid("json");
      let userId;
      // get user
      try {
        const queryText = "SELECT id FROM users WHERE username = $1";
        const queryValues = [username];
        userId = await pool.query(queryText, queryValues);
      } catch (err) {
        return c.json(err);
      }
      // get userId from return
      userId = userId.rows[0].id;

      // fuzzy search with soundex
      let application;
      try {
        const queryText =
          "SELECT levenshtein(lower(company), lower($1)) \
          AS leven, applications.id, applications.company, applications.status \
          FROM applications \
          WHERE soundex(company) = soundex($1) \
          AND levenshtein(lower(company), lower($1)) <= 4 \
          AND userid = $2";
        const queryValues = [company, userId];
        application = await pool.query(queryText, queryValues);
        console.log(JSON.stringify(application.rows[0]));
      } catch (err) {
        console.log(err);
        return c.json(err);
      }

      application = application.rows[0];
      let applicationId;

      // if applicationId found
      if (application !== undefined) {
        // update old application
        applicationId = application.id;
        try {
          console.log("updating old");
          if (status > application.status) {
            const queryText =
              "UPDATE applications SET status = $1 WHERE id = $2";
            const queryValues = [status, applicationId];
            await pool.query(queryText, queryValues);
          } else if (status == 0 && application.status == 0) {
            const queryText =
              "UPDATE applications SET status = 1 WHERE id = $1";
            const queryValues = [applicationId];
            await pool.query(queryText, queryValues);
          }
        } catch (err) {
          console.log(err);
          return c.json(err);
        }
      } else {
        // create new application
        console.log("creating new");
        try {
          const queryText =
            "INSERT INTO applications(role, company, userid, status) VALUES($1, $2, $3, $4) RETURNING id";
          const queryValues = [position, company, userId, status];
          applicationId = await pool.query(queryText, queryValues);
          applicationId = applicationId.rows[0].id;
        } catch (err) {
          console.log(err);
          return c.json(err);
        }
      }
      // finally, add email
      try {
        const queryText =
          "INSERT INTO emails(applicationid, filelink) VALUES($1, $2) RETURNING *";
        const queryValues = [applicationId, filelink];
        const res = await pool.query(queryText, queryValues);
        return c.json(res);
      } catch (err) {
        console.log(err);
        return c.json(err);
      }
    },
  );
