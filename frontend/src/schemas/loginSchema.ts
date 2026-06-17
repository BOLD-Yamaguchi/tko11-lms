import { z } from 'zod'

export const loginSchema = z.object({
  employeeCode: z.string().min(1, "社員コードを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export type LoginFormValues =
  z.infer<typeof loginSchema>;
