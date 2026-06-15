import { z } from 'zod'

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  employee_code: z.string(),
  role: z.number(),
  department: z.number(),
})

export const usersSchema = z.array(userSchema)

export type User = z.infer<typeof userSchema>
