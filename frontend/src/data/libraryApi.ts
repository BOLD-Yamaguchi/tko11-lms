import type { LibraryData } from '../types'
import {
  fetchBorrowLists,
  fetchSearchBooks,
  fetchReservationLists,
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
    
    const reservationRecords =await fetchReservationLists()
    console.log("📚 API reservationRecords:", reservationRecords)

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
