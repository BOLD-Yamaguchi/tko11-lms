import type { LibraryData } from '../types'
import { USE_MOCK_API } from '../constants/api'
import {
  fetchBorrowLists,
  fetchReservationLists,
  fetchSearchBooks,
} from '../api/booksApi'
import { mockLibraryData } from './mockLibraryData'

export async function fetchLibraryData(): Promise<LibraryData> {
  const mockData = structuredClone(mockLibraryData)


  try {
    const books = await fetchSearchBooks()

    const borrowingRecords =await fetchBorrowLists()

    const reservationRecords =await fetchReservationLists()

    console.log("📘 API reservationRecords:", reservationRecords)

    return {
      ...mockData,
      books,
      borrowingRecords,
      reservationRecords,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
