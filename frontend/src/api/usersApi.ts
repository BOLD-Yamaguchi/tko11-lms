import { API_ENDPOINTS } from '../constants/api'
import { usersSchema } from '../schemas/userSchema'
import { httpClient } from './httpClient'

export async function fetchUsers() {
  const response = await httpClient.get(API_ENDPOINTS.users).json<unknown>()
  return usersSchema.parse(response)
}
