import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string(),
});

export const GetByIdSchema = z.object({
  id: z.string(),
});
