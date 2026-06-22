import type { LibraryData } from '../types'
import { USE_MOCK_API } from '../constants/api'
import {
  fetchBorrowLists,
  fetchHistoryLists,
  fetchMyPageInformation,
  fetchReservationLists,
  fetchSearchBooks,
} from '../api/booksApi'
import { mockLibraryData } from './mockLibraryData'

export async function fetchLibraryData(): Promise<LibraryData> {
  const mockData = structuredClone(mockLibraryData)

  if (USE_MOCK_API) {
    void fetchMyPageInformation()
    void fetchBorrowLists()
    void fetchHistoryLists()
    void fetchReservationLists()
  }

  try {
    const books = await fetchSearchBooks()
    return {
      ...mockData,
      books,
    }
  } catch (error) {
    if (USE_MOCK_API) {
      return mockData
    }

    throw error
  }
}
