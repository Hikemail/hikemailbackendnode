import { z } from "zod";

export const CreateEmailSchema = z.object({
  application: z.number(),
  filelink: z.string(),
});

export const CreateLinkedEmailSchema = z.object({
  position: z.string(),
  company: z.string(),
  status: z.number(),
  username: z.string(),
  filelink: z.string(),
});

export const GetByIdSchema = z.object({
  id: z.string(),
});
