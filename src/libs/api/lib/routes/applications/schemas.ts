import { z } from "zod";

export const CreateApplicationSchema = z.object({
  role: z.string(),
  userid: z.number(),
  company: z.string(),
  status: z.number(),
});

export const GetByApplicationIdSchema = z.object({
  applicationid: z.string(),
});

export const GetByIdSchema = z.object({
  id: z.string(),
});
