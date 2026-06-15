import { API_ENDPOINTS } from '../constants/api'
import { httpClient } from './httpClient'

export async function deleteBook(id: string) {
  await httpClient.delete(`${API_ENDPOINTS.books}/${encodeURIComponent(id)}`, {
    json: { id },
  })
}
