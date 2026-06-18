import type { LibraryData } from '../types'
import { USE_MOCK_API } from '../constants/api'
import { searchBooks } from '../api/booksApi'
import { mockLibraryData } from './mockLibraryData'

export async function fetchLibraryData(): Promise<LibraryData> {
  const mockData = structuredClone(mockLibraryData)

  try {
    const books = await searchBooks()
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
