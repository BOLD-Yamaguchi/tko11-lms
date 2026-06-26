import type { LibraryData } from '../types'
import {
  fetchBorrowLists,
  fetchSearchBooks,
  fetchReservationLists,
} from '../api/booksApi'
import { mockLibraryData } from './mockLibraryData'

export async function fetchLibraryData(): Promise<LibraryData> {
  try {
    const books =
      await fetchSearchBooks()
    const borrowingRecords =
      await fetchBorrowLists()

    console.log("📘 API books:", books)
    console.log("📚 API borrowingRecords:", borrowingRecords)
    const reservationRecords =
      await fetchReservationLists()
    console.log("📚 API reservationRecords:", reservationRecords
    )

    return {
      ...mockLibraryData,
      books,
      borrowingRecords,
      reservationRecords,
      bookStatusDetails: mockLibraryData.bookStatusDetails,
      historyVisibility: mockLibraryData.historyVisibility,
      returnComments: mockLibraryData.returnComments,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}