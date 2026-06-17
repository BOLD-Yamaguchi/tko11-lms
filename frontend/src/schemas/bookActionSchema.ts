import { z } from 'zod'

export function createBookActionSchema(
  requireEmployeeId: boolean,
  requirePassword: boolean,
) {
  return z.object({
    employeeId: requireEmployeeId
      ? z.string().trim().min(1, '社員番号を入力してください。')
      : z.string(),
    password: requirePassword
      ? z.string().min(1, 'パスワードを入力してください。')
      : z.string(),
  })
}
