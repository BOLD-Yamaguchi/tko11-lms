import { z } from "zod";

export const userSchema = z.object({
  userId: z.string(),
  username: z.string(),
  mailAddress: z.string(),
  employeeCode: z.string(),
  affiliationKbn: z.number(),
  adminKbn: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const usersSchema = z.array(userSchema);

export type User = z.infer<typeof userSchema>;

