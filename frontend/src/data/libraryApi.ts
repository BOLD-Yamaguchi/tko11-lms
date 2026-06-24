import type { LibraryData } from '../types'
import { USE_MOCK_API } from '../constants/api'
import {
  fetchBorrowLists,
  fetchSearchBooks,
} from '../api/booksApi'
import { mockLibraryData } from './mockLibraryData'

export async function fetchLibraryData(): Promise<LibraryData> {
  const mockData = structuredClone(mockLibraryData)


  try {
    const books = await fetchSearchBooks()

    const borrowingRecords =
      await fetchBorrowLists()

      console.log("📘 API books:", books)
      console.log("📚 API borrowingRecords:", borrowingRecords)

    return {
      ...mockData,
      books,
      borrowingRecords,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
