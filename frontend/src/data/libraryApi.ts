import type { LibraryData } from '../types'
import { API_ENDPOINTS, USE_MOCK_API } from '../constants/api'
import { httpClient } from '../api/httpClient'
import { mockLibraryData } from './mockLibraryData'

export async function fetchLibraryData(): Promise<LibraryData> {
  if (USE_MOCK_API) {
    return structuredClone(mockLibraryData)
  }

  return httpClient.get(API_ENDPOINTS.libraryData).json<LibraryData>()
}
