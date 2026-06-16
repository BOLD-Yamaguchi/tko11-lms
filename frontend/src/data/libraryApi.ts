import type { LibraryData } from '../types'
import { API_ENDPOINTS, USE_MOCK_API } from '../constants/api'
import { httpClient } from '../api/httpClient'
import {
  fetchBorrowLists,
  fetchHistoryLists,
  fetchMyPageInformation,
  fetchReservationLists,
} from '../api/booksApi'
import { mockLibraryData } from './mockLibraryData'

export async function fetchLibraryData(): Promise<LibraryData> {
  if (USE_MOCK_API) {
    void fetchMyPageInformation()
    void fetchBorrowLists()
    void fetchHistoryLists()
    void fetchReservationLists()
    return structuredClone(mockLibraryData)
  }

  return httpClient.get(API_ENDPOINTS.libraryData).json<LibraryData>()
}
