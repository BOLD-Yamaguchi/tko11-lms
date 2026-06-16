import { API_ENDPOINTS, USE_MOCK_API } from '../constants/api'
import type {
  Book,
  BorrowingRecord,
  CatalogBook,
  ReservationRecord,
  UserLoanHistory,
} from '../types'
import { httpClient } from './httpClient'

type UnknownPayload = Record<string, unknown>

async function callBookApi(request: () => Promise<unknown>) {
  try {
    await request()
  } catch (error) {
    if (!USE_MOCK_API) {
      throw error
    }
  }
}

function post(endpoint: string, payload: UnknownPayload) {
  return callBookApi(() => httpClient.post(endpoint, { json: payload }).json())
}

export async function registerBook(book: Book) {
  await post(API_ENDPOINTS.book, { book })
}

export async function fetchBookDetail(bookId: string): Promise<void> {
  await callBookApi(() => httpClient.get(API_ENDPOINTS.bookDetail(bookId)).json())
}

export async function fetchBorrowLists(): Promise<void> {
  await callBookApi(() => httpClient.get(API_ENDPOINTS.borrowLists).json<BorrowingRecord[]>())
}

export async function fetchHistoryLists(): Promise<void> {
  await callBookApi(() => httpClient.get(API_ENDPOINTS.historyLists).json<UserLoanHistory[]>())
}

export async function fetchReservationLists(): Promise<void> {
  await callBookApi(() => httpClient.get(API_ENDPOINTS.reservationLists).json<ReservationRecord[]>())
}

export async function searchBooks(
  bookId: string,
  conditions: Record<string, string>,
): Promise<void> {
  const searchParams = Object.fromEntries(
    Object.entries(conditions).filter(([, value]) => value.trim()),
  )

  await callBookApi(() => (
    httpClient.get(API_ENDPOINTS.bookSearch(bookId), { searchParams }).json<CatalogBook[]>()
  ))
}

export async function requestBookReturn(payload: UnknownPayload) {
  await post(API_ENDPOINTS.returnRequest, payload)
}

export async function approveBookReturn(payload: UnknownPayload) {
  await post(API_ENDPOINTS.returnApprove, payload)
}

export async function reserveBook(payload: UnknownPayload) {
  await post(API_ENDPOINTS.reserve, payload)
}

export async function lendBook(payload: UnknownPayload) {
  await post(API_ENDPOINTS.lend, payload)
}

export async function cancelBookReservation(payload: UnknownPayload) {
  await post(API_ENDPOINTS.reserveCancel, payload)
}

export async function rejectBookReturnRequest(payload: UnknownPayload) {
  await post(API_ENDPOINTS.returnReject, payload)
}

export async function directlyReturnBook(payload: UnknownPayload) {
  await post(API_ENDPOINTS.directReturn, payload)
}

export async function updateBookInformation(bookId: string, book: Book) {
  await callBookApi(() => (
    httpClient.put(API_ENDPOINTS.bookUpdate(bookId), { json: { book } }).json()
  ))
}

export async function bulkReturnBooks(records: BorrowingRecord[]) {
  await post(API_ENDPOINTS.bulkReturn, { records })
}

export async function importBooksFromCsv(books: Book[]) {
  await post(API_ENDPOINTS.csvImport, { books })
}

export async function fetchMyPageInformation(): Promise<void> {
  await callBookApi(() => httpClient.get(API_ENDPOINTS.myPage).json())
}

export async function updateBookHistoryVisibility(
  bookId: string,
  visibleHistoryIds: string[],
) {
  await callBookApi(() => (
    httpClient.put(API_ENDPOINTS.historyLists, {
      json: {
        bookId,
        visibleHistoryIds,
      },
    }).json()
  ))
}

export async function deleteBook(id: string) {
  await callBookApi(() => (
    httpClient.delete(`${API_ENDPOINTS.books}/${encodeURIComponent(id)}`, {
      json: { id },
    }).json()
  ))
}
